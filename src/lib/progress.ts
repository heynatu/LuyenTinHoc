/**
 * Tiến độ học (mục 2.8): chỉ lưu trong localStorage của trình duyệt, có phiên bản, xuất nhập JSON.
 * Nhập file: giới hạn kích thước, parse JSON, kiểm tra từng trường, không bao giờ eval.
 */
import { readStorage, removeStorage, writeStorage } from './storage';

export type Progress = {
  v: 1;
  lessons: Record<string, { at: string }>;
  quizzes: Record<string, { score: number; total: number; at: string }>;
  problems: Record<string, { best: number; tests: number; at: string }>;
  exams: { id: string; score: number; max: number; at: string }[];
  puzzles: Record<string, { at: string }>;
  sql: Record<string, { at: string }>;
  days: string[];
};

const KEY = 'progress';
export const IMPORT_LIMIT = 1_000_000;

export const emptyProgress = (): Progress => ({
  v: 1,
  lessons: {},
  quizzes: {},
  problems: {},
  exams: [],
  puzzles: {},
  sql: {},
  days: [],
});

const today = () => new Date().toISOString().slice(0, 10);
const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
const isDate = (x: unknown): x is string =>
  typeof x === 'string' && /^\d{4}-\d{2}-\d{2}/.test(x) && x.length <= 30;
const isId = (x: string) => /^[a-z0-9/-]{1,120}$/.test(x);
const num = (x: unknown, max: number) =>
  typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= max;

/** Kiểm tra và làm sạch dữ liệu (dùng cho cả localStorage lẫn file nhập). Trả null nếu sai định dạng. */
export function sanitize(raw: unknown): Progress | null {
  if (!isRecord(raw) || raw.v !== 1) return null;
  const out = emptyProgress();
  const mapAt = (src: unknown, dst: Record<string, { at: string }>) => {
    if (!isRecord(src)) return;
    for (const [id, val] of Object.entries(src))
      if (isId(id) && isRecord(val) && isDate(val.at)) dst[id] = { at: val.at };
  };
  mapAt(raw.lessons, out.lessons);
  mapAt(raw.puzzles, out.puzzles);
  mapAt(raw.sql, out.sql);
  if (isRecord(raw.quizzes)) {
    for (const [id, val] of Object.entries(raw.quizzes)) {
      if (
        isId(id) &&
        isRecord(val) &&
        num(val.score, 100) &&
        num(val.total, 100) &&
        isDate(val.at)
      ) {
        out.quizzes[id] = { score: val.score as number, total: val.total as number, at: val.at };
      }
    }
  }
  if (isRecord(raw.problems)) {
    for (const [id, val] of Object.entries(raw.problems)) {
      if (
        isId(id) &&
        isRecord(val) &&
        num(val.best, 100) &&
        num(val.tests, 1000) &&
        isDate(val.at)
      ) {
        out.problems[id] = { best: val.best as number, tests: val.tests as number, at: val.at };
      }
    }
  }
  if (Array.isArray(raw.exams)) {
    for (const e of raw.exams.slice(-100)) {
      if (
        isRecord(e) &&
        typeof e.id === 'string' &&
        isId(e.id) &&
        num(e.score, 1000) &&
        num(e.max, 1000) &&
        isDate(e.at)
      ) {
        out.exams.push({ id: e.id, score: e.score as number, max: e.max as number, at: e.at });
      }
    }
  }
  if (Array.isArray(raw.days))
    out.days = [
      ...new Set(raw.days.filter((d): d is string => isDate(d)).map((d) => d.slice(0, 10))),
    ].slice(-400);
  return out;
}

export function loadProgress(): Progress {
  const text = readStorage(KEY);
  if (!text) return emptyProgress();
  try {
    return sanitize(JSON.parse(text)) ?? emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function save(progress: Progress) {
  const day = today();
  if (!progress.days.includes(day)) progress.days.push(day);
  writeStorage(KEY, JSON.stringify(progress));
  document.dispatchEvent(new CustomEvent('tdt:progress'));
}

export function update(mutate: (p: Progress) => void) {
  const progress = loadProgress();
  mutate(progress);
  save(progress);
}

export const markLesson = (id: string) =>
  update((p) => (p.lessons[id] = { at: new Date().toISOString() }));
export const unmarkLesson = (id: string) => update((p) => delete p.lessons[id]);
export const recordQuiz = (id: string, score: number, total: number) =>
  update((p) => {
    const prev = p.quizzes[id];
    if (!prev || score >= prev.score)
      p.quizzes[id] = { score, total, at: new Date().toISOString() };
  });
export const recordProblem = (id: string, best: number, tests: number) =>
  update((p) => {
    const prev = p.problems[id];
    if (!prev || best >= prev.best) p.problems[id] = { best, tests, at: new Date().toISOString() };
  });
export const recordExam = (id: string, score: number, max: number) =>
  update((p) => p.exams.push({ id, score, max, at: new Date().toISOString() }));
export const markPuzzle = (id: string) =>
  update((p) => (p.puzzles[id] = { at: new Date().toISOString() }));
export const markSql = (id: string) =>
  update((p) => (p.sql[id] = { at: new Date().toISOString() }));

/** Chuỗi ngày học liên tiếp tính tới hôm nay (hoặc hôm qua nếu hôm nay chưa học). */
export function streak(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export type Badge = { id: string; title: string; detail: string; earned: boolean };

export function badges(p: Progress): Badge[] {
  const solved = Object.values(p.problems).filter((x) => x.best >= 100).length;
  const lessons = Object.keys(p.lessons).length;
  const quizPerfect = Object.values(p.quizzes).filter(
    (q) => q.score === q.total && q.total > 0,
  ).length;
  const puzzles = Object.keys(p.puzzles).length;
  const sql = Object.keys(p.sql).length;
  const s = streak(p.days);
  return [
    {
      id: 'bai-hoc-dau-tien',
      title: 'Bước đầu tiên',
      detail: 'Hoàn thành 1 bài học',
      earned: lessons >= 1,
    },
    { id: 'cham-hoc', title: 'Chăm học', detail: 'Hoàn thành 10 bài học', earned: lessons >= 10 },
    {
      id: 'trac-nghiem',
      title: 'Trả lời chắc chắn',
      detail: 'Đạt điểm tối đa 5 bài trắc nghiệm',
      earned: quizPerfect >= 5,
    },
    {
      id: 'giai-bai-dau',
      title: 'Bài đầu tiên đạt 100%',
      detail: 'Chấm thử đạt 100% một bài',
      earned: solved >= 1,
    },
    {
      id: 'muoi-bai',
      title: 'Mười bài trọn vẹn',
      detail: 'Chấm thử đạt 100% mười bài',
      earned: solved >= 10,
    },
    {
      id: 'thi-thu',
      title: 'Vào phòng thi',
      detail: 'Hoàn thành một đề thi thử',
      earned: p.exams.length >= 1,
    },
    {
      id: 'tu-duy',
      title: 'Nhà tư duy nhỏ',
      detail: 'Giải 10 câu đố tư duy',
      earned: puzzles >= 10,
    },
    { id: 'sql', title: 'Truy vấn thành thạo', detail: 'Làm đúng 10 bài SQL', earned: sql >= 10 },
    { id: 'chuoi-7', title: 'Bảy ngày liền', detail: 'Học 7 ngày liên tiếp', earned: s >= 7 },
  ];
}

export function exportProgress(): string {
  return JSON.stringify(loadProgress(), null, 2);
}

/** Nhập tiến độ từ chuỗi JSON. Trả về thông báo lỗi tiếng Việt, hoặc null nếu thành công. */
export function importProgress(text: string): string | null {
  if (text.length > IMPORT_LIMIT)
    return 'File quá lớn (giới hạn 1 MB). Hãy chọn đúng file tiến độ đã xuất từ LuyenTinHoc.';
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return 'File không phải JSON hợp lệ. Hãy chọn đúng file tiến độ đã xuất từ LuyenTinHoc.';
  }
  const clean = sanitize(raw);
  if (!clean) return 'File không đúng định dạng tiến độ của LuyenTinHoc (thiếu trường v: 1).';
  save(clean);
  return null;
}

export function clearProgress() {
  removeStorage(KEY);
  document.dispatchEvent(new CustomEvent('tdt:progress'));
}
