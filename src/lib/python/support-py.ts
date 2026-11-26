/**
 * Mã Python hỗ trợ chạy trong Pyodide (nạp một lần khi worker khởi động).
 * - __tdt_reset: dọn thư mục làm việc ảo /home/pyodide/work và chdir vào đó.
 * - __tdt_run: chạy code của người học trong namespace mới, sys.stdin đọc từ file (có .buffer
 *   để mẫu đọc nhanh sys.stdin.buffer.read() chạy được); chế độ theo dõi dùng sys.settrace.
 * - __tdt_flush: mô phỏng CPython khi thoát: flush mọi file đang mở để file .OUT có dữ liệu.
 */
export const PY_SUPPORT = String.raw`
import sys, io, os, gc, json, types

_WORK = '/home/pyodide/work'
_STEP_LIMIT = 1000
_last_steps = None
_trace_out = None


def __tdt_reset():
    os.makedirs(_WORK, exist_ok=True)
    os.chdir(_WORK)
    for name in os.listdir(_WORK):
        path = os.path.join(_WORK, name)
        if os.path.isfile(path):
            os.remove(path)


def __tdt_flush():
    for obj in gc.get_objects():
        try:
            if isinstance(obj, io.IOBase) and not obj.closed and obj.writable():
                obj.flush()
        except Exception:
            pass


def _short(value, depth=0):
    try:
        if isinstance(value, (bool, int, float, complex, type(None))):
            text = repr(value)
        elif isinstance(value, str):
            text = repr(value if len(value) <= 60 else value[:60] + '…')
        elif isinstance(value, (list, tuple, set)):
            items = list(value)
            if depth >= 2:
                inner = '…'
            else:
                inner = ', '.join(_short(x, depth + 1) for x in items[:20])
                if len(items) > 20:
                    inner += ', … (' + str(len(items)) + ' phần tử)'
            left, right = {list: '[]', tuple: '()', set: '{}'}.get(type(value), '[]')
            text = left + inner + right
        elif isinstance(value, dict):
            pairs = list(value.items())
            inner = ', '.join(_short(k, 2) + ': ' + _short(v, depth + 1) for k, v in pairs[:15])
            if len(pairs) > 15:
                inner += ', …'
            text = '{' + inner + '}'
        else:
            text = '<' + type(value).__name__ + '>'
    except Exception:
        text = '<không hiển thị được>'
    return text if len(text) <= 240 else text[:240] + '…'


class _Limit(Exception):
    pass


def __tdt_steps():
    return None if _last_steps is None else json.dumps(_last_steps)


def __tdt_trace_output():
    return _trace_out


def __tdt_run(code, trace):
    global _last_steps, _trace_out
    _last_steps = None
    _trace_out = None
    sys.stdin = open('/tmp/__stdin__', 'r', encoding='utf-8')
    namespace = {'__name__': '__main__', '__builtins__': __builtins__}
    compiled = compile(code, 'main.py', 'exec')
    if not trace:
        exec(compiled, namespace)
        return

    steps = []
    buffer = io.StringIO()
    real_stdout = sys.stdout

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != 'main.py':
            return None
        if event in ('line', 'return', 'exception'):
            if len(steps) >= _STEP_LIMIT:
                raise _Limit()
            local_vars = {}
            for name, val in frame.f_locals.items():
                if name.startswith('__') or isinstance(val, (types.ModuleType, types.FunctionType, type)):
                    continue
                local_vars[name] = _short(val)
            steps.append({
                'line': frame.f_lineno,
                'event': event,
                'func': frame.f_code.co_name,
                'locals': local_vars,
                'out': len(buffer.getvalue()),
            })
        return tracer

    sys.stdout = buffer
    sys.settrace(tracer)
    try:
        exec(compiled, namespace)
    except _Limit:
        pass
    finally:
        sys.settrace(None)
        sys.stdout = real_stdout
        _last_steps = steps
        _trace_out = buffer.getvalue()
`;
