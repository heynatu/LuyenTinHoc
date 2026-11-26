/**
 * Schema nội dung (mục 5.1 của docs/SUPER_PROMPT.md). Nội dung sai schema thì build lỗi,
 * không lọt lên web. Liên kết chéo (bài liên quan, thuật toán, bẫy) được scripts/check-links.mjs
 * kiểm tra sau khi build.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CONTEST_KEYS, LEVEL_KEYS, TOPIC_KEYS } from './data/taxonomy';

const level = z.enum(LEVEL_KEYS);
const topic = z.enum(TOPIC_KEYS);

const quizItem = z
  .object({
    q: z.string().min(5),
    options: z.array(z.string()).min(2).max(5),
    answer: z.number().int().min(0),
    explain: z.string().min(5),
    level: z.enum(['nhan-biet', 'thong-hieu', 'van-dung', 'van-dung-cao']),
  })
  .refine((item) => item.answer < item.options.length, 'answer phải là vị trí có trong options');

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(40).max(200),
    level,
    /** null: bài bồi dưỡng HSG không gắn một lớp cụ thể. */
    grade: z.number().int().min(3).max(12).nullable(),
    track: z.enum(['chuong-trinh', 'hsg']).default('chuong-trinh'),
    strand: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
    order: z.number(),
    minutes: z.number().int().min(5).max(120),
    objectives: z.array(z.string()).min(1),
    topics: z.array(topic).default([]),
    related: z
      .object({
        algorithms: z.array(z.string()).default([]),
        problems: z.array(z.string()).default([]),
        traps: z.array(z.string()).default([]),
      })
      .default({ algorithms: [], problems: [], traps: [] }),
    quiz: z.array(quizItem).default([]),
  }),
});

const problems = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/problems',
    generateId: ({ entry }) => entry.split('/')[0] ?? entry,
  }),
  schema: z.object({
    title: z.string().min(3),
    summary: z.string().min(20).max(200),
    source: z
      .object({
        kind: z.enum(['official', 'adapted', 'original']),
        contest: z.enum(CONTEST_KEYS),
        level,
        year: z.string().nullable(),
        round: z.string().nullable(),
        reference: z.string().nullable(),
        note: z.string(),
      })
      .refine(
        (s) => s.kind === 'original' || (s.year !== null && s.reference !== null),
        'Đề chính thức hoặc phỏng theo phải có năm học và nguồn',
      )
      .refine(
        (s) => s.kind !== 'original' || (s.year === null && s.round === null),
        'Đề tự soạn không được gắn năm thi hay vòng thi',
      ),
    grades: z.array(z.number().int().min(3).max(12)).min(1),
    topics: z.array(topic).min(1),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    io: z.object({
      mode: z.enum(['file', 'stdio']),
      input: z.string().regex(/^[A-Z0-9_]+\.INP$/),
      output: z.string().regex(/^[A-Z0-9_]+\.OUT$/),
      program: z.string().regex(/^[A-Z0-9_]+\.PY$/),
    }),
    limits: z.object({ timeMs: z.number().int().min(100), memoryMb: z.number().int().min(16) }),
    scoring: z.object({ mode: z.enum(['per-test', 'subtask']), points: z.number().positive() }),
    subtasks: z
      .array(z.object({ percent: z.number().int().min(1).max(100), constraint: z.string() }))
      .min(1),
    compare: z.enum(['tokens', 'lines', 'float']).default('tokens'),
    /** Ví dụ nằm ở vi-du/1.inp, vi-du/1.out…; đây là lời giải thích theo thứ tự ví dụ. */
    sampleNotes: z.array(z.string()).default([]),
    hints: z.array(z.string()).min(1).max(3),
    algorithms: z.array(z.string()).default([]),
    traps: z.array(z.string()).default([]),
  }),
});

const editorials = defineCollection({
  loader: glob({
    pattern: '*/editorial.md',
    base: './src/content/problems',
    generateId: ({ entry }) => entry.split('/')[0] ?? entry,
  }),
  schema: z.object({
    timeComplexity: z.string(),
    memoryComplexity: z.string(),
    partial: z
      .array(z.object({ file: z.string().regex(/^sub\d\.py$/), label: z.string() }))
      .default([]),
  }),
});

const handbook = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/handbook' }),
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(40).max(200),
    order: z.number(),
    audience: z.array(level).min(1),
  }),
});

export const collections = { lessons, problems, editorials, handbook };
