/**
 * Động cơ câu đố tư duy (mục 4.7): logic thuần, có unit test. Giao diện ở trang /tu-duy/[cau-do].
 */

export type Dir = 'U' | 'D' | 'L' | 'R';
export type RobotCommand = { dir: Dir; steps: number };

export const DIR_LABEL: Record<Dir, string> = {
  U: 'Đi lên',
  D: 'Đi xuống',
  L: 'Sang trái',
  R: 'Sang phải',
};

const DELTA: Record<Dir, [number, number]> = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

export type RobotOutcome = {
  ok: boolean;
  /** Các ô robot đi qua theo thứ tự (gồm ô xuất phát). */
  path: [number, number][];
  stars: number;
  totalStars: number;
  message: string;
};

export function findCell(grid: string[], ch: string): [number, number] {
  for (let r = 0; r < grid.length; r += 1) {
    const c = grid[r]!.indexOf(ch);
    if (c >= 0) return [r, c];
  }
  throw new Error(`Lưới thiếu ô ${ch}`);
}

/** Chạy chương trình robot: dừng ngay khi đụng tường hoặc ra khỏi lưới. */
export function runRobot(
  grid: string[],
  program: RobotCommand[],
  maxCommands: number,
): RobotOutcome {
  let [r, c] = findCell(grid, 'S');
  const path: [number, number][] = [[r, c]];
  const totalStars = grid.join('').split('*').length - 1;
  const seen = new Set<string>();
  const fail = (message: string): RobotOutcome => ({
    ok: false,
    path,
    stars: seen.size,
    totalStars,
    message,
  });
  if (program.length === 0) return fail('Chương trình chưa có lệnh nào.');
  if (program.length > maxCommands)
    return fail(`Chương trình có ${program.length} lệnh, nhiều hơn giới hạn ${maxCommands} lệnh.`);
  for (const [i, cmd] of program.entries()) {
    const [dr, dc] = DELTA[cmd.dir];
    for (let s = 0; s < cmd.steps; s += 1) {
      const nr = r + dr;
      const nc = c + dc;
      const cell = grid[nr]?.[nc];
      if (cell === undefined) return fail(`Lệnh ${i + 1} đưa robot ra khỏi bản đồ.`);
      if (cell === '#') return fail(`Lệnh ${i + 1} làm robot đụng tường.`);
      r = nr;
      c = nc;
      path.push([r, c]);
      if (cell === '*') seen.add(`${r},${c}`);
    }
  }
  if (grid[r]![c] !== 'G') return fail('Robot dừng lại nhưng chưa tới cờ đích.');
  if (seen.size < totalStars)
    return fail(`Robot tới đích nhưng mới nhặt ${seen.size}/${totalStars} ngôi sao.`);
  return { ok: true, path, stars: seen.size, totalStars, message: 'Robot đã tới đích.' };
}

export function binarySum(cards: number[], on: boolean[]): number {
  return cards.reduce((sum, value, i) => sum + (on[i] ? value : 0), 0);
}

export function isOrdered(order: number[]): boolean {
  return order.every((value, i) => value === i);
}

/** Câu đố của ngày: chọn tất định theo ngày (không cần máy chủ). */
export function dailyIndex(date: Date, count: number): number {
  const days = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return (((days * 7) % count) + count) % count;
}

/** Xáo thứ tự tất định (để thứ tự ban đầu giống nhau giữa các lần tải). */
export function seededShuffle(n: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let x = seed || 1;
  for (let i = n - 1; i > 0; i -= 1) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (i + 1);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  if (isOrdered(order) && n > 1) [order[0], order[1]] = [order[1]!, order[0]!];
  return order;
}
