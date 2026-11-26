/** Tiện ích cho các thuật toán mô phỏng: đọc dữ liệu nhập, ghi bước, số ngẫu nhiên có seed. */
import {
  InputError,
  STEP_LIMIT,
  type CellState,
  type Counters,
  type Frame,
  type Question,
  type Step,
} from './types';

/** Số ngẫu nhiên có seed (mulberry32) để bộ dữ liệu ngẫu nhiên tái lập được. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randInt = (rng: () => number, lo: number, hi: number) =>
  lo + Math.floor(rng() * (hi - lo + 1));

export function randomList(rng: () => number, n: number, lo: number, hi: number): number[] {
  return Array.from({ length: n }, () => randInt(rng, lo, hi));
}

export function parseNumbers(
  raw: string | undefined,
  label: string,
  opts: { min: number; max: number; minLen: number; maxLen: number },
): number[] {
  const parts = (raw ?? '')
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean);
  if (parts.length < opts.minLen || parts.length > opts.maxLen) {
    throw new InputError(
      `${label}: cần từ ${opts.minLen} đến ${opts.maxLen} số, đang có ${parts.length}.`,
    );
  }
  return parts.map((part) => {
    if (!/^-?\d+$/.test(part)) throw new InputError(`${label}: "${part}" không phải số nguyên.`);
    const value = Number(part);
    if (value < opts.min || value > opts.max) {
      throw new InputError(`${label}: mỗi số phải từ ${opts.min} đến ${opts.max}, có số ${value}.`);
    }
    return value;
  });
}

export function parseInt1(
  raw: string | undefined,
  label: string,
  min: number,
  max: number,
): number {
  const text = (raw ?? '').trim();
  if (!/^-?\d+$/.test(text)) throw new InputError(`${label}: cần một số nguyên.`);
  const value = Number(text);
  if (value < min || value > max) throw new InputError(`${label}: phải từ ${min} đến ${max}.`);
  return value;
}

export const fill = <T>(n: number, value: T): T[] => Array.from({ length: n }, () => value);

/** Ghi lại các bước. Mỗi lần push sao chép hình để lùi bước được. */
export class Recorder {
  steps: Step[] = [];
  counters: Counters = { compare: 0, swap: 0, write: 0, call: 0 };

  push(
    frames: Frame | Frame[],
    line: number,
    message: string,
    vars: Record<string, string | number> = {},
    question?: Question,
  ) {
    if (this.steps.length >= STEP_LIMIT) {
      throw new InputError('Dữ liệu này tạo quá nhiều bước. Hãy thử dữ liệu nhỏ hơn.');
    }
    const list = Array.isArray(frames) ? frames : [frames];
    this.steps.push({
      frames: list.map((frame) => structuredClone(frame)),
      line,
      message,
      vars: { ...vars },
      counters: { ...this.counters },
      ...(question ? { question } : {}),
    });
  }
}

/** Trạng thái mảng: mặc định idle, ghi đè một số vị trí. */
export function states(
  n: number,
  marks: Record<number, CellState> = {},
  base: CellState = 'idle',
): CellState[] {
  const out = fill<CellState>(n, base);
  for (const [index, state] of Object.entries(marks)) {
    const i = Number(index);
    if (i >= 0 && i < n) out[i] = state;
  }
  return out;
}

export const list = (values: number[]) => `[${values.join(', ')}]`;
