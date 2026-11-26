/// <reference lib="webworker" />
/**
 * Web Worker chạy Pyodide. Tách khỏi trang để vòng lặp vô hạn không làm treo giao diện:
 * trang dừng cưỡng bức bằng worker.terminate() khi quá giờ (không cần SharedArrayBuffer, COEP).
 * Pyodide tự host dưới /pyodide/v<phiên bản>/ nên CSP chỉ cần 'self' và 'wasm-unsafe-eval'.
 */
import type { PyodideAPI } from 'pyodide';
import versions from '../../generated/wasm-versions.json';
import {
  OUTPUT_LIMIT,
  type PageMessage,
  type PyError,
  type RunRequest,
  type TraceStep,
  type WorkerMessage,
} from './protocol';
import { parsePythonError } from './errors';
import { PY_SUPPORT } from './support-py';

declare const self: DedicatedWorkerGlobalScope;

const INDEX_URL = `/pyodide/v${versions.pyodide}/`;
let py: PyodideAPI | null = null;
let currentId = 0;
let sent = 0;
let truncated = false;

const post = (message: WorkerMessage) => self.postMessage(message);

function streamWriter(kind: 'stdout' | 'stderr') {
  const decoder = new TextDecoder();
  return {
    isatty: false,
    write(buffer: Uint8Array) {
      if (sent >= OUTPUT_LIMIT) {
        truncated = true;
        return buffer.length;
      }
      const text = decoder.decode(buffer, { stream: true });
      const room = OUTPUT_LIMIT - sent;
      const piece = text.length > room ? text.slice(0, room) : text;
      if (piece.length < text.length) truncated = true;
      sent += piece.length;
      if (piece) post({ type: kind, id: currentId, text: piece });
      return buffer.length;
    },
  };
}

async function init() {
  try {
    const mod = (await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`)) as {
      loadPyodide: (options: Record<string, unknown>) => Promise<PyodideAPI>;
    };
    py = await mod.loadPyodide({ indexURL: INDEX_URL, fullStdLib: false });
    py.setStdout(streamWriter('stdout'));
    py.setStderr(streamWriter('stderr'));
    py.runPython(PY_SUPPORT);
    const version = String(py.runPython('import sys; sys.version.split()[0]'));
    post({ type: 'ready', version });
  } catch (error) {
    post({ type: 'init-error', message: error instanceof Error ? error.message : String(error) });
  }
}

function run(request: RunRequest) {
  if (!py) return;
  currentId = request.id;
  sent = 0;
  truncated = false;
  const { FS } = py;
  const started = performance.now();
  let error: PyError | null = null;
  try {
    py.globals.get('__tdt_reset')();
    for (const [name, content] of Object.entries(request.files)) {
      FS.writeFile(`/home/pyodide/work/${name}`, content);
    }
    FS.writeFile('/tmp/__stdin__', request.stdin);
    py.globals.get('__tdt_run')(request.code, request.trace);
  } catch (caught) {
    const err = caught as { type?: string; message?: string };
    if (err.type) {
      const parsed = parsePythonError(err.type, err.message ?? '');
      // sys.exit() hoặc exit(0) là kết thúc bình thường.
      const normalExit = parsed.type === 'SystemExit' && /^(0|None)?$/.test(parsed.message.trim());
      error = normalExit ? null : parsed;
    } else {
      // Lỗi của chính WebAssembly (tràn ngăn xếp do đệ quy quá sâu…): worker không dùng tiếp được.
      post({ type: 'crash', id: request.id, message: err.message ?? String(caught) });
      return;
    }
  }
  try {
    py.globals.get('__tdt_flush')();
  } catch {
    // Bỏ qua: flush chỉ để giống CPython khi thoát.
  }
  const timeMs = performance.now() - started;
  const files: Record<string, string | null> = {};
  for (const name of request.outputs) {
    const path = `/home/pyodide/work/${name}`;
    try {
      files[name] = FS.analyzePath(path).exists
        ? (FS.readFile(path, { encoding: 'utf8' }) as string)
        : null;
    } catch {
      files[name] = null;
    }
  }
  let steps: TraceStep[] | null = null;
  let traceOutput: string | null = null;
  if (request.trace) {
    const rawSteps = py.globals.get('__tdt_steps')() as string | undefined;
    steps = rawSteps ? (JSON.parse(rawSteps) as TraceStep[]) : [];
    traceOutput = (py.globals.get('__tdt_trace_output')() as string | undefined) ?? '';
  }
  post({
    type: 'done',
    id: request.id,
    ok: error === null,
    timeMs,
    files,
    error,
    steps,
    traceOutput,
    truncated,
  });
}

self.addEventListener('message', (event: MessageEvent<PageMessage>) => {
  const message = event.data;
  if (message.type === 'init') void init();
  else if (message.type === 'run') run(message);
});
