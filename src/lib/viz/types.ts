/**
 * Động cơ mô phỏng thuật toán (mục 2.7, 4.6 của SUPER_PROMPT). Mỗi thuật toán sinh trước toàn bộ
 * các bước (ảnh chụp trạng thái) để lùi bước và kéo thanh thời gian được.
 */
import type { LevelKey, TopicKey } from '../../data/taxonomy';

export type CellState =
  'idle' | 'compare' | 'swap' | 'done' | 'pivot' | 'active' | 'found' | 'dim' | 'wall' | 'path';

export type ArrayFrame = {
  kind: 'array';
  values: number[];
  states: CellState[];
  /** Nhãn con trỏ dưới cột: { i: 2, j: 3 } */
  pointers?: Record<string, number>;
  /** Hiện dạng ô số (true) thay vì cột cao thấp. */
  cells?: boolean;
  caption?: string;
};

export type GridFrame = {
  kind: 'grid';
  cells: (string | number)[][];
  states: CellState[][];
  rowLabels?: string[];
  colLabels?: string[];
  caption?: string;
};

export type GraphFrame = {
  kind: 'graph';
  nodes: { id: number; x: number; y: number }[];
  edges: { a: number; b: number; w?: number }[];
  directed: boolean;
  nodeStates: CellState[];
  edgeStates: CellState[];
  /** Nhãn phụ dưới đỉnh (khoảng cách, thứ tự thăm). */
  nodeNotes?: (string | null)[];
  caption?: string;
};

export type PegsFrame = {
  kind: 'pegs';
  pegs: number[][];
  disks: number;
  moving?: { from: number; to: number; disk: number } | null;
  caption?: string;
};

export type Frame = ArrayFrame | GridFrame | GraphFrame | PegsFrame;

export type Counters = { compare: number; swap: number; write: number; call: number };

export type Question = { prompt: string; options: string[]; answer: number };

export type Step = {
  /** Hình chính và (tùy chọn) hình phụ, ví dụ mảng dp đi kèm. */
  frames: Frame[];
  /** Dòng giả mã đang chạy (bắt đầu từ 1). */
  line: number;
  message: string;
  vars: Record<string, string | number>;
  counters: Counters;
  question?: Question;
};

export type Field = {
  id: string;
  label: string;
  kind: 'numbers' | 'number' | 'text' | 'textarea' | 'select';
  default: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type Category = 'co-ban' | 'van-dung' | 'chuyen-sau';

export type RunOutput = { steps: Step[]; result: unknown };

export type AlgorithmDef = {
  slug: string;
  title: string;
  category: Category;
  levels: LevelKey[];
  topics: TopicKey[];
  summary: string;
  explain: string[];
  pseudocode: string;
  python: string;
  /** Dòng giả mã → các dòng Python tương ứng, để tô sáng đồng bộ. */
  pyMap: Record<number, number[]>;
  complexity: { best: string; average: string; worst: string; memory: string };
  fields: Field[];
  presets: { label: string; values: Record<string, string> }[];
  random: (rng: () => number) => Record<string, string>;
  run: (values: Record<string, string>) => RunOutput;
  /** Kết quả đúng tính bằng cách khác, để unit test đối chiếu với `result` của run. */
  reference: (values: Record<string, string>) => unknown;
  legend: CellState[];
  problems?: string[];
};

export class InputError extends Error {}

export const STEP_LIMIT = 50_000;
