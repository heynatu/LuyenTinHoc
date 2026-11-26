/**
 * Điều khiển worker Pyodide từ trang: nạp lười, chạy từng lệnh theo thứ tự, dừng cưỡng bức khi
 * quá giờ hoặc khi người học bấm Dừng (terminate rồi tạo worker mới ở lần chạy sau).
 */
import { OUTPUT_LIMIT, type RunDone, type RunRequest, type WorkerMessage } from './protocol';

export type RunStatus = 'ok' | 'error' | 'timeout' | 'stopped' | 'crash';

export type RunResult = {
  status: RunStatus;
  stdout: string;
  stderr: string;
  timeMs: number;
  files: Record<string, string | null>;
  error: RunDone['error'];
  steps: RunDone['steps'];
  traceOutput: string | null;
  truncated: boolean;
};

export type RunOptions = {
  code: string;
  stdin?: string;
  files?: Record<string, string>;
  outputs?: string[];
  trace?: boolean;
  timeoutMs?: number;
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
};

type Pending = {
  id: number;
  resolve: (result: RunResult) => void;
  stdout: string;
  stderr: string;
  options: RunOptions;
  timer: number;
};

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export class PythonRunner {
  private worker: Worker | null = null;
  private loading: Promise<string> | null = null;
  private pending: Pending | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private nextId = 1;
  version = '';
  state: LoadState = 'idle';
  private listeners = new Set<(state: LoadState) => void>();

  onState(listener: (state: LoadState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(state: LoadState) {
    this.state = state;
    this.listeners.forEach((listener) => listener(state));
  }

  /** Nạp Pyodide (lần đầu tải khoảng 13 MB, sau đó trình duyệt dùng bản đã lưu). */
  load(): Promise<string> {
    if (this.loading) return this.loading;
    this.setState('loading');
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
      name: 'python',
    });
    const worker = this.worker;
    this.loading = new Promise<string>((resolve, reject) => {
      const onMessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data;
        if (message.type === 'ready') {
          this.version = message.version;
          this.setState('ready');
          resolve(message.version);
        } else if (message.type === 'init-error') {
          this.setState('error');
          this.reset();
          reject(new Error(message.message));
        } else {
          this.handle(message);
        }
      };
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', (event) => {
        this.setState('error');
        this.reset();
        reject(new Error(event.message || 'Không khởi động được Python.'));
      });
      worker.postMessage({ type: 'init' });
    });
    return this.loading;
  }

  private handle(message: WorkerMessage) {
    const pending = this.pending;
    if (!pending || !('id' in message) || message.id !== pending.id) return;
    if (message.type === 'stdout') {
      if (pending.stdout.length < OUTPUT_LIMIT) pending.stdout += message.text;
      pending.options.onStdout?.(message.text);
    } else if (message.type === 'stderr') {
      if (pending.stderr.length < OUTPUT_LIMIT) pending.stderr += message.text;
      pending.options.onStderr?.(message.text);
    } else if (message.type === 'done') {
      this.finish({
        status: message.ok ? 'ok' : 'error',
        stdout: pending.stdout,
        stderr: pending.stderr,
        timeMs: message.timeMs,
        files: message.files,
        error: message.error,
        steps: message.steps,
        traceOutput: message.traceOutput,
        truncated: message.truncated,
      });
    } else if (message.type === 'crash') {
      this.reset();
      this.finish(this.emptyResult('crash', pending, message.message));
    }
  }

  private emptyResult(status: RunStatus, pending: Pending, message = ''): RunResult {
    return {
      status,
      stdout: pending.stdout,
      stderr: pending.stderr,
      timeMs: 0,
      files: {},
      error: message ? { type: 'RecursionError', message, line: null } : null,
      steps: null,
      traceOutput: null,
      truncated: false,
    };
  }

  private finish(result: RunResult) {
    const pending = this.pending;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    this.pending = null;
    pending.resolve(result);
  }

  /** Bỏ worker hiện tại; lần chạy sau sẽ nạp lại Python. */
  private reset() {
    this.worker?.terminate();
    this.worker = null;
    this.loading = null;
    this.setState('idle');
  }

  /** Dừng chương trình đang chạy (nút Dừng). */
  stop() {
    const pending = this.pending;
    if (!pending) return;
    this.reset();
    this.finish(this.emptyResult('stopped', pending));
  }

  /** Chạy code. Các lần gọi được xếp hàng, chạy lần lượt. */
  run(options: RunOptions): Promise<RunResult> {
    const task = this.queue.then(() => this.runNow(options));
    this.queue = task.catch(() => undefined);
    return task;
  }

  private async runNow(options: RunOptions): Promise<RunResult> {
    await this.load();
    const worker = this.worker;
    if (!worker) throw new Error('Python chưa sẵn sàng.');
    const id = this.nextId++;
    return new Promise<RunResult>((resolve) => {
      const timeoutMs = options.timeoutMs ?? 3000;
      const pending: Pending = {
        id,
        resolve,
        stdout: '',
        stderr: '',
        options,
        timer: window.setTimeout(() => {
          if (this.pending?.id !== id) return;
          this.reset();
          this.finish({ ...this.emptyResult('timeout', pending), timeMs: timeoutMs });
        }, timeoutMs),
      };
      this.pending = pending;
      const request: RunRequest = {
        type: 'run',
        id,
        code: options.code,
        stdin: options.stdin ?? '',
        files: options.files ?? {},
        outputs: options.outputs ?? [],
        trace: options.trace ?? false,
      };
      worker.postMessage(request);
    });
  }
}

/** Một bộ chạy dùng chung cho cả trang (phòng lập trình, chấm thử, thi thử). */
let shared: PythonRunner | null = null;
export function getRunner(): PythonRunner {
  shared ??= new PythonRunner();
  return shared;
}
