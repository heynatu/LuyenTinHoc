/**
 * Bộ chấm thử trên trình duyệt (mục 2.6): tải bộ test lười từ /judge/<id>/tests.json, chạy code
 * của người học trong Web Worker với từng test, kết luận Đúng, Sai kết quả, Quá thời gian, Lỗi khi
 * chạy, Không tìm thấy file kết quả. Thời gian chỉ là ước lượng.
 */
import { getRunner } from '../python/runner';
import { isJudgeData, verdictFor, type JudgeData, type JudgeTest, type Verdict } from './verdict';

export type TestResult = { test: JudgeTest; index: number; verdict: Verdict; timeMs: number };

const cache = new Map<string, Promise<JudgeData>>();

export function loadTests(id: string): Promise<JudgeData> {
  let promise = cache.get(id);
  if (!promise) {
    promise = fetch(`/judge/${encodeURIComponent(id)}/tests.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Không tải được bộ test (mã ${res.status}).`);
        return res.json() as Promise<unknown>;
      })
      .then((raw) => {
        if (!isJudgeData(raw)) throw new Error('Bộ test không đúng định dạng.');
        return raw;
      });
    promise.catch(() => cache.delete(id));
    cache.set(id, promise);
  }
  return promise;
}

export type JudgeOptions = {
  /** Hệ số nhân giới hạn thời gian vì Python trên trình duyệt chậm hơn máy chấm. */
  factor: number;
  onResult?: (result: TestResult) => void;
  shouldStop?: () => boolean;
};

export async function judgeCode(
  code: string,
  data: JudgeData,
  options: JudgeOptions,
): Promise<TestResult[]> {
  const runner = getRunner();
  await runner.load();
  const limitMs = data.timeMs * options.factor;
  const results: TestResult[] = [];
  for (const [index, test] of data.tests.entries()) {
    if (options.shouldStop?.()) break;
    const run = await runner.run({
      code,
      stdin: data.mode === 'stdio' ? test.input : '',
      files: data.mode === 'file' ? { [data.input]: test.input } : {},
      outputs: data.mode === 'file' ? [data.output] : [],
      timeoutMs: limitMs + 250,
    });
    if (run.status === 'stopped') break;
    const result: TestResult = {
      test,
      index,
      verdict: verdictFor(run, data, test, limitMs),
      timeMs: run.timeMs,
    };
    results.push(result);
    options.onResult?.(result);
  }
  return results;
}
