/** Logic thuần của bộ chấm thử (không phụ thuộc trình duyệt, có unit test). */
import { sameOutput, type CompareMode } from './compare';

export type JudgeTest = { name: string; kind: string; input: string; output: string };

export type JudgeData = {
  id: string;
  mode: 'file' | 'stdio';
  input: string;
  output: string;
  program: string;
  timeMs: number;
  compare: CompareMode;
  zipOnly: number;
  tests: JudgeTest[];
};

export type Verdict = 'ac' | 'wa' | 'tle' | 're' | 'nofile';

export const VERDICT_LABEL: Record<Verdict, string> = {
  ac: 'Đúng',
  wa: 'Sai kết quả',
  tle: 'Quá thời gian',
  re: 'Lỗi khi chạy',
  nofile: 'Không tìm thấy file kết quả',
};

/** Kết quả chạy tối thiểu cần để kết luận (khớp RunResult của bộ chạy Python). */
export type RunOutcome = {
  status: 'ok' | 'error' | 'timeout' | 'stopped' | 'crash';
  stdout: string;
  timeMs: number;
  files: Record<string, string | null>;
};

export function verdictFor(
  run: RunOutcome,
  data: JudgeData,
  test: JudgeTest,
  limitMs: number,
): Verdict {
  if (run.status === 'timeout' || run.timeMs > limitMs) return 'tle';
  if (run.status !== 'ok') return 're';
  let produced: string;
  if (data.mode === 'file') {
    const content = run.files[data.output];
    if (content === null || content === undefined) return 'nofile';
    produced = content;
  } else {
    produced = run.stdout;
  }
  return sameOutput(test.output, produced, data.compare) ? 'ac' : 'wa';
}

/** Chấm theo tỉ lệ test đúng (per-test). Trả về điểm làm tròn 2 chữ số và phần trăm. */
export function scorePerTest(verdicts: Verdict[], points: number) {
  const total = verdicts.length;
  const correct = verdicts.filter((v) => v === 'ac').length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const score = total === 0 ? 0 : Math.round(((points * correct) / total) * 100) / 100;
  return { correct, total, percent, score };
}

export function isJudgeData(raw: unknown): raw is JudgeData {
  if (typeof raw !== 'object' || raw === null) return false;
  const d = raw as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    (d.mode === 'file' || d.mode === 'stdio') &&
    typeof d.input === 'string' &&
    typeof d.output === 'string' &&
    typeof d.timeMs === 'number' &&
    Array.isArray(d.tests) &&
    d.tests.every(
      (t) =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as JudgeTest).input === 'string' &&
        typeof (t as JudgeTest).output === 'string',
    )
  );
}
