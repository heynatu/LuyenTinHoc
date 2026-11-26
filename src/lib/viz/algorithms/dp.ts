/** Quy hoạch động: dãy con tăng dài nhất, cái túi, xâu con chung, đường đi trên lưới, đổi tiền. */
import { list, parseInt1, parseNumbers, randomList, randInt, Recorder, states } from '../helpers';
import {
  InputError,
  type AlgorithmDef,
  type ArrayFrame,
  type CellState,
  type GridFrame,
} from '../types';

const cells = (
  values: number[],
  st: CellState[],
  caption: string,
  pointers?: Record<string, number>,
): ArrayFrame => ({
  kind: 'array',
  values: [...values],
  states: st,
  cells: true,
  caption,
  ...(pointers ? { pointers } : {}),
});

function dpGrid(
  values: (number | string)[][],
  marks: Record<string, CellState>,
  rowLabels: string[],
  colLabels: string[],
  caption: string,
): GridFrame {
  return {
    kind: 'grid',
    cells: values.map((row) => [...row]),
    states: values.map((row, i) => row.map((_, j) => marks[`${i},${j}`] ?? 'idle')),
    rowLabels,
    colLabels,
    caption,
  };
}

/* ------------------------------------------------------------- LIS */
export const lis: AlgorithmDef = {
  slug: 'day-con-tang-dai-nhat',
  title: 'Dãy con tăng dài nhất',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quy-hoach-dong'],
  summary:
    'f[i] là độ dài dãy con tăng dài nhất kết thúc tại A[i]; f[i] = 1 + max f[j] với j < i và A[j] < A[i].',
  explain: [
    'Dãy con không cần liên tiếp. Với mỗi i, xét mọi j đứng trước có A[j] < A[i]: dãy tăng kết thúc tại j nối thêm A[i] được độ dài f[j] + 1.',
    'Cách này O(n²), đủ cho n ≤ 5000 bằng C++ nhưng với Python chỉ nên dùng khi n ≤ 3000. Với n tới 10⁵ cần cách O(n log n) dùng tìm kiếm nhị phân (xem bài tập liên quan).',
  ],
  pseudocode: `THUẬT TOÁN DãyConTăngDàiNhất(A, n)
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    f[i] ← 1
    VỚI j TỪ 0 ĐẾN i - 1 LÀM
        NẾU A[j] < A[i] THÌ f[i] ← max(f[i], f[j] + 1)
    HẾT VỚI
HẾT VỚI
TRẢ VỀ max(f)`,
  python: `def lis(a):
    n = len(a)
    f = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i]:
                f[i] = max(f[i], f[j] + 1)
    return max(f)`,
  pyMap: { 1: [1, 2], 2: [4], 3: [3], 4: [5], 5: [6, 7], 8: [8] },
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', memory: 'O(n)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số',
      kind: 'numbers',
      default: '3 10 2 1 20 4 6 7 5',
      help: 'Từ 1 đến 14 số, mỗi số từ -99 đến 99.',
    },
  ],
  presets: [
    { label: 'Ví dụ', values: { a: '3 10 2 1 20 4 6 7 5' } },
    { label: 'Giảm dần', values: { a: '9 7 5 3 1' } },
  ],
  random: (rng) => ({ a: randomList(rng, randInt(rng, 6, 10), 1, 30).join(' ') }),
  legend: ['active', 'compare', 'swap', 'found'],
  problems: ['day-con-tang'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 1, maxLen: 14 });
    const n = a.length;
    const f = new Array<number>(n).fill(0);
    const r = new Recorder();
    const frames = (
      marks: Record<number, CellState>,
      fMarks: Record<number, CellState>,
      pointers?: Record<string, number>,
    ) => [
      cells(a, states(n, marks), 'Dãy A', pointers),
      cells(f, states(n, fMarks), 'f[i]: độ dài dãy tăng dài nhất kết thúc tại A[i]'),
    ];
    r.push(frames({}, {}), 1, `Tìm dãy con tăng dài nhất của ${list(a)}.`, { n });
    for (let i = 0; i < n; i += 1) {
      f[i] = 1;
      r.push(
        frames({ [i]: 'active' }, { [i]: 'swap' }, { i }),
        3,
        `f[${i}] = 1 (chỉ gồm A[${i}] = ${a[i]}).`,
        { i, 'f[i]': 1 },
      );
      for (let j = 0; j < i; j += 1) {
        r.counters.compare += 1;
        if (a[j]! < a[i]!) {
          const better = f[j]! + 1 > f[i]!;
          if (better) f[i] = f[j]! + 1;
          r.push(
            frames(
              { [i]: 'active', [j]: 'compare' },
              { [i]: better ? 'swap' : 'active', [j]: 'compare' },
              { i, j },
            ),
            5,
            better
              ? `A[${j}] = ${a[j]} < ${a[i]}: nối vào được độ dài ${f[i]}, cập nhật f[${i}].`
              : `A[${j}] = ${a[j]} < ${a[i]} nhưng f[${j}] + 1 không lớn hơn f[${i}] = ${f[i]}.`,
            { i, j, 'f[i]': f[i]! },
          );
        } else {
          r.push(
            frames({ [i]: 'active', [j]: 'compare' }, { [i]: 'active' }, { i, j }),
            5,
            `A[${j}] = ${a[j]} không nhỏ hơn ${a[i]}: không nối được.`,
            { i, j, 'f[i]': f[i]! },
          );
        }
      }
    }
    const best = Math.max(...f);
    const at = f.indexOf(best);
    r.push(frames({}, { [at]: 'found' }), 8, `Độ dài lớn nhất: max(f) = ${best}.`, {
      'kết quả': best,
    });
    return { steps: r.steps, result: best };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 1, maxLen: 14 });
    const tails: number[] = [];
    for (const x of a) {
      let lo = 0;
      let hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid]! < x) lo = mid + 1;
        else hi = mid;
      }
      tails[lo] = x;
    }
    return tails.length;
  },
};

/* ------------------------------------------------------------- Cái túi 0/1 */
export const knapsack: AlgorithmDef = {
  slug: 'cai-tui-0-1',
  title: 'Cái túi 0/1',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quy-hoach-dong'],
  summary:
    'f[i][c] là giá trị lớn nhất khi chỉ dùng i vật đầu và túi sức chứa c: không lấy hoặc lấy vật i.',
  explain: [
    'Mỗi vật chỉ lấy hoặc không. Không lấy vật i: f[i][c] = f[i - 1][c]. Lấy vật i (nếu w[i] ≤ c): f[i - 1][c - w[i]] + v[i]. Chọn giá trị lớn hơn.',
    'Bảng có (n + 1) × (W + 1) ô, mỗi ô O(1): tổng O(n·W). Với Python, n·W tới khoảng 10⁶ là ổn.',
  ],
  pseudocode: `THUẬT TOÁN CáiTúi(w, v, n, W)
f[0][c] ← 0 với mọi c
VỚI i TỪ 1 ĐẾN n LÀM
    VỚI c TỪ 0 ĐẾN W LÀM
        f[i][c] ← f[i - 1][c]          // không lấy vật i
        NẾU w[i] ≤ c THÌ
            f[i][c] ← max(f[i][c], f[i - 1][c - w[i]] + v[i])
        HẾT NẾU
    HẾT VỚI
HẾT VỚI
TRẢ VỀ f[n][W]`,
  python: `def cai_tui(w, v, cap):
    n = len(w)
    f = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for c in range(cap + 1):
            f[i][c] = f[i - 1][c]
            if w[i - 1] <= c:
                f[i][c] = max(f[i][c], f[i - 1][c - w[i - 1]] + v[i - 1])
    return f[n][cap]`,
  pyMap: { 1: [1, 2], 2: [3], 3: [4], 4: [5], 5: [6], 6: [7], 7: [8], 11: [9] },
  complexity: { best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)', memory: 'O(n·W)' },
  fields: [
    {
      id: 'w',
      label: 'Khối lượng các vật',
      kind: 'numbers',
      default: '2 3 4 5',
      help: 'Từ 1 đến 6 vật, mỗi vật nặng từ 1 đến 10.',
    },
    {
      id: 'v',
      label: 'Giá trị các vật',
      kind: 'numbers',
      default: '3 4 5 6',
      help: 'Cùng số lượng với khối lượng, mỗi giá trị từ 0 đến 50.',
    },
    { id: 'W', label: 'Sức chứa túi W', kind: 'number', default: '5' },
  ],
  presets: [{ label: 'Ví dụ', values: { w: '2 3 4 5', v: '3 4 5 6', W: '5' } }],
  random: (rng) => {
    const n = randInt(rng, 3, 5);
    return {
      w: randomList(rng, n, 1, 6).join(' '),
      v: randomList(rng, n, 1, 20).join(' '),
      W: String(randInt(rng, 4, 10)),
    };
  },
  legend: ['active', 'compare', 'swap', 'found'],
  problems: ['cai-tui'],
  run(v) {
    const w = parseNumbers(v.w, 'Khối lượng', { min: 1, max: 10, minLen: 1, maxLen: 6 });
    const val = parseNumbers(v.v, 'Giá trị', { min: 0, max: 50, minLen: 1, maxLen: 6 });
    if (val.length !== w.length) throw new InputError('Số giá trị phải bằng số khối lượng.');
    const cap = parseInt1(v.W, 'Sức chứa W', 1, 15);
    const n = w.length;
    const f = Array.from({ length: n + 1 }, () => new Array<number>(cap + 1).fill(0));
    const rows = ['0 vật', ...w.map((wi, i) => `vật ${i + 1} (w=${wi}, v=${val[i]})`)];
    const colsL = Array.from({ length: cap + 1 }, (_, c) => `c=${c}`);
    const r = new Recorder();
    const show = (marks: Record<string, CellState>) =>
      dpGrid(f, marks, rows, colsL, 'Bảng f[i][c]');
    r.push(show({}), 2, 'Hàng 0: chưa có vật nào, giá trị bằng 0.', { n, W: cap });
    for (let i = 1; i <= n; i += 1) {
      for (let c = 0; c <= cap; c += 1) {
        f[i]![c] = f[i - 1]![c]!;
        r.counters.write += 1;
        const marks: Record<string, CellState> = {
          [`${i},${c}`]: 'active',
          [`${i - 1},${c}`]: 'compare',
        };
        if (w[i - 1]! <= c) {
          r.counters.compare += 1;
          const take = f[i - 1]![c - w[i - 1]!]! + val[i - 1]!;
          marks[`${i - 1},${c - w[i - 1]!}`] = 'compare';
          if (take > f[i]![c]!) f[i]![c] = take;
          marks[`${i},${c}`] = 'swap';
          r.push(
            show(marks),
            7,
            `Ô (${i}, ${c}): không lấy được ${f[i - 1]![c]}, lấy vật ${i} được ${take}. Chọn ${f[i]![c]}.`,
            { i, c, 'f[i][c]': f[i]![c]! },
          );
        } else {
          r.push(
            show(marks),
            5,
            `Ô (${i}, ${c}): vật ${i} nặng ${w[i - 1]} > ${c} nên không lấy được: ${f[i]![c]}.`,
            { i, c, 'f[i][c]': f[i]![c]! },
          );
        }
      }
    }
    r.push(
      show({ [`${n},${cap}`]: 'found' }),
      11,
      `Giá trị lớn nhất: f[${n}][${cap}] = ${f[n]![cap]}.`,
      { 'kết quả': f[n]![cap]! },
    );
    return { steps: r.steps, result: f[n]![cap]! };
  },
  reference: (v) => {
    const w = parseNumbers(v.w, '', { min: 1, max: 10, minLen: 1, maxLen: 6 });
    const val = parseNumbers(v.v, '', { min: 0, max: 50, minLen: 1, maxLen: 6 });
    const cap = Number(v.W);
    let best = 0;
    for (let mask = 0; mask < 1 << w.length; mask += 1) {
      let tw = 0;
      let tv = 0;
      for (let i = 0; i < w.length; i += 1)
        if (mask & (1 << i)) {
          tw += w[i]!;
          tv += val[i]!;
        }
      if (tw <= cap) best = Math.max(best, tv);
    }
    return best;
  },
};

/* ------------------------------------------------------------- LCS */
export const lcs: AlgorithmDef = {
  slug: 'xau-con-chung-dai-nhat',
  title: 'Xâu con chung dài nhất',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quy-hoach-dong', 'xau'],
  summary: 'f[i][j] là độ dài xâu con chung dài nhất của i ký tự đầu của X và j ký tự đầu của Y.',
  explain: [
    'Nếu X[i] = Y[j], ký tự đó thuộc xâu con chung: f[i][j] = f[i - 1][j - 1] + 1. Nếu khác, bỏ một ký tự ở X hoặc ở Y: f[i][j] = max(f[i - 1][j], f[i][j - 1]).',
    'Xâu con không cần liên tiếp. Bảng (|X| + 1) × (|Y| + 1) ô, tổng O(|X|·|Y|).',
  ],
  pseudocode: `THUẬT TOÁN XâuConChung(X, Y)
f[0][j] ← 0; f[i][0] ← 0
VỚI i TỪ 1 ĐẾN |X| LÀM
    VỚI j TỪ 1 ĐẾN |Y| LÀM
        NẾU X[i] = Y[j] THÌ f[i][j] ← f[i - 1][j - 1] + 1
        NGƯỢC LẠI f[i][j] ← max(f[i - 1][j], f[i][j - 1])
    HẾT VỚI
HẾT VỚI
TRẢ VỀ f[|X|][|Y|]`,
  python: `def lcs(x, y):
    m, n = len(x), len(y)
    f = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                f[i][j] = f[i - 1][j - 1] + 1
            else:
                f[i][j] = max(f[i - 1][j], f[i][j - 1])
    return f[m][n]`,
  pyMap: { 1: [1, 2], 2: [3], 3: [4], 4: [5], 5: [6, 7], 6: [8, 9], 9: [10] },
  complexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)', memory: 'O(m·n)' },
  fields: [
    { id: 'x', label: 'Xâu X', kind: 'text', default: 'QUYNHON', help: 'Từ 1 đến 9 ký tự.' },
    { id: 'y', label: 'Xâu Y', kind: 'text', default: 'PLEIKU', help: 'Từ 1 đến 9 ký tự.' },
  ],
  presets: [
    { label: 'Ví dụ', values: { x: 'QUYNHON', y: 'PLEIKU' } },
    { label: 'ACGTAG và GTTCAG', values: { x: 'ACGTAG', y: 'GTTCAG' } },
  ],
  random: (rng) => {
    const word = (len: number) =>
      Array.from({ length: len }, () => 'ABCD'[randInt(rng, 0, 3)]).join('');
    return { x: word(randInt(rng, 4, 7)), y: word(randInt(rng, 4, 7)) };
  },
  legend: ['active', 'compare', 'found'],
  run(v) {
    const x = (v.x ?? '').trim();
    const y = (v.y ?? '').trim();
    if (x.length < 1 || x.length > 9 || y.length < 1 || y.length > 9)
      throw new InputError('Mỗi xâu cần từ 1 đến 9 ký tự.');
    const m = x.length;
    const n = y.length;
    const f = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
    const rows = ['∅', ...x.split('')];
    const colsL = ['∅', ...y.split('')];
    const r = new Recorder();
    const show = (marks: Record<string, CellState>) =>
      dpGrid(f, marks, rows, colsL, 'Bảng f[i][j]');
    r.push(show({}), 2, `Hàng 0 và cột 0 bằng 0 (một xâu rỗng).`, { '|X|': m, '|Y|': n });
    for (let i = 1; i <= m; i += 1) {
      for (let j = 1; j <= n; j += 1) {
        r.counters.compare += 1;
        if (x[i - 1] === y[j - 1]) {
          f[i]![j] = f[i - 1]![j - 1]! + 1;
          r.push(
            show({ [`${i},${j}`]: 'active', [`${i - 1},${j - 1}`]: 'compare' }),
            5,
            `X[${i}] = Y[${j}] = "${x[i - 1]}": f = ${f[i - 1]![j - 1]} + 1 = ${f[i]![j]}.`,
            { i, j, 'f[i][j]': f[i]![j]! },
          );
        } else {
          f[i]![j] = Math.max(f[i - 1]![j]!, f[i]![j - 1]!);
          r.push(
            show({
              [`${i},${j}`]: 'active',
              [`${i - 1},${j}`]: 'compare',
              [`${i},${j - 1}`]: 'compare',
            }),
            6,
            `"${x[i - 1]}" khác "${y[j - 1]}": f = max(${f[i - 1]![j]}, ${f[i]![j - 1]}) = ${f[i]![j]}.`,
            { i, j, 'f[i][j]': f[i]![j]! },
          );
        }
      }
    }
    r.push(show({ [`${m},${n}`]: 'found' }), 9, `Độ dài xâu con chung dài nhất: ${f[m]![n]}.`, {
      'kết quả': f[m]![n]!,
    });
    return { steps: r.steps, result: f[m]![n]! };
  },
  reference: (v) => {
    const x = (v.x ?? '').trim();
    const y = (v.y ?? '').trim();
    // Thử mọi xâu con của X (tối đa 2^9) xem có là xâu con của Y.
    const isSub = (s: string) => {
      let k = 0;
      for (const ch of y) if (k < s.length && ch === s[k]) k += 1;
      return k === s.length;
    };
    let best = 0;
    for (let mask = 0; mask < 1 << x.length; mask += 1) {
      let s = '';
      for (let i = 0; i < x.length; i += 1) if (mask & (1 << i)) s += x[i];
      if (s.length > best && isSub(s)) best = s.length;
    }
    return best;
  },
};

/* ------------------------------------------------------------- Đường đi trên lưới */
function parseMaze(raw: string | undefined, maxSize: number): string[] {
  const rows = (raw ?? '')
    .trim()
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (rows.length < 2 || rows.length > maxSize)
    throw new InputError(`Lưới cần từ 2 đến ${maxSize} dòng.`);
  const width = rows[0]!.length;
  if (width < 2 || width > maxSize) throw new InputError(`Mỗi dòng cần từ 2 đến ${maxSize} ô.`);
  for (const row of rows) {
    if (row.length !== width) throw new InputError('Các dòng của lưới phải dài bằng nhau.');
    if (!/^[.#]+$/.test(row))
      throw new InputError('Lưới chỉ gồm dấu chấm (ô trống) và dấu # (ô cấm).');
  }
  return rows;
}

export const gridPaths: AlgorithmDef = {
  slug: 'dem-duong-di-tren-luoi',
  title: 'Đếm đường đi trên lưới',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quy-hoach-dong', 'to-hop'],
  summary:
    'Đếm số đường đi từ góc trên trái tới góc dưới phải, mỗi bước sang phải hoặc xuống dưới, tránh ô cấm.',
  explain: [
    'Muốn tới ô (i, j) thì bước cuối đến từ ô bên trên hoặc ô bên trái. Vì vậy f[i][j] = f[i - 1][j] + f[i][j - 1]; ô cấm có f = 0.',
    'Số đường đi tăng rất nhanh, đề thi thường yêu cầu in kết quả chia lấy dư cho 10⁹ + 7.',
  ],
  pseudocode: `THUẬT TOÁN ĐếmĐườngĐi(lưới m × n)
f[0][0] ← 1 nếu ô (0, 0) không cấm
VỚI i TỪ 0 ĐẾN m - 1 LÀM
    VỚI j TỪ 0 ĐẾN n - 1 LÀM
        NẾU ô (i, j) cấm THÌ f[i][j] ← 0
        NGƯỢC LẠI NẾU (i, j) ≠ (0, 0) THÌ
            f[i][j] ← f[i - 1][j] + f[i][j - 1]     // ngoài lưới tính là 0
        HẾT NẾU
    HẾT VỚI
HẾT VỚI
TRẢ VỀ f[m - 1][n - 1]`,
  python: `def dem_duong(luoi):
    m, n = len(luoi), len(luoi[0])
    f = [[0] * n for _ in range(m)]
    f[0][0] = 1 if luoi[0][0] == "." else 0
    for i in range(m):
        for j in range(n):
            if luoi[i][j] == "#":
                f[i][j] = 0
            elif (i, j) != (0, 0):
                tren = f[i - 1][j] if i > 0 else 0
                trai = f[i][j - 1] if j > 0 else 0
                f[i][j] = tren + trai
    return f[m - 1][n - 1]`,
  pyMap: { 1: [1, 2, 3], 2: [4], 3: [5], 4: [6], 5: [7, 8], 6: [9], 7: [10, 11, 12], 11: [13] },
  complexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)', memory: 'O(m·n)' },
  fields: [
    {
      id: 'g',
      label: 'Lưới (dấu chấm là ô trống, # là ô cấm)',
      kind: 'textarea',
      default: '....\n.#..\n...#\n#...',
      help: 'Từ 2 đến 7 dòng, mỗi dòng 2 đến 7 ô.',
    },
  ],
  presets: [
    { label: 'Ví dụ', values: { g: '....\n.#..\n...#\n#...' } },
    { label: 'Lưới trống 5 × 5', values: { g: '.....\n.....\n.....\n.....\n.....' } },
  ],
  random: (rng) => {
    const m = randInt(rng, 3, 5);
    const n = randInt(rng, 3, 5);
    const rows = Array.from({ length: m }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        (i === 0 && j === 0) || (i === m - 1 && j === n - 1) || rng() > 0.2 ? '.' : '#',
      ).join(''),
    );
    return { g: rows.join('\n') };
  },
  legend: ['active', 'compare', 'wall', 'found'],
  run(v) {
    const grid = parseMaze(v.g, 7);
    const m = grid.length;
    const n = grid[0]!.length;
    const f = Array.from({ length: m }, () => new Array<number>(n).fill(0));
    const r = new Recorder();
    const walls: Record<string, CellState> = {};
    for (let i = 0; i < m; i += 1)
      for (let j = 0; j < n; j += 1) if (grid[i]![j] === '#') walls[`${i},${j}`] = 'wall';
    const show = (marks: Record<string, CellState>) => ({
      ...dpGrid(
        f.map((row, i) => row.map((val, j) => (grid[i]![j] === '#' ? '#' : val))),
        { ...walls, ...marks },
        [],
        [],
        'f[i][j]: số đường đi tới ô (i, j)',
      ),
    });
    f[0]![0] = grid[0]![0] === '.' ? 1 : 0;
    r.push(show({ '0,0': 'active' }), 2, `Ô xuất phát: f[0][0] = ${f[0]![0]}.`, { m, n });
    for (let i = 0; i < m; i += 1) {
      for (let j = 0; j < n; j += 1) {
        if (i === 0 && j === 0) continue;
        if (grid[i]![j] === '#') {
          r.push(show({}), 5, `Ô (${i}, ${j}) bị cấm: f = 0.`, { i, j });
          continue;
        }
        const top = i > 0 ? f[i - 1]![j]! : 0;
        const left = j > 0 ? f[i]![j - 1]! : 0;
        f[i]![j] = top + left;
        r.counters.write += 1;
        const marks: Record<string, CellState> = { [`${i},${j}`]: 'active' };
        if (i > 0) marks[`${i - 1},${j}`] = 'compare';
        if (j > 0) marks[`${i},${j - 1}`] = 'compare';
        r.push(show(marks), 7, `f[${i}][${j}] = trên ${top} + trái ${left} = ${f[i]![j]}.`, {
          i,
          j,
          'f[i][j]': f[i]![j]!,
        });
      }
    }
    r.push(show({ [`${m - 1},${n - 1}`]: 'found' }), 11, `Có ${f[m - 1]![n - 1]} đường đi.`, {
      'kết quả': f[m - 1]![n - 1]!,
    });
    return { steps: r.steps, result: f[m - 1]![n - 1]! };
  },
  reference: (v) => {
    const grid = parseMaze(v.g, 7);
    const m = grid.length;
    const n = grid[0]!.length;
    const count = (i: number, j: number): number => {
      if (i >= m || j >= n || grid[i]![j] === '#') return 0;
      if (i === m - 1 && j === n - 1) return 1;
      return count(i + 1, j) + count(i, j + 1);
    };
    return count(0, 0);
  },
};

/* ------------------------------------------------------------- Đổi tiền */
export const coinChange: AlgorithmDef = {
  slug: 'doi-tien-it-dong-nhat',
  title: 'Đổi tiền ít tờ nhất',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['quy-hoach-dong', 'tham-lam'],
  summary:
    'f[s] là số tờ ít nhất để trả đúng s đồng; f[s] = 1 + min f[s - c] với mọi mệnh giá c ≤ s.',
  explain: [
    'Tham lam (luôn lấy tờ lớn nhất) không phải lúc nào cũng đúng. Ví dụ mệnh giá 1, 3, 4 và số tiền 6: tham lam lấy 4 + 1 + 1 (3 tờ) nhưng tối ưu là 3 + 3 (2 tờ).',
    'Quy hoạch động xét mọi tờ cuối cùng có thể dùng, nên luôn đúng. Độ phức tạp O(S · số mệnh giá).',
  ],
  pseudocode: `THUẬT TOÁN ĐổiTiền(C, S)
f[0] ← 0; f[s] ← ∞ với s > 0
VỚI s TỪ 1 ĐẾN S LÀM
    VỚI mỗi mệnh giá c TRONG C LÀM
        NẾU c ≤ s VÀ f[s - c] + 1 < f[s] THÌ f[s] ← f[s - c] + 1
    HẾT VỚI
HẾT VỚI
TRẢ VỀ f[S] (∞ nghĩa là không đổi được)`,
  python: `def doi_tien(menh_gia, s_max):
    INF = float("inf")
    f = [0] + [INF] * s_max
    for s in range(1, s_max + 1):
        for c in menh_gia:
            if c <= s and f[s - c] + 1 < f[s]:
                f[s] = f[s - c] + 1
    return f[s_max] if f[s_max] != INF else -1`,
  pyMap: { 1: [1], 2: [2, 3], 3: [4], 4: [5], 5: [6, 7], 8: [8] },
  complexity: { best: 'O(S·k)', average: 'O(S·k)', worst: 'O(S·k)', memory: 'O(S)' },
  fields: [
    {
      id: 'c',
      label: 'Các mệnh giá',
      kind: 'numbers',
      default: '1 3 4',
      help: 'Từ 1 đến 5 mệnh giá, mỗi mệnh giá từ 1 đến 20.',
    },
    { id: 's', label: 'Số tiền S', kind: 'number', default: '6' },
  ],
  presets: [
    { label: 'Tham lam sai (1, 3, 4 và 6)', values: { c: '1 3 4', s: '6' } },
    { label: 'Không đổi được', values: { c: '4 6', s: '9' } },
  ],
  random: (rng) => ({
    c: [...new Set(randomList(rng, randInt(rng, 2, 4), 1, 9))].join(' '),
    s: String(randInt(rng, 6, 20)),
  }),
  legend: ['active', 'compare', 'found'],
  problems: ['doi-tien'],
  run(v) {
    const coins = parseNumbers(v.c, 'Mệnh giá', { min: 1, max: 20, minLen: 1, maxLen: 5 });
    const S = parseInt1(v.s, 'Số tiền S', 1, 30);
    const INF = Number.POSITIVE_INFINITY;
    const f = new Array<number>(S + 1).fill(INF);
    f[0] = 0;
    const r = new Recorder();
    const show = (marks: Record<number, CellState>) => ({
      ...cells(
        f.map((x) => (x === INF ? -1 : x)),
        states(S + 1, marks),
        'f[s]: số tờ ít nhất cho s đồng (-1 là chưa đổi được)',
      ),
    });
    r.push(show({ 0: 'done' }), 2, `f[0] = 0; các ô khác chưa đổi được.`, { S });
    for (let s = 1; s <= S; s += 1) {
      for (const c of coins) {
        if (c > s) continue;
        r.counters.compare += 1;
        const better = f[s - c]! + 1 < f[s]!;
        if (better) f[s] = f[s - c]! + 1;
        r.push(
          show({ [s]: 'active', [s - c]: 'compare' }),
          5,
          better
            ? `Dùng tờ ${c}: f[${s}] = f[${s - c}] + 1 = ${f[s]}.`
            : `Dùng tờ ${c} không tốt hơn (f[${s - c}] ${f[s - c] === INF ? 'chưa đổi được' : `+ 1 = ${f[s - c]! + 1}`}).`,
          { s, c, 'f[s]': f[s] === INF ? '∞' : f[s]! },
        );
      }
    }
    const result = f[S] === INF ? -1 : f[S]!;
    r.push(
      show({ [S]: 'found' }),
      8,
      result === -1
        ? `Không đổi được ${S} đồng bằng các mệnh giá ${list(coins)}.`
        : `Cần ít nhất ${result} tờ để trả ${S} đồng.`,
      { 'kết quả': result },
    );
    return { steps: r.steps, result };
  },
  reference: (v) => {
    const coins = parseNumbers(v.c, '', { min: 1, max: 20, minLen: 1, maxLen: 5 });
    const S = Number(v.s);
    // Tìm theo chiều rộng: số tờ nhỏ nhất là số tầng.
    let frontier = new Set([0]);
    for (let k = 0; k <= S; k += 1) {
      if (frontier.has(S)) return k;
      const next = new Set<number>();
      frontier.forEach((x) => coins.forEach((c) => x + c <= S && next.add(x + c)));
      frontier = next;
    }
    return -1;
  },
};

export const DP = [lis, knapsack, lcs, gridPaths, coinChange];
