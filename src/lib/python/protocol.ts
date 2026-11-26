/** Giao thức tin nhắn giữa trang và Web Worker chạy Pyodide (mục 2.5 của SUPER_PROMPT). */

export type TraceStep = {
  line: number;
  event: 'line' | 'return' | 'exception';
  func: string;
  locals: Record<string, string>;
  /** Độ dài output đã in tới bước này (để hiện output từng bước). */
  out: number;
};

export type RunRequest = {
  type: 'run';
  id: number;
  code: string;
  stdin: string;
  /** File ảo ghi vào thư mục làm việc trước khi chạy (ví dụ BAI1.INP). */
  files: Record<string, string>;
  /** File cần đọc lại sau khi chạy (ví dụ BAI1.OUT). */
  outputs: string[];
  trace: boolean;
};

export type PyError = {
  type: string;
  message: string;
  /** Dòng lỗi tính theo code của người học (null nếu không xác định). */
  line: number | null;
};

export type RunDone = {
  type: 'done';
  id: number;
  ok: boolean;
  timeMs: number;
  files: Record<string, string | null>;
  error: PyError | null;
  steps: TraceStep[] | null;
  /** Output trong chế độ theo dõi (gom lại để đối chiếu từng bước). */
  traceOutput: string | null;
  truncated: boolean;
};

export type WorkerMessage =
  | { type: 'ready'; version: string }
  | { type: 'init-error'; message: string }
  | { type: 'stdout'; id: number; text: string }
  | { type: 'stderr'; id: number; text: string }
  | RunDone
  | { type: 'crash'; id: number; message: string };

export type PageMessage = { type: 'init' } | RunRequest;

/** Giới hạn output gửi về trang: 1 MB. */
export const OUTPUT_LIMIT = 1_000_000;
export const TRACE_STEP_LIMIT = 1000;
