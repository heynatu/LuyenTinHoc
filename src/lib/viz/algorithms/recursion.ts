/** Đệ quy và quay lui: Tháp Hà Nội, N quân hậu. */
import { parseInt1, randInt, Recorder } from '../helpers';
import type { AlgorithmDef, CellState, GridFrame, PegsFrame } from '../types';

const PEG_NAMES = ['A', 'B', 'C'];

export const hanoi: AlgorithmDef = {
  slug: 'thap-ha-noi',
  title: 'Tháp Hà Nội',
  category: 'van-dung',
  levels: ['thcs', 'thpt'],
  topics: ['de-quy'],
  summary:
    'Chuyển n đĩa sang cọc khác: chuyển n - 1 đĩa sang cọc trung gian, chuyển đĩa lớn nhất, rồi chuyển n - 1 đĩa lên trên nó.',
  explain: [
    'Bài toán n đĩa được đưa về hai bài toán n - 1 đĩa: đây là ý tưởng cốt lõi của đệ quy. Điều kiện dừng: 0 đĩa thì không làm gì.',
    'Số lần chuyển là 2ⁿ - 1. Với 64 đĩa, chuyển mỗi giây một đĩa cũng cần hơn 500 tỉ năm.',
  ],
  pseudocode: `THUẬT TOÁN ThápHàNội(n, từ, sang, trung_gian)
NẾU n = 0 THÌ TRẢ VỀ
ThápHàNội(n - 1, từ, trung_gian, sang)
chuyển đĩa n từ cọc từ sang cọc sang
ThápHàNội(n - 1, trung_gian, sang, từ)`,
  python: `def thap_ha_noi(n, tu, sang, trung_gian):
    if n == 0:
        return
    thap_ha_noi(n - 1, tu, trung_gian, sang)
    print("Chuyển đĩa", n, "từ", tu, "sang", sang)
    thap_ha_noi(n - 1, trung_gian, sang, tu)`,
  pyMap: { 1: [1], 2: [2, 3], 3: [4], 4: [5], 5: [6] },
  complexity: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', memory: 'O(n) cho đệ quy' },
  fields: [{ id: 'n', label: 'Số đĩa n (1 đến 6)', kind: 'number', default: '3' }],
  presets: [
    { label: '3 đĩa', values: { n: '3' } },
    { label: '5 đĩa', values: { n: '5' } },
  ],
  random: (rng) => ({ n: String(randInt(rng, 2, 5)) }),
  legend: [],
  run(v) {
    const n = parseInt1(v.n, 'Số đĩa', 1, 6);
    const pegs: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []];
    const r = new Recorder();
    const frame = (moving: PegsFrame['moving'] = null): PegsFrame => ({
      kind: 'pegs',
      pegs: pegs.map((p) => [...p]),
      disks: n,
      moving,
      caption: 'Đĩa lớn không bao giờ nằm trên đĩa nhỏ.',
    });
    r.push(frame(), 1, `Chuyển ${n} đĩa từ cọc A sang cọc C, dùng B làm trung gian.`, { n });
    let moves = 0;
    const solve = (k: number, from: number, to: number, via: number) => {
      r.counters.call += 1;
      if (k === 0) return;
      r.push(
        frame(),
        3,
        `Muốn chuyển ${k} đĩa từ ${PEG_NAMES[from]} sang ${PEG_NAMES[to]}: trước hết chuyển ${k - 1} đĩa sang ${PEG_NAMES[via]}.`,
        { n: k, từ: PEG_NAMES[from]!, sang: PEG_NAMES[to]! },
      );
      solve(k - 1, from, via, to);
      const disk = pegs[from]!.pop()!;
      pegs[to]!.push(disk);
      moves += 1;
      r.counters.write += 1;
      r.push(
        frame({ from, to, disk }),
        4,
        `Lần ${moves}: chuyển đĩa ${disk} từ ${PEG_NAMES[from]} sang ${PEG_NAMES[to]}.`,
        { n: k, 'số lần': moves },
      );
      solve(k - 1, via, to, from);
    };
    solve(n, 0, 2, 1);
    r.push(frame(), 5, `Xong sau ${moves} lần chuyển (2^${n} - 1 = ${2 ** n - 1}).`, {
      'số lần': moves,
    });
    return { steps: r.steps, result: moves };
  },
  reference: (v) => 2 ** Number(v.n) - 1,
};

export const nQueens: AlgorithmDef = {
  slug: 'n-quan-hau',
  title: 'Quay lui: N quân hậu',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quay-lui', 'de-quy'],
  summary:
    'Đặt hậu từng hàng; nếu không còn cột an toàn thì gỡ quân vừa đặt ở hàng trước và thử cột khác.',
  explain: [
    'Quay lui là thử có hệ thống: tại mỗi hàng, lần lượt thử từng cột không bị quân trước khống chế (cùng cột, cùng đường chéo). Đi tiếp được thì xuống hàng sau, bế tắc thì quay lại.',
    'Kiểm tra cột và hai đường chéo bằng ba mảng đánh dấu giúp mỗi lần kiểm tra chỉ O(1).',
  ],
  pseudocode: `THUẬT TOÁN ĐặtHậu(r)
NẾU r = N THÌ đã đặt đủ N quân hậu: DỪNG
VỚI cột c TỪ 0 ĐẾN N - 1 LÀM
    NẾU ô (r, c) không bị quân nào khống chế THÌ
        đặt hậu tại (r, c)
        ĐặtHậu(r + 1)
        gỡ hậu khỏi (r, c)          // quay lui
    HẾT NẾU
HẾT VỚI`,
  python: `def dat_hau(r, n, cot, cheo1, cheo2, vi_tri):
    if r == n:
        return True
    for c in range(n):
        if not cot[c] and not cheo1[r + c] and not cheo2[r - c + n]:
            cot[c] = cheo1[r + c] = cheo2[r - c + n] = True
            vi_tri.append(c)
            if dat_hau(r + 1, n, cot, cheo1, cheo2, vi_tri):
                return True
            vi_tri.pop()
            cot[c] = cheo1[r + c] = cheo2[r - c + n] = False
    return False`,
  pyMap: { 1: [1], 2: [2, 3], 3: [4], 4: [5], 5: [6, 7], 6: [8, 9], 7: [10, 11], 9: [12] },
  complexity: {
    best: 'O(N!)',
    average: 'nhỏ hơn nhiều nhờ cắt nhánh',
    worst: 'O(N!)',
    memory: 'O(N)',
  },
  fields: [{ id: 'n', label: 'Kích thước bàn cờ N (4 đến 8)', kind: 'number', default: '6' }],
  presets: [
    { label: 'N = 4', values: { n: '4' } },
    { label: 'N = 6', values: { n: '6' } },
    { label: 'N = 8', values: { n: '8' } },
  ],
  random: (rng) => ({ n: String(randInt(rng, 4, 7)) }),
  legend: ['compare', 'pivot', 'swap', 'found'],
  run(v) {
    const n = parseInt1(v.n, 'N', 4, 8);
    const queens: number[] = [];
    const r = new Recorder();
    const safe = (row: number, col: number) =>
      queens.every((c, rr) => c !== col && Math.abs(c - col) !== Math.abs(rr - row));
    const frame = (marks: Record<string, CellState> = {}, done = false): GridFrame => ({
      kind: 'grid',
      cells: Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (queens[i] === j ? '♛' : '')),
      ),
      states: Array.from({ length: n }, (_, i) =>
        Array.from(
          { length: n },
          (_, j): CellState =>
            marks[`${i},${j}`] ?? (queens[i] === j ? (done ? 'found' : 'pivot') : 'idle'),
        ),
      ),
      rowLabels: Array.from({ length: n }, (_, i) => `hàng ${i}`),
      colLabels: Array.from({ length: n }, (_, j) => `cột ${j}`),
      caption: '♛ là quân hậu đã đặt.',
    });
    r.push(frame(), 1, `Đặt ${n} quân hậu sao cho không quân nào ăn được quân nào.`, { N: n });
    const place = (row: number): boolean => {
      r.counters.call += 1;
      if (row === n) return true;
      for (let col = 0; col < n; col += 1) {
        r.counters.compare += 1;
        const ok = safe(row, col);
        r.push(
          frame({ [`${row},${col}`]: ok ? 'active' : 'compare' }),
          4,
          ok ? `Ô (${row}, ${col}) an toàn.` : `Ô (${row}, ${col}) bị khống chế.`,
          { r: row, c: col },
        );
        if (!ok) continue;
        queens.push(col);
        r.counters.write += 1;
        r.push(frame(), 5, `Đặt hậu ở hàng ${row}, cột ${col}.`, { r: row, c: col });
        if (place(row + 1)) return true;
        queens.pop();
        r.push(
          frame({ [`${row},${col}`]: 'swap' }),
          7,
          `Hàng ${row + 1} bế tắc: gỡ hậu ở (${row}, ${col}) và thử cột khác.`,
          { r: row, c: col },
        );
      }
      return false;
    };
    const ok = place(0);
    r.push(
      frame({}, true),
      2,
      ok ? `Tìm được cách đặt: cột theo từng hàng ${queens.join(', ')}.` : 'Không có cách đặt.',
      { N: n },
    );
    const valid =
      ok &&
      queens.length === n &&
      queens.every((c, i) =>
        queens.every((d, j) => i === j || (c !== d && Math.abs(c - d) !== Math.abs(i - j))),
      );
    return { steps: r.steps, result: valid };
  },
  reference: () => true,
};

export const RECURSION = [hanoi, nQueens];
