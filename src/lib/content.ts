/** Truy vấn nội dung dùng chung cho các trang (chạy lúc build). */
import { getCollection, type CollectionEntry } from 'astro:content';
import { TRAPS } from '../data/traps';
import { LEVEL_KEYS, type LevelKey } from '../data/taxonomy';
import { isVerified } from './problems';
import { getAlgorithm } from './viz/registry';

export type Lesson = CollectionEntry<'lessons'>;
export type Problem = CollectionEntry<'problems'>;

const levelOrder = (level: LevelKey) => LEVEL_KEYS.indexOf(level);

export async function getLessons(): Promise<Lesson[]> {
  const lessons = await getCollection('lessons');
  return lessons.sort(
    (a, b) =>
      levelOrder(a.data.level) - levelOrder(b.data.level) ||
      (a.data.track === b.data.track ? 0 : a.data.track === 'hsg' ? 1 : -1) ||
      (a.data.grade ?? 99) - (b.data.grade ?? 99) ||
      a.data.order - b.data.order,
  );
}

/** Chỉ các bài đã qua kiểm định (verify.json khớp sol.py hiện tại). */
export async function getProblems(): Promise<Problem[]> {
  const problems = (await getCollection('problems')).filter((p) => isVerified(p.id));
  return problems.sort(
    (a, b) =>
      a.data.difficulty - b.data.difficulty || a.data.title.localeCompare(b.data.title, 'vi'),
  );
}

export const lessonUrl = (id: string) => `/hoc/${id}`;
export const problemUrl = (id: string) => `/luyen-de/${id}`;
export const trapUrl = (slug: string) => `/bay-thuong-gap/${slug}`;

/** Báo lỗi build nếu nội dung trỏ tới thuật toán, đề hoặc bẫy không tồn tại. */
export async function assertRefs(
  where: string,
  refs: { algorithms?: string[]; problems?: string[]; traps?: string[] },
) {
  const problemIds = new Set((await getProblems()).map((p) => p.id));
  const missing = [
    ...(refs.algorithms ?? []).filter((s) => !getAlgorithm(s)).map((s) => `thuật toán "${s}"`),
    ...(refs.problems ?? []).filter((s) => !problemIds.has(s)).map((s) => `đề "${s}"`),
    ...(refs.traps ?? []).filter((s) => !TRAPS.some((t) => t.slug === s)).map((s) => `bẫy "${s}"`),
  ];
  if (missing.length > 0)
    throw new Error(`${where} trỏ tới nội dung không tồn tại: ${missing.join(', ')}`);
}
