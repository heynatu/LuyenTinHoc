import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MOCK_EXAMS } from '../../src/data/mock-exams';
import { CONTESTS } from '../../src/data/contests';
import { sameOutput } from '../../src/lib/judge/compare';
import {
  isJudgeData,
  scorePerTest,
  verdictFor,
  type JudgeData,
  type RunOutcome,
} from '../../src/lib/judge/verdict';

const data = (mode: 'file' | 'stdio'): JudgeData => ({
  id: 'x',
  mode,
  input: 'BAI.INP',
  output: 'BAI.OUT',
  program: 'BAI.PY',
  timeMs: 1000,
  compare: 'tokens',
  zipOnly: 0,
  tests: [],
});
const test1 = { name: 'Test01', kind: 'nho', input: '1\n', output: '3 4\n' };
const run = (over: Partial<RunOutcome>): RunOutcome => ({
  status: 'ok',
  stdout: '',
  timeMs: 10,
  files: {},
  ...over,
});

describe('so sánh kết quả', () => {
  it('tokens bỏ qua khoảng trắng thừa, \\r và dòng trống cuối', () => {
    expect(sameOutput('3 4\n', '3   4\r\n\n\n')).toBe(true);
    expect(sameOutput('3 4\n', '3\n4')).toBe(true);
    expect(sameOutput('3 4', '3 5')).toBe(false);
    expect(sameOutput('3 4', '3 4 5')).toBe(false);
  });
  it('lines giữ ranh giới dòng nhưng bỏ khoảng trắng cuối dòng', () => {
    expect(sameOutput('a b\nc\n', 'a b  \r\nc', 'lines')).toBe(true);
    expect(sameOutput('a b\nc\n', 'a\nb c', 'lines')).toBe(false);
  });
  it('float chấp nhận sai số tương đối 1e-6', () => {
    expect(sameOutput('3.1415926', '3.1415930', 'float')).toBe(true);
    expect(sameOutput('3.14', '3.15', 'float')).toBe(false);
    expect(sameOutput('YES 1.5', 'YES 1.50000', 'float')).toBe(true);
    expect(sameOutput('YES', 'NO', 'float')).toBe(false);
  });
});

describe('kết luận từng test', () => {
  it('vào ra chuẩn: so stdout', () => {
    expect(verdictFor(run({ stdout: '3 4' }), data('stdio'), test1, 3000)).toBe('ac');
    expect(verdictFor(run({ stdout: '3 5' }), data('stdio'), test1, 3000)).toBe('wa');
  });
  it('đọc ghi file: thiếu file kết quả, đúng, sai', () => {
    expect(verdictFor(run({ files: { 'BAI.OUT': null } }), data('file'), test1, 3000)).toBe(
      'nofile',
    );
    expect(verdictFor(run({ files: { 'BAI.OUT': '3 4\n' } }), data('file'), test1, 3000)).toBe(
      'ac',
    );
    expect(verdictFor(run({ stdout: '3 4', files: {} }), data('file'), test1, 3000)).toBe('nofile');
  });
  it('quá thời gian và lỗi khi chạy', () => {
    expect(verdictFor(run({ status: 'timeout' }), data('stdio'), test1, 3000)).toBe('tle');
    expect(verdictFor(run({ stdout: '3 4', timeMs: 3500 }), data('stdio'), test1, 3000)).toBe(
      'tle',
    );
    expect(verdictFor(run({ status: 'error' }), data('stdio'), test1, 3000)).toBe('re');
    expect(verdictFor(run({ status: 'crash' }), data('stdio'), test1, 3000)).toBe('re');
  });
  it('điểm theo tỉ lệ test đúng', () => {
    expect(scorePerTest(['ac', 'ac', 'wa', 'tle'], 5)).toEqual({
      correct: 2,
      total: 4,
      percent: 50,
      score: 2.5,
    });
    expect(scorePerTest([], 5)).toEqual({ correct: 0, total: 0, percent: 0, score: 0 });
    expect(scorePerTest(['ac', 'ac', 'wa'], 5).score).toBe(3.33);
  });
});

describe('bộ test đã sinh trong public/judge', () => {
  const root = join(process.cwd(), 'public', 'judge');
  const problems = join(process.cwd(), 'src', 'content', 'problems');
  const ids = readdirSync(problems);

  it('mỗi bài có tests.json hợp lệ, tối đa 2 MB, và gói zip Themis', () => {
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const file = join(root, id, 'tests.json');
      expect(existsSync(file), `${id}: thiếu tests.json, chạy npm run verify:content`).toBe(true);
      const text = readFileSync(file, 'utf8');
      expect(Buffer.byteLength(text), `${id}: tests.json quá 2 MB`).toBeLessThanOrEqual(2_001_000);
      const json = JSON.parse(text) as unknown;
      expect(isJudgeData(json)).toBe(true);
      const d = json as JudgeData;
      expect(d.id).toBe(id);
      expect(d.tests.length).toBeGreaterThan(0);
      expect(d.tests.some((t) => t.kind === 'vi-du')).toBe(true);
      expect(existsSync(join(root, id, `${d.program.replace(/\.PY$/, '')}_themis.zip`))).toBe(true);
    }
  });

  it('đề thi thử chỉ gồm bài có trong kho, mỗi đề có ít nhất 3 bài', () => {
    expect(new Set(MOCK_EXAMS.map((e) => e.id)).size).toBe(MOCK_EXAMS.length);
    for (const exam of MOCK_EXAMS) {
      expect(exam.problems.length).toBeGreaterThanOrEqual(3);
      for (const p of exam.problems) expect(ids, `${exam.id} trỏ tới ${p.id}`).toContain(p.id);
    }
  });

  it('hồ sơ kỳ thi không gắn thể lệ chưa xác minh như sự thật', () => {
    for (const c of CONTESTS) {
      for (const f of c.facts) {
        if (!f.verified) expect(f.value).toBe('{{CẦN XÁC MINH}}');
      }
    }
  });
});
