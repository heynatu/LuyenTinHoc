/**
 * Điều khiển phòng lập trình Python (component PythonLab.astro). Mọi output hiển thị bằng
 * textContent, không chèn HTML. Code nháp tự lưu theo `data-storage-key`.
 */
import { createEditor, type CodeEditor } from '../editor';
import { explainError } from '../python/errors';
import type { PyError, TraceStep } from '../python/protocol';
import { getRunner, type RunResult } from '../python/runner';
import { readStorage, writeStorage } from '../storage';
import { showToast } from '../toast';
import { DEFAULT_TEMPLATE, LAB_TEMPLATES } from './templates';
import { decodeShare, encodeShare, SHARE_LIMIT } from './share';

const DISPLAY_LINES = 10_000;
const RUN_TIMEOUT = 3000;
const TRACE_TIMEOUT = 6000;

export type LabHandle = {
  getCode(): string;
  setCode(code: string): void;
  getStdin(): string;
  fileNames(): { input: string; output: string } | null;
  editor: CodeEditor;
};

const labs = new Map<string, LabHandle>();
export const getLab = (id: string) => labs.get(id);

const $ = <T extends HTMLElement>(root: HTMLElement, selector: string) =>
  root.querySelector<T>(selector);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clipLines(text: string): { text: string; clipped: boolean } {
  let count = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) === 10 && ++count >= DISPLAY_LINES)
      return { text: text.slice(0, i + 1), clipped: true };
  }
  return { text, clipped: false };
}

export function renderError(container: HTMLElement, error: PyError) {
  const help = explainError(error);
  container.replaceChildren();
  const box = el(
    'div',
    'flex flex-col gap-75 rounded-12 border border-border-error bg-surface-error-subtle p-200 text-text-error-inverted',
  );
  box.setAttribute('role', 'alert');
  const where = error.line ? `Lỗi ở dòng ${error.line}: ` : 'Lỗi: ';
  box.append(
    el('p', 'body-4', `${where}${help.title} (${error.type})`),
    el('p', 'body-6', help.explain),
    el('p', 'body-6', `Cách sửa: ${help.hint}`),
  );
  if (error.message)
    box.append(el('pre', 'body-6 font-mono whitespace-pre-wrap break-words', error.message));
  if (help.trap) {
    const link = el('a', 'body-5 underline underline-offset-4', 'Xem bẫy liên quan');
    link.href = `/bay-thuong-gap/${help.trap}`;
    box.append(link);
  }
  container.append(box);
  container.hidden = false;
}

export function statusText(result: RunResult, timeoutMs: number): string {
  switch (result.status) {
    case 'ok':
      return `Chạy xong trong ${Math.max(1, Math.round(result.timeMs))} ms.`;
    case 'error':
      return 'Chương trình dừng vì lỗi.';
    case 'timeout':
      return `Chương trình chạy quá ${timeoutMs / 1000} giây nên đã được dừng. Kiểm tra điều kiện dừng của vòng lặp while hoặc của hàm đệ quy.`;
    case 'stopped':
      return 'Đã dừng chương trình.';
    case 'crash':
      return 'Python bị dừng đột ngột, thường do đệ quy quá sâu. Lần chạy sau sẽ nạp lại Python.';
  }
}

export function initPythonLab(root: HTMLElement) {
  const id = root.dataset.pythonLab ?? 'lab';
  const storageKey = root.dataset.storageKey ?? `lab:${id}`;
  const runner = getRunner();

  const editorHost = $<HTMLElement>(root, '[data-lab-editor]')!;
  const stdinBox = $<HTMLTextAreaElement>(root, '[data-lab-stdin]')!;
  const output = $<HTMLElement>(root, '[data-lab-output]')!;
  const errorBox = $<HTMLElement>(root, '[data-lab-error]')!;
  const fileOut = $<HTMLElement>(root, '[data-lab-file-output]');
  const status = $<HTMLElement>(root, '[data-lab-status]')!;
  const runButton = $<HTMLButtonElement>(root, '[data-lab-run]')!;
  const stopButton = $<HTMLButtonElement>(root, '[data-lab-stop]')!;
  const traceButton = $<HTMLButtonElement>(root, '[data-lab-trace]');
  const fileToggle = $<HTMLInputElement>(root, '[data-lab-filemode]');
  const fileFields = $<HTMLElement>(root, '[data-lab-file-fields]');
  const inName = $<HTMLInputElement>(root, '[data-lab-infile]');
  const outName = $<HTMLInputElement>(root, '[data-lab-outfile]');
  const templateSelect = $<HTMLSelectElement>(root, '[data-lab-template]');

  const initial = root.dataset.initialCode ?? DEFAULT_TEMPLATE.code;
  let code = readStorage(`${storageKey}:code`) ?? initial;
  const savedStdin = readStorage(`${storageKey}:stdin`);
  if (savedStdin !== null) stdinBox.value = savedStdin;
  else if (!root.dataset.initialCode) stdinBox.value = DEFAULT_TEMPLATE.stdin;

  if (root.dataset.share === 'true') {
    const match = /#code=([\w-]+)/.exec(location.hash);
    const shared = match?.[1] ? decodeShare(match[1]) : null;
    if (shared !== null) {
      code = shared;
      showToast({
        tone: 'info',
        message: 'Đã mở code từ đường dẫn chia sẻ. Code chưa chạy: đọc kỹ rồi bấm Chạy.',
      });
    }
  }

  let saveTimer = 0;
  let preloaded = false;
  const preload = () => {
    if (preloaded) return;
    preloaded = true;
    runner.load().catch(() => undefined);
  };

  const editor = createEditor({
    parent: editorHost,
    doc: code,
    lang: 'python',
    label: root.dataset.editorLabel ?? 'Ô soạn code Python',
    onChange: (value) => {
      preload();
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => writeStorage(`${storageKey}:code`, value), 400);
    },
    onRun: () => void run(false),
  });
  editorHost.querySelector('[data-lab-editor-skeleton]')?.remove();
  editorHost.addEventListener('focusin', preload, { once: true });
  stdinBox.addEventListener('input', () => writeStorage(`${storageKey}:stdin`, stdinBox.value));

  const fileMode = () => Boolean(fileToggle?.checked);
  const syncFileFields = () => {
    if (fileFields) fileFields.hidden = !fileMode();
  };
  fileToggle?.addEventListener('change', syncFileFields);
  syncFileFields();

  const setStatus = (text: string) => (status.textContent = text);
  runner.onState((state) => {
    if (state === 'loading')
      setStatus('Đang tải Python. Lần đầu tải khoảng 13 MB, các lần sau nhanh hơn.');
    if (state === 'ready') setStatus(`Python ${runner.version} sẵn sàng.`);
    if (state === 'error')
      setStatus('Không tải được Python. Kiểm tra kết nối mạng rồi bấm Chạy lại.');
  });

  let busy = false;
  const setBusy = (value: boolean) => {
    busy = value;
    runButton.disabled = value;
    if (traceButton) traceButton.disabled = value;
    stopButton.disabled = !value;
    root.setAttribute('aria-busy', String(value));
  };

  async function run(trace: boolean) {
    if (busy) return;
    setBusy(true);
    errorBox.hidden = true;
    errorBox.replaceChildren();
    if (fileOut) fileOut.hidden = true;
    let streamed = '';
    let frame = 0;
    output.textContent = '';
    const flush = () => {
      frame = 0;
      output.textContent = clipLines(streamed).text;
    };
    const files: Record<string, string> = {};
    const outputs: string[] = [];
    const names = fileMode()
      ? { input: inName?.value.trim() || 'BAI1.INP', output: outName?.value.trim() || 'BAI1.OUT' }
      : null;
    if (names) {
      files[names.input] = stdinBox.value;
      outputs.push(names.output);
    }
    if (runner.state !== 'ready')
      setStatus('Đang tải Python. Lần đầu tải khoảng 13 MB, các lần sau nhanh hơn.');
    else setStatus('Đang chạy…');
    const timeoutMs = trace ? TRACE_TIMEOUT : RUN_TIMEOUT;
    let result: RunResult;
    try {
      result = await runner.run({
        code: editor.getValue(),
        stdin: names ? '' : stdinBox.value,
        files,
        outputs,
        trace,
        timeoutMs,
        onStdout: (text) => {
          streamed += text;
          if (!frame) frame = window.requestAnimationFrame(flush);
        },
        onStderr: (text) => {
          streamed += text;
          if (!frame) frame = window.requestAnimationFrame(flush);
        },
      });
    } catch {
      setBusy(false);
      setStatus('Không tải được Python. Kiểm tra kết nối mạng rồi bấm Chạy lại.');
      return;
    }
    if (frame) window.cancelAnimationFrame(frame);
    const shown = clipLines(trace ? (result.traceOutput ?? '') : result.stdout + result.stderr);
    output.textContent = shown.text;
    if (shown.clipped || result.truncated) {
      output.append(
        el(
          'span',
          'caption-2 block pt-100 text-text-tertiary',
          'Output quá dài nên chỉ hiện phần đầu.',
        ),
      );
    }
    if (!output.textContent) {
      output.append(
        el(
          'span',
          'caption-2 text-text-tertiary',
          names ? 'Không in gì ra màn hình.' : 'Chương trình không in gì.',
        ),
      );
    }
    setStatus(statusText(result, timeoutMs));
    if (result.error) renderError(errorBox, result.error);
    if (names && fileOut) {
      const content = result.files[names.output];
      fileOut.hidden = false;
      fileOut.replaceChildren(el('p', 'title-4 text-text-primary', `File ${names.output}`));
      if (content === null || content === undefined) {
        if (result.status === 'ok') {
          renderError(errorBox, {
            type: 'FileNotFoundError',
            message: `Không tìm thấy file ${names.output}. Kiểm tra tên file và chữ hoa chữ thường.`,
            line: null,
          });
        }
        fileOut.append(el('p', 'body-6 text-text-tertiary', 'Chương trình không tạo file này.'));
      } else {
        fileOut.append(
          el(
            'pre',
            'body-6 font-mono whitespace-pre-wrap break-words text-text-primary',
            content || '(file rỗng)',
          ),
        );
      }
    }
    if (trace) renderTrace(result.steps ?? [], result.traceOutput ?? '');
    setBusy(false);
  }

  // ------------------------------------------------------------ Theo dõi từng dòng
  const tracePanel = $<HTMLElement>(root, '[data-lab-trace-panel]');
  const traceEmpty = $<HTMLElement>(root, '[data-lab-trace-empty]');
  const traceBody = $<HTMLElement>(root, '[data-lab-trace-body]');
  const traceRange = $<HTMLInputElement>(root, '[data-lab-trace-range]');
  const traceLabel = $<HTMLElement>(root, '[data-lab-trace-label]');
  const traceCode = $<HTMLElement>(root, '[data-lab-trace-code]');
  const traceVars = $<HTMLElement>(root, '[data-lab-trace-vars]');
  const traceOut = $<HTMLElement>(root, '[data-lab-trace-out]');
  let steps: TraceStep[] = [];
  let traceText = '';
  let codeLines: HTMLElement[] = [];

  function showStep(index: number) {
    const step = steps[index];
    if (!step || !traceLabel || !traceVars || !traceOut) return;
    if (traceRange) traceRange.value = String(index);
    const event =
      step.event === 'return'
        ? 'trả về từ'
        : step.event === 'exception'
          ? 'lỗi trong'
          : 'chạy dòng';
    traceLabel.textContent = `Bước ${index + 1}/${steps.length}: ${event} ${step.event === 'line' ? step.line : step.func === '<module>' ? 'chương trình' : `hàm ${step.func}`}`;
    codeLines.forEach((line, i) => {
      const on = i + 1 === step.line;
      line.classList.toggle('bg-surface-primary-hover', on);
      line.dataset.active = on ? 'true' : 'false';
      if (on) line.scrollIntoView({ block: 'nearest' });
    });
    traceVars.replaceChildren();
    const entries = Object.entries(step.locals);
    if (entries.length === 0)
      traceVars.append(el('p', 'caption-2 text-text-tertiary', 'Chưa có biến nào.'));
    for (const [name, value] of entries) {
      const row = el('div', 'flex gap-100 py-25');
      row.append(
        el('span', 'body-5 w-900 shrink-0 font-mono text-text-primary', name),
        el('span', 'body-6 min-w-0 font-mono break-all text-text-secondary', value),
      );
      traceVars.append(row);
    }
    traceOut.textContent = traceText.slice(0, step.out) || '(chưa in gì)';
  }

  function renderTrace(newSteps: TraceStep[], out: string) {
    steps = newSteps;
    traceText = out;
    if (!traceCode || !traceBody || !traceEmpty) return;
    traceCode.replaceChildren();
    codeLines = editor
      .getValue()
      .split('\n')
      .map((line, i) => {
        const row = el('span', 'flex whitespace-pre');
        row.append(
          el(
            'span',
            'inline-block w-500 shrink-0 pr-100 text-right text-text-tertiary select-none',
            String(i + 1),
          ),
          el('span', '', line || ' '),
        );
        traceCode.append(row);
        return row;
      });
    traceEmpty.hidden = steps.length > 0;
    traceBody.hidden = steps.length === 0;
    if (traceRange) {
      traceRange.max = String(Math.max(0, steps.length - 1));
      traceRange.value = '0';
    }
    if (steps.length > 0) showStep(0);
    if (steps.length >= 1000)
      showToast({
        tone: 'warning',
        message: 'Đã ghi 1000 bước đầu tiên. Thử với dữ liệu nhỏ hơn để xem hết.',
      });
    const tab = root.querySelector<HTMLButtonElement>('[role="tab"][data-tab="theo-doi"]');
    tab?.click();
    tracePanel?.focus();
  }

  traceRange?.addEventListener('input', () => showStep(Number(traceRange.value)));
  $<HTMLButtonElement>(root, '[data-lab-trace-prev]')?.addEventListener('click', () =>
    showStep(Math.max(0, Number(traceRange?.value ?? 0) - 1)),
  );
  $<HTMLButtonElement>(root, '[data-lab-trace-next]')?.addEventListener('click', () =>
    showStep(Math.min(steps.length - 1, Number(traceRange?.value ?? 0) + 1)),
  );

  // ------------------------------------------------------------ Nút
  runButton.addEventListener('click', () => void run(false));
  traceButton?.addEventListener('click', () => void run(true));
  stopButton.addEventListener('click', () => runner.stop());

  templateSelect?.addEventListener('change', () => {
    const template = LAB_TEMPLATES.find((t) => t.id === templateSelect.value);
    if (!template) return;
    editor.setValue(template.code);
    stdinBox.value = template.stdin;
    writeStorage(`${storageKey}:stdin`, template.stdin);
    if (fileToggle) {
      fileToggle.checked = Boolean(template.fileMode);
      if (template.fileMode && inName && outName) {
        inName.value = template.fileMode.input;
        outName.value = template.fileMode.output;
      }
      syncFileFields();
    }
    templateSelect.value = '';
    showToast({ tone: 'info', message: `Đã chuyển sang ${template.label.toLowerCase()}.` });
  });

  $<HTMLButtonElement>(root, '[data-lab-share]')?.addEventListener('click', async () => {
    const value = editor.getValue();
    if (value.length > SHARE_LIMIT) {
      showToast({
        tone: 'error',
        message: `Code dài hơn ${SHARE_LIMIT} ký tự nên không chia sẻ qua đường dẫn được. Hãy tải file .py.`,
      });
      return;
    }
    const url = `${location.origin}${location.pathname}#code=${encodeShare(value)}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast({
        tone: 'success',
        message: 'Đã sao chép đường dẫn chia sẻ. Người mở link phải bấm Chạy thì code mới chạy.',
      });
    } catch {
      showToast({
        tone: 'error',
        message: 'Không sao chép được đường dẫn. Hãy tải file .py để gửi.',
      });
    }
  });

  $<HTMLButtonElement>(root, '[data-lab-download]')?.addEventListener('click', () => {
    const name = fileMode()
      ? (inName?.value.trim() || 'BAI1.INP').replace(/\.INP$/i, '.PY')
      : 'main.py';
    const blob = new Blob([editor.getValue()], { type: 'text/x-python' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  $<HTMLButtonElement>(root, '[data-lab-reset-confirm]')?.addEventListener('click', () => {
    editor.setValue(initial);
    writeStorage(`${storageKey}:code`, initial);
    showToast({ tone: 'success', message: 'Đã đặt lại code về ban đầu.' });
  });

  const handle: LabHandle = {
    getCode: () => editor.getValue(),
    setCode: (value) => editor.setValue(value),
    getStdin: () => stdinBox.value,
    fileNames: () =>
      fileMode()
        ? { input: inName?.value.trim() || 'BAI1.INP', output: outName?.value.trim() || 'BAI1.OUT' }
        : null,
    editor,
  };
  labs.set(id, handle);
  return handle;
}
