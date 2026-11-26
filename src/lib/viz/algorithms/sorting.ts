/** Thuật toán sắp xếp: nổi bọt, chọn, chèn, đếm phân phối, trộn, nhanh. */
import { list, parseNumbers, randomList, randInt, Recorder, states } from '../helpers';
import type { AlgorithmDef, ArrayFrame, CellState } from '../types';

const ARRAY_FIELD = {
  id: 'a',
  label: 'Dãy số (cách nhau bởi dấu cách)',
  kind: 'numbers' as const,
  default: '29 10 14 37 13 5 21 8',
  help: 'Từ 2 đến 30 số nguyên, mỗi số từ 0 đến 99.',
};
const SORT_PRESETS = [
  { label: 'Ví dụ', values: { a: '29 10 14 37 13 5 21 8' } },
  { label: 'Đã tăng dần', values: { a: '3 8 12 19 25 31 40' } },
  { label: 'Giảm dần (xấu nhất)', values: { a: '60 52 47 33 28 19 11 4' } },
  { label: 'Nhiều số trùng', values: { a: '5 3 5 1 3 5 1 3' } },
];
const readArray = (v: Record<string, string>) =>
  parseNumbers(v.a, 'Dãy số', { min: 0, max: 99, minLen: 2, maxLen: 30 });
const randomArray = (rng: () => number) => ({
  a: randomList(rng, randInt(rng, 6, 12), 1, 60).join(' '),
});
const sortedRef = (v: Record<string, string>) => [...readArray(v)].sort((x, y) => x - y);

const bars = (
  values: number[],
  st: CellState[],
  pointers?: Record<string, number>,
): ArrayFrame => ({
  kind: 'array',
  values: [...values],
  states: st,
  ...(pointers ? { pointers } : {}),
});

/* ------------------------------------------------------------- Nổi bọt */
export const bubbleSort: AlgorithmDef = {
  slug: 'sap-xep-noi-bot',
  title: 'Sắp xếp nổi bọt',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['sap-xep'],
  summary:
    'So sánh từng cặp kề nhau và đổi chỗ nếu sai thứ tự; sau mỗi lượt, số lớn nhất "nổi" về cuối.',
  explain: [
    'Mỗi lượt duyệt từ đầu dãy, so sánh hai phần tử kề nhau và đổi chỗ nếu phần tử trước lớn hơn. Sau lượt thứ i, i phần tử lớn nhất đã nằm đúng chỗ ở cuối dãy.',
    'Nếu một lượt không đổi chỗ lần nào thì dãy đã sắp xếp xong và có thể dừng sớm. Nhờ vậy dãy đã tăng dần chỉ cần một lượt.',
  ],
  pseudocode: `THUẬT TOÁN SắpXếpNổiBọt(A, n)
VỚI i TỪ 0 ĐẾN n - 2 LÀM
    đã_đổi ← SAI
    VỚI j TỪ 0 ĐẾN n - 2 - i LÀM
        NẾU A[j] > A[j + 1] THÌ
            ĐỔI CHỖ A[j] VÀ A[j + 1]
            đã_đổi ← ĐÚNG
        HẾT NẾU
    HẾT VỚI
    NẾU KHÔNG đã_đổi THÌ DỪNG
HẾT VỚI`,
  python: `def sap_xep_noi_bot(a):
    n = len(a)
    for i in range(n - 1):
        da_doi = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                da_doi = True
        if not da_doi:
            break
    return a`,
  pyMap: { 1: [1, 2], 2: [3], 3: [4], 4: [5], 5: [6], 6: [7], 7: [8], 10: [9, 10], 11: [11] },
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', memory: 'O(1)' },
  fields: [ARRAY_FIELD],
  presets: SORT_PRESETS,
  random: randomArray,
  legend: ['compare', 'swap', 'done'],
  problems: ['xep-hang-thi-dau'],
  run(v) {
    const a = readArray(v);
    const n = a.length;
    const r = new Recorder();
    const done = new Set<number>();
    const st = (marks: Record<number, CellState> = {}) => {
      const s = states(n, marks);
      done.forEach((i) => (s[i] = 'done'));
      return s;
    };
    r.push(bars(a, st()), 1, `Bắt đầu với dãy ${list(a)}.`, { n });
    for (let i = 0; i < n - 1; i += 1) {
      let swapped = false;
      r.push(bars(a, st()), 3, `Lượt ${i + 1}: đưa số lớn nhất còn lại về vị trí ${n - 1 - i}.`, {
        i,
        đã_đổi: 'SAI',
      });
      for (let j = 0; j < n - 1 - i; j += 1) {
        r.counters.compare += 1;
        const x = a[j]!;
        const y = a[j + 1]!;
        r.push(
          bars(a, st({ [j]: 'compare', [j + 1]: 'compare' }), { j, 'j+1': j + 1 }),
          5,
          `So sánh A[${j}] = ${x} và A[${j + 1}] = ${y}.`,
          { i, j, đã_đổi: swapped ? 'ĐÚNG' : 'SAI' },
          {
            prompt: `A[${j}] = ${x}, A[${j + 1}] = ${y}. Có đổi chỗ không?`,
            options: ['Có, đổi chỗ', 'Không đổi chỗ'],
            answer: x > y ? 0 : 1,
          },
        );
        if (x > y) {
          a[j] = y;
          a[j + 1] = x;
          swapped = true;
          r.counters.swap += 1;
          r.push(
            bars(a, st({ [j]: 'swap', [j + 1]: 'swap' }), { j, 'j+1': j + 1 }),
            6,
            `${x} > ${y} nên đổi chỗ.`,
            { i, j, đã_đổi: 'ĐÚNG' },
          );
        }
      }
      done.add(n - 1 - i);
      if (!swapped) {
        for (let k = 0; k < n; k += 1) done.add(k);
        r.push(
          bars(a, st()),
          10,
          `Lượt ${i + 1} không đổi chỗ lần nào: dãy đã sắp xếp, dừng sớm.`,
          { i, đã_đổi: 'SAI' },
        );
        break;
      }
    }
    for (let k = 0; k < n; k += 1) done.add(k);
    r.push(bars(a, st()), 11, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { n });
    return { steps: r.steps, result: a };
  },
  reference: sortedRef,
};

/* ------------------------------------------------------------- Chọn */
export const selectionSort: AlgorithmDef = {
  slug: 'sap-xep-chon',
  title: 'Sắp xếp chọn',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['sap-xep'],
  summary: 'Mỗi lượt tìm số nhỏ nhất trong phần chưa sắp xếp rồi đưa về đầu phần đó.',
  explain: [
    'Ở lượt i, tìm vị trí m của số nhỏ nhất trong đoạn từ i tới cuối dãy, rồi đổi chỗ A[i] với A[m]. Sau lượt i, đoạn đầu A[0..i] đã đúng thứ tự.',
    'Số lần so sánh luôn khoảng n²/2 dù dữ liệu thế nào, nhưng số lần đổi chỗ chỉ tối đa n - 1.',
  ],
  pseudocode: `THUẬT TOÁN SắpXếpChọn(A, n)
VỚI i TỪ 0 ĐẾN n - 2 LÀM
    m ← i
    VỚI j TỪ i + 1 ĐẾN n - 1 LÀM
        NẾU A[j] < A[m] THÌ m ← j
    HẾT VỚI
    ĐỔI CHỖ A[i] VÀ A[m]
HẾT VỚI`,
  python: `def sap_xep_chon(a):
    n = len(a)
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a`,
  pyMap: { 1: [1, 2], 2: [3], 3: [4], 4: [5], 5: [6, 7], 7: [8], 8: [9] },
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', memory: 'O(1)' },
  fields: [ARRAY_FIELD],
  presets: SORT_PRESETS,
  random: randomArray,
  legend: ['compare', 'pivot', 'swap', 'done'],
  run(v) {
    const a = readArray(v);
    const n = a.length;
    const r = new Recorder();
    const st = (sorted: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, marks);
      for (let k = 0; k < sorted; k += 1) s[k] = 'done';
      return s;
    };
    r.push(bars(a, st(0)), 1, `Bắt đầu với dãy ${list(a)}.`, { n });
    for (let i = 0; i < n - 1; i += 1) {
      let m = i;
      r.push(
        bars(a, st(i, { [i]: 'pivot' }), { i, m }),
        3,
        `Lượt ${i + 1}: tạm coi A[${i}] = ${a[i]} là nhỏ nhất.`,
        { i, m },
      );
      for (let j = i + 1; j < n; j += 1) {
        r.counters.compare += 1;
        const smaller = a[j]! < a[m]!;
        r.push(
          bars(a, st(i, { [m]: 'pivot', [j]: 'compare' }), { i, m, j }),
          5,
          `So sánh A[${j}] = ${a[j]} với số nhỏ nhất hiện tại A[${m}] = ${a[m]}.`,
          { i, m, j },
          {
            prompt: `A[${j}] = ${a[j]} có nhỏ hơn A[${m}] = ${a[m]} không?`,
            options: ['Có, cập nhật m', 'Không'],
            answer: smaller ? 0 : 1,
          },
        );
        if (smaller) {
          m = j;
          r.push(
            bars(a, st(i, { [m]: 'pivot' }), { i, m }),
            5,
            `Cập nhật m = ${j}: số nhỏ nhất mới là ${a[m]}.`,
            { i, m, j },
          );
        }
      }
      if (m !== i) {
        const t = a[i]!;
        a[i] = a[m]!;
        a[m] = t;
        r.counters.swap += 1;
      }
      r.push(
        bars(a, st(i + 1, { [i]: 'swap', [m]: 'swap' }), { i, m }),
        7,
        m !== i ? `Đổi chỗ A[${i}] và A[${m}].` : `A[${i}] đã là nhỏ nhất, không cần đổi.`,
        { i, m },
      );
    }
    r.push(bars(a, st(n)), 8, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { n });
    return { steps: r.steps, result: a };
  },
  reference: sortedRef,
};

/* ------------------------------------------------------------- Chèn */
export const insertionSort: AlgorithmDef = {
  slug: 'sap-xep-chen',
  title: 'Sắp xếp chèn',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['sap-xep'],
  summary:
    'Lấy lần lượt từng số và chèn vào đúng chỗ trong phần đầu đã sắp xếp, như xếp bài trên tay.',
  explain: [
    'Đoạn đầu A[0..i-1] luôn đã sắp xếp. Lấy x = A[i], dời các số lớn hơn x sang phải một ô rồi đặt x vào chỗ trống.',
    'Với dãy gần như đã sắp xếp, sắp xếp chèn chạy rất nhanh (gần O(n)), nên thường dùng cho dãy nhỏ hoặc gần đúng thứ tự.',
  ],
  pseudocode: `THUẬT TOÁN SắpXếpChèn(A, n)
VỚI i TỪ 1 ĐẾN n - 1 LÀM
    x ← A[i]
    j ← i - 1
    TRONG KHI j ≥ 0 VÀ A[j] > x LÀM
        A[j + 1] ← A[j]
        j ← j - 1
    HẾT KHI
    A[j + 1] ← x
HẾT VỚI`,
  python: `def sap_xep_chen(a):
    for i in range(1, len(a)):
        x = a[i]
        j = i - 1
        while j >= 0 and a[j] > x:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = x
    return a`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 7: [7], 9: [8], 10: [9] },
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', memory: 'O(1)' },
  fields: [ARRAY_FIELD],
  presets: SORT_PRESETS,
  random: randomArray,
  legend: ['active', 'compare', 'swap', 'done'],
  run(v) {
    const a = readArray(v);
    const n = a.length;
    const r = new Recorder();
    const st = (sortedEnd: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, {});
      for (let k = 0; k < sortedEnd; k += 1) s[k] = 'done';
      for (const [k, state] of Object.entries(marks)) s[Number(k)] = state;
      return s;
    };
    r.push(bars(a, st(1)), 1, `Bắt đầu: đoạn A[0..0] coi như đã sắp xếp.`, { n });
    for (let i = 1; i < n; i += 1) {
      const x = a[i]!;
      let j = i - 1;
      r.push(
        bars(a, st(i, { [i]: 'active' }), { i }),
        3,
        `Lấy x = A[${i}] = ${x} để chèn vào đoạn đầu.`,
        { i, x, j },
      );
      while (j >= 0) {
        r.counters.compare += 1;
        const bigger = a[j]! > x;
        r.push(
          bars(a, st(i + 1, { [j]: 'compare', [j + 1]: 'active' }), { j, 'j+1': j + 1 }),
          5,
          `So sánh A[${j}] = ${a[j]} với x = ${x}.`,
          { i, x, j },
          {
            prompt: `A[${j}] = ${a[j]} có lớn hơn x = ${x} không?`,
            options: ['Có, dời sang phải', 'Không, dừng'],
            answer: bigger ? 0 : 1,
          },
        );
        if (!bigger) break;
        a[j + 1] = a[j]!;
        r.counters.write += 1;
        r.push(bars(a, st(i + 1, { [j + 1]: 'swap' }), { j }), 6, `Dời ${a[j]} sang phải một ô.`, {
          i,
          x,
          j,
        });
        j -= 1;
      }
      a[j + 1] = x;
      r.counters.write += 1;
      r.push(
        bars(a, st(i + 1, { [j + 1]: 'swap' }), { 'j+1': j + 1 }),
        9,
        `Đặt x = ${x} vào vị trí ${j + 1}.`,
        { i, x, j },
      );
    }
    r.push(bars(a, st(n)), 10, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { n });
    return { steps: r.steps, result: a };
  },
  reference: sortedRef,
};

/* ------------------------------------------------------------- Đếm phân phối */
export const countingSort: AlgorithmDef = {
  slug: 'sap-xep-dem-phan-phoi',
  title: 'Sắp xếp đếm phân phối',
  category: 'van-dung',
  levels: ['thcs', 'thpt'],
  topics: ['sap-xep', 'mang'],
  summary:
    'Đếm số lần xuất hiện của từng giá trị rồi ghi lại theo thứ tự giá trị. Không cần so sánh.',
  explain: [
    'Khi các số là số nguyên nhỏ trong khoảng 0 đến K, ta đếm mỗi giá trị xuất hiện bao nhiêu lần, rồi ghi lần lượt các giá trị từ nhỏ đến lớn.',
    'Độ phức tạp O(n + K): rất nhanh khi K nhỏ (ví dụ điểm thi 0 đến 10), nhưng tốn bộ nhớ khi K lớn.',
  ],
  pseudocode: `THUẬT TOÁN ĐếmPhânPhối(A, n, K)     // 0 ≤ A[i] ≤ K
đếm ← mảng K + 1 số 0
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    đếm[A[i]] ← đếm[A[i]] + 1
HẾT VỚI
k ← 0
VỚI v TỪ 0 ĐẾN K LÀM
    VỚI t TỪ 1 ĐẾN đếm[v] LÀM
        A[k] ← v
        k ← k + 1
    HẾT VỚI
HẾT VỚI`,
  python: `def dem_phan_phoi(a, k):
    dem = [0] * (k + 1)
    for x in a:
        dem[x] += 1
    i = 0
    for v in range(k + 1):
        for _ in range(dem[v]):
            a[i] = v
            i += 1
    return a`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 12: [10] },
  complexity: { best: 'O(n + K)', average: 'O(n + K)', worst: 'O(n + K)', memory: 'O(K)' },
  fields: [
    {
      ...ARRAY_FIELD,
      default: '3 7 1 3 9 0 7 3 5',
      help: 'Từ 2 đến 30 số nguyên, mỗi số từ 0 đến 15.',
    },
  ],
  presets: [
    { label: 'Ví dụ', values: { a: '3 7 1 3 9 0 7 3 5' } },
    { label: 'Điểm thi 0 đến 10', values: { a: '8 6 9 10 6 7 8 5 9 8' } },
  ],
  random: (rng) => ({ a: randomList(rng, randInt(rng, 6, 12), 0, 12).join(' ') }),
  legend: ['active', 'swap', 'done'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: 0, max: 15, minLen: 2, maxLen: 30 });
    const n = a.length;
    const K = Math.max(...a);
    const count = new Array<number>(K + 1).fill(0);
    const r = new Recorder();
    const cnt = (marks: Record<number, CellState> = {}): ArrayFrame => ({
      kind: 'array',
      values: [...count],
      states: states(K + 1, marks),
      cells: true,
      caption: 'Mảng đếm (vị trí là giá trị)',
    });
    r.push(
      [bars(a, states(n)), cnt()],
      2,
      `Giá trị lớn nhất K = ${K}: tạo mảng đếm ${K + 1} ô bằng 0.`,
      { K },
    );
    for (let i = 0; i < n; i += 1) {
      count[a[i]!]! += 1;
      r.counters.write += 1;
      r.push(
        [bars(a, states(n, { [i]: 'active' }), { i }), cnt({ [a[i]!]: 'swap' })],
        4,
        `A[${i}] = ${a[i]}: tăng đếm[${a[i]}] lên ${count[a[i]!]}.`,
        { i, 'A[i]': a[i]! },
      );
    }
    let k = 0;
    const done = (upTo: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, marks);
      for (let t = 0; t < upTo; t += 1) if (!marks[t]) s[t] = 'done';
      return s;
    };
    for (let value = 0; value <= K; value += 1) {
      for (let t = 0; t < count[value]!; t += 1) {
        a[k] = value;
        r.counters.write += 1;
        r.push(
          [bars(a, done(k, { [k]: 'swap' }), { k }), cnt({ [value]: 'active' })],
          9,
          `Ghi giá trị ${value} vào A[${k}].`,
          { v: value, k },
        );
        k += 1;
      }
    }
    r.push([bars(a, done(n)), cnt()], 12, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { K });
    return { steps: r.steps, result: a };
  },
  reference: (v) =>
    parseNumbers(v.a, 'Dãy số', { min: 0, max: 15, minLen: 2, maxLen: 30 }).sort((x, y) => x - y),
};

/* ------------------------------------------------------------- Trộn */
export const mergeSort: AlgorithmDef = {
  slug: 'sap-xep-tron',
  title: 'Sắp xếp trộn',
  category: 'van-dung',
  levels: ['thpt'],
  topics: ['sap-xep', 'de-quy'],
  summary: 'Chia đôi dãy, sắp xếp từng nửa bằng đệ quy, rồi trộn hai nửa đã sắp xếp thành một.',
  explain: [
    'Chia để trị: một dãy 1 phần tử luôn đã sắp xếp. Với dãy dài hơn, sắp xếp nửa trái, nửa phải, rồi trộn hai nửa bằng cách liên tục lấy số nhỏ hơn ở đầu hai nửa.',
    'Luôn chạy O(n log n) dù dữ liệu thế nào, nhưng cần thêm bộ nhớ O(n) để trộn.',
  ],
  pseudocode: `THUẬT TOÁN SắpXếpTrộn(A, trái, phải)
NẾU trái ≥ phải THÌ TRẢ VỀ
giữa ← ⌊(trái + phải) / 2⌋
SắpXếpTrộn(A, trái, giữa)
SắpXếpTrộn(A, giữa + 1, phải)
Trộn hai đoạn đã sắp xếp A[trái..giữa] và A[giữa + 1..phải]:
VỚI k TỪ trái ĐẾN phải LÀM
    lấy số nhỏ hơn ở đầu hai đoạn, ghi vào A[k]
HẾT VỚI`,
  python: `def sap_xep_tron(a, trai, phai):
    if trai >= phai:
        return
    giua = (trai + phai) // 2
    sap_xep_tron(a, trai, giua)
    sap_xep_tron(a, giua + 1, phai)
    left, right = a[trai:giua + 1], a[giua + 1:phai + 1]
    i = j = 0
    for k in range(trai, phai + 1):
        if j >= len(right) or (i < len(left) and left[i] <= right[j]):
            a[k] = left[i]
            i += 1
        else:
            a[k] = right[j]
            j += 1`,
  pyMap: {
    1: [1],
    2: [2, 3],
    3: [4],
    4: [5],
    5: [6],
    6: [7, 8],
    7: [9],
    8: [10, 11, 12, 13, 14, 15],
  },
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', memory: 'O(n)' },
  fields: [ARRAY_FIELD],
  presets: SORT_PRESETS,
  random: randomArray,
  legend: ['active', 'compare', 'swap', 'done'],
  run(v) {
    const a = readArray(v);
    const n = a.length;
    const r = new Recorder();
    const range = (lo: number, hi: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, {}, 'dim');
      for (let k = lo; k <= hi; k += 1) s[k] = 'active';
      for (const [k, state] of Object.entries(marks)) s[Number(k)] = state;
      return s;
    };
    const sort = (lo: number, hi: number, depth: number) => {
      r.counters.call += 1;
      r.push(
        bars(a, range(lo, hi), { trái: lo, phải: hi }),
        2,
        `Xét đoạn A[${lo}..${hi}] (độ sâu đệ quy ${depth}).`,
        { trái: lo, phải: hi },
      );
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      r.push(
        bars(a, range(lo, hi), { trái: lo, giữa: mid, phải: hi }),
        3,
        `Chia đôi tại giữa = ${mid}.`,
        { trái: lo, giữa: mid, phải: hi },
      );
      sort(lo, mid, depth + 1);
      sort(mid + 1, hi, depth + 1);
      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      r.push(
        bars(a, range(lo, hi), { trái: lo, giữa: mid, phải: hi }),
        6,
        `Trộn ${list(left)} và ${list(right)}.`,
        { trái: lo, giữa: mid, phải: hi },
      );
      let i = 0;
      let j = 0;
      for (let k = lo; k <= hi; k += 1) {
        if (i < left.length && j < right.length) r.counters.compare += 1;
        if (j >= right.length || (i < left.length && left[i]! <= right[j]!)) {
          a[k] = left[i]!;
          i += 1;
        } else {
          a[k] = right[j]!;
          j += 1;
        }
        r.counters.write += 1;
        r.push(bars(a, range(lo, hi, { [k]: 'swap' }), { k }), 8, `Ghi ${a[k]} vào A[${k}].`, {
          k,
          i,
          j,
        });
      }
    };
    sort(0, n - 1, 0);
    r.push(bars(a, states(n, {}, 'done')), 9, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { n });
    return { steps: r.steps, result: a };
  },
  reference: sortedRef,
};

/* ------------------------------------------------------------- Nhanh */
export const quickSort: AlgorithmDef = {
  slug: 'sap-xep-nhanh',
  title: 'Sắp xếp nhanh',
  category: 'van-dung',
  levels: ['thpt'],
  topics: ['sap-xep', 'de-quy'],
  summary:
    'Chọn một chốt, đưa các số nhỏ hơn chốt về bên trái, lớn hơn về bên phải, rồi làm tiếp hai bên.',
  explain: [
    'Phân hoạch Lomuto: đưa chốt về cuối đoạn, duyệt j từ trái sang, số nào nhỏ hơn chốt thì đổi về vùng bên trái (vị trí i). Cuối cùng đặt chốt vào vị trí i: chốt đã đúng chỗ.',
    'Trung bình O(n log n). Nếu luôn chọn chốt là phần tử cuối mà dãy đã sắp xếp sẵn, thuật toán rơi vào trường hợp xấu nhất O(n²): hãy thử đổi cách chọn chốt.',
  ],
  pseudocode: `THUẬT TOÁN SắpXếpNhanh(A, trái, phải)
NẾU trái ≥ phải THÌ TRẢ VỀ
chọn chốt rồi ĐỔI CHỖ nó VÀ A[phải]
p ← A[phải]
i ← trái
VỚI j TỪ trái ĐẾN phải - 1 LÀM
    NẾU A[j] < p THÌ
        ĐỔI CHỖ A[i] VÀ A[j]
        i ← i + 1
    HẾT NẾU
HẾT VỚI
ĐỔI CHỖ A[i] VÀ A[phải]
SắpXếpNhanh(A, trái, i - 1)
SắpXếpNhanh(A, i + 1, phải)`,
  python: `def sap_xep_nhanh(a, trai, phai):
    if trai >= phai:
        return
    c = (trai + phai) // 2  # chọn chốt ở giữa
    a[c], a[phai] = a[phai], a[c]
    p = a[phai]
    i = trai
    for j in range(trai, phai):
        if a[j] < p:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[phai] = a[phai], a[i]
    sap_xep_nhanh(a, trai, i - 1)
    sap_xep_nhanh(a, i + 1, phai)`,
  pyMap: {
    1: [1],
    2: [2, 3],
    3: [4, 5],
    4: [6],
    5: [7],
    6: [8],
    7: [9],
    8: [10],
    9: [11],
    12: [12],
    13: [13],
    14: [14],
  },
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', memory: 'O(log n)' },
  fields: [
    ARRAY_FIELD,
    {
      id: 'pivot',
      label: 'Cách chọn chốt',
      kind: 'select',
      default: 'giua',
      options: [
        { value: 'giua', label: 'Phần tử giữa' },
        { value: 'cuoi', label: 'Phần tử cuối' },
        { value: 'dau', label: 'Phần tử đầu' },
      ],
    },
  ],
  presets: [
    ...SORT_PRESETS,
    {
      label: 'Đã tăng, chốt cuối (xấu nhất)',
      values: { a: '2 5 9 14 20 27 33 41 50', pivot: 'cuoi' },
    },
  ],
  random: (rng) => ({ ...randomArray(rng), pivot: 'giua' }),
  legend: ['active', 'pivot', 'compare', 'swap', 'done'],
  run(v) {
    const a = readArray(v);
    const n = a.length;
    const mode = v.pivot === 'cuoi' || v.pivot === 'dau' ? v.pivot : 'giua';
    const r = new Recorder();
    const fixed = new Set<number>();
    const range = (lo: number, hi: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, {}, 'dim');
      for (let k = lo; k <= hi; k += 1) s[k] = 'active';
      fixed.forEach((k) => (s[k] = 'done'));
      for (const [k, state] of Object.entries(marks)) s[Number(k)] = state;
      return s;
    };
    const swap = (x: number, y: number) => {
      const t = a[x]!;
      a[x] = a[y]!;
      a[y] = t;
      if (x !== y) r.counters.swap += 1;
    };
    const sort = (lo: number, hi: number) => {
      r.counters.call += 1;
      r.push(bars(a, range(lo, hi), { trái: lo, phải: hi }), 2, `Xét đoạn A[${lo}..${hi}].`, {
        trái: lo,
        phải: hi,
      });
      if (lo >= hi) {
        if (lo === hi) fixed.add(lo);
        return;
      }
      const c = mode === 'cuoi' ? hi : mode === 'dau' ? lo : Math.floor((lo + hi) / 2);
      swap(c, hi);
      const p = a[hi]!;
      r.push(
        bars(a, range(lo, hi, { [hi]: 'pivot' }), { trái: lo, phải: hi }),
        4,
        `Chọn chốt p = ${p}, đưa về cuối đoạn.`,
        { p, trái: lo, phải: hi },
      );
      let i = lo;
      for (let j = lo; j < hi; j += 1) {
        r.counters.compare += 1;
        const less = a[j]! < p;
        r.push(
          bars(a, range(lo, hi, { [hi]: 'pivot', [j]: 'compare' }), { i, j }),
          7,
          `So sánh A[${j}] = ${a[j]} với chốt ${p}.`,
          { p, i, j },
          {
            prompt: `A[${j}] = ${a[j]} có nhỏ hơn chốt ${p} không?`,
            options: ['Có, đưa về bên trái', 'Không'],
            answer: less ? 0 : 1,
          },
        );
        if (less) {
          swap(i, j);
          r.push(
            bars(a, range(lo, hi, { [hi]: 'pivot', [i]: 'swap', [j]: 'swap' }), { i, j }),
            8,
            `Đổi chỗ A[${i}] và A[${j}], tăng i.`,
            { p, i: i + 1, j },
          );
          i += 1;
        }
      }
      swap(i, hi);
      fixed.add(i);
      r.push(
        bars(a, range(lo, hi, { [i]: 'done' }), { i }),
        12,
        `Đặt chốt ${p} vào vị trí ${i}: bên trái nhỏ hơn, bên phải không nhỏ hơn.`,
        { p, i },
      );
      sort(lo, i - 1);
      sort(i + 1, hi);
    };
    sort(0, n - 1);
    r.push(bars(a, states(n, {}, 'done')), 14, `Xong. Dãy sau khi sắp xếp: ${list(a)}.`, { n });
    return { steps: r.steps, result: a };
  },
  reference: sortedRef,
};

export const SORTING = [
  bubbleSort,
  selectionSort,
  insertionSort,
  countingSort,
  mergeSort,
  quickSort,
];
