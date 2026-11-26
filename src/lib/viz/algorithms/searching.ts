/** Tìm kiếm và kỹ thuật trên mảng: tuần tự, nhị phân, hai con trỏ, cửa sổ trượt, cộng dồn, Kadane. */
import { list, parseInt1, parseNumbers, randomList, randInt, Recorder, states } from '../helpers';
import type { AlgorithmDef, ArrayFrame, CellState } from '../types';

const cells = (
  values: number[],
  st: CellState[],
  pointers?: Record<string, number>,
  caption?: string,
): ArrayFrame => ({
  kind: 'array',
  values: [...values],
  states: st,
  cells: true,
  ...(pointers ? { pointers } : {}),
  ...(caption ? { caption } : {}),
});

/* ------------------------------------------------------------- Tuần tự */
export const linearSearch: AlgorithmDef = {
  slug: 'tim-kiem-tuan-tu',
  title: 'Tìm kiếm tuần tự',
  category: 'co-ban',
  levels: ['tieu-hoc', 'thcs', 'thpt'],
  topics: ['tim-kiem'],
  summary: 'Xét lần lượt từng phần tử từ đầu dãy cho tới khi gặp giá trị cần tìm hoặc hết dãy.',
  explain: [
    'Không cần dãy được sắp xếp. Trường hợp xấu nhất (không có giá trị cần tìm, hoặc nó ở cuối) phải xét cả n phần tử.',
    'Đây là cách tìm tự nhiên nhất, giống như lật từng trang sách để tìm một từ.',
  ],
  pseudocode: `THUẬT TOÁN TìmTuầnTự(A, n, x)
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    NẾU A[i] = x THÌ TRẢ VỀ i
HẾT VỚI
TRẢ VỀ -1`,
  python: `def tim_tuan_tu(a, x):
    for i in range(len(a)):
        if a[i] == x:
            return i
    return -1`,
  pyMap: { 1: [1], 2: [2], 3: [3, 4], 5: [5] },
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', memory: 'O(1)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số',
      kind: 'numbers',
      default: '12 7 31 4 19 25 8',
      help: 'Từ 1 đến 20 số nguyên, mỗi số từ -99 đến 99.',
    },
    { id: 'x', label: 'Giá trị cần tìm', kind: 'number', default: '19' },
  ],
  presets: [
    { label: 'Có trong dãy', values: { a: '12 7 31 4 19 25 8', x: '19' } },
    { label: 'Không có', values: { a: '12 7 31 4 19 25 8', x: '5' } },
    { label: 'Ở ngay đầu', values: { a: '9 3 6 1', x: '9' } },
  ],
  random: (rng) => {
    const a = randomList(rng, randInt(rng, 6, 10), 1, 40);
    return { a: a.join(' '), x: String(rng() < 0.7 ? a[randInt(rng, 0, a.length - 1)] : 41) };
  },
  legend: ['compare', 'found', 'dim'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 1, maxLen: 20 });
    const x = parseInt1(v.x, 'Giá trị cần tìm', -99, 99);
    const r = new Recorder();
    const n = a.length;
    r.push(cells(a, states(n)), 1, `Tìm x = ${x} trong dãy ${list(a)}.`, { x });
    for (let i = 0; i < n; i += 1) {
      r.counters.compare += 1;
      const seen: Record<number, CellState> = {};
      for (let k = 0; k < i; k += 1) seen[k] = 'dim';
      const hit = a[i] === x;
      r.push(
        cells(a, states(n, { ...seen, [i]: 'compare' }), { i }),
        3,
        `So sánh A[${i}] = ${a[i]} với x = ${x}.`,
        { x, i },
        {
          prompt: `A[${i}] = ${a[i]} có bằng x = ${x} không?`,
          options: ['Bằng, trả về i', 'Khác, xét tiếp'],
          answer: hit ? 0 : 1,
        },
      );
      if (hit) {
        r.push(
          cells(a, states(n, { ...seen, [i]: 'found' }), { i }),
          3,
          `Tìm thấy x tại vị trí ${i} sau ${i + 1} lần so sánh.`,
          { x, i },
        );
        return { steps: r.steps, result: i };
      }
    }
    r.push(
      cells(a, states(n, {}, 'dim')),
      5,
      `Đã xét hết ${n} phần tử, không có x = ${x}. Trả về -1.`,
      { x },
    );
    return { steps: r.steps, result: -1 };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 1, maxLen: 20 });
    return a.indexOf(Number(v.x));
  },
};

/* ------------------------------------------------------------- Nhị phân */
export const binarySearch: AlgorithmDef = {
  slug: 'tim-kiem-nhi-phan',
  title: 'Tìm kiếm nhị phân',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['tim-kiem', 'tim-kiem-nhi-phan'],
  summary:
    'Trên dãy đã sắp xếp, so sánh với phần tử giữa để bỏ đi một nửa phạm vi tìm sau mỗi bước.',
  explain: [
    'Dãy phải tăng dần. So sánh x với phần tử ở giữa: bằng thì tìm thấy, nhỏ hơn thì tìm tiếp nửa trái, lớn hơn thì tìm tiếp nửa phải.',
    'Mỗi bước phạm vi tìm giảm một nửa, nên dãy 1 000 000 phần tử chỉ cần khoảng 20 lần so sánh.',
  ],
  pseudocode: `THUẬT TOÁN TìmNhịPhân(A, n, x)     // A tăng dần
trái ← 0; phải ← n - 1
TRONG KHI trái ≤ phải LÀM
    giữa ← ⌊(trái + phải) / 2⌋
    NẾU A[giữa] = x THÌ TRẢ VỀ giữa
    NẾU A[giữa] < x THÌ trái ← giữa + 1
    NGƯỢC LẠI phải ← giữa - 1
HẾT KHI
TRẢ VỀ -1`,
  python: `def tim_nhi_phan(a, x):
    trai, phai = 0, len(a) - 1
    while trai <= phai:
        giua = (trai + phai) // 2
        if a[giua] == x:
            return giua
        if a[giua] < x:
            trai = giua + 1
        else:
            phai = giua - 1
    return -1`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5, 6], 6: [7, 8], 7: [9, 10], 9: [11] },
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', memory: 'O(1)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số (sẽ được sắp xếp tăng dần)',
      kind: 'numbers',
      default: '3 8 12 17 21 26 30 35 41 47 52',
      help: 'Từ 1 đến 24 số nguyên, mỗi số từ -99 đến 99.',
    },
    { id: 'x', label: 'Giá trị cần tìm', kind: 'number', default: '35' },
  ],
  presets: [
    { label: 'Có trong dãy', values: { a: '3 8 12 17 21 26 30 35 41 47 52', x: '35' } },
    { label: 'Không có', values: { a: '3 8 12 17 21 26 30 35 41 47 52', x: '20' } },
    { label: 'Ở đầu dãy', values: { a: '3 8 12 17 21 26 30 35 41 47 52', x: '3' } },
  ],
  random: (rng) => {
    const a = [...new Set(randomList(rng, 14, 1, 80))].sort((p, q) => p - q);
    return { a: a.join(' '), x: String(rng() < 0.7 ? a[randInt(rng, 0, a.length - 1)] : 81) };
  },
  legend: ['active', 'pivot', 'found', 'dim'],
  run(v) {
    const raw = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 1, maxLen: 24 });
    const a = [...raw].sort((p, q) => p - q);
    const x = parseInt1(v.x, 'Giá trị cần tìm', -99, 99);
    const n = a.length;
    const r = new Recorder();
    const range = (lo: number, hi: number, marks: Record<number, CellState> = {}) => {
      const s = states(n, {}, 'dim');
      for (let k = lo; k <= hi; k += 1) s[k] = 'active';
      for (const [k, state] of Object.entries(marks)) s[Number(k)] = state;
      return s;
    };
    const sortedNote = raw.join(' ') === a.join(' ') ? '' : ' (đã sắp xếp lại tăng dần)';
    let lo = 0;
    let hi = n - 1;
    r.push(
      cells(a, range(lo, hi), { trái: lo, phải: hi }),
      2,
      `Tìm x = ${x} trong dãy ${list(a)}${sortedNote}.`,
      { x, trái: lo, phải: hi },
    );
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      r.counters.compare += 1;
      const value = a[mid]!;
      const answer = value === x ? 2 : value < x ? 1 : 0;
      r.push(
        cells(a, range(lo, hi, { [mid]: 'pivot' }), { trái: lo, giữa: mid, phải: hi }),
        4,
        `Phần tử giữa A[${mid}] = ${value}.`,
        { x, trái: lo, giữa: mid, phải: hi },
        {
          prompt: `A[giữa] = ${value}, x = ${x}. Bước tiếp theo?`,
          options: ['Tìm nửa trái', 'Tìm nửa phải', 'Đã tìm thấy'],
          answer,
        },
      );
      if (value === x) {
        r.push(
          cells(a, range(lo, hi, { [mid]: 'found' }), { giữa: mid }),
          5,
          `A[${mid}] = x: tìm thấy sau ${r.counters.compare} lần so sánh.`,
          { x, giữa: mid },
        );
        return { steps: r.steps, result: value };
      }
      if (value < x) {
        lo = mid + 1;
        r.push(
          cells(a, range(lo, hi), { trái: lo, phải: hi }),
          6,
          `${value} < ${x}: bỏ nửa trái, trái ← ${lo}.`,
          { x, trái: lo, phải: hi },
        );
      } else {
        hi = mid - 1;
        r.push(
          cells(a, range(lo, hi), { trái: lo, phải: hi }),
          7,
          `${value} > ${x}: bỏ nửa phải, phải ← ${hi}.`,
          { x, trái: lo, phải: hi },
        );
      }
    }
    r.push(
      cells(a, states(n, {}, 'dim')),
      9,
      `Phạm vi tìm đã rỗng: không có x = ${x}. Trả về -1.`,
      { x },
    );
    return { steps: r.steps, result: -1 };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 1, maxLen: 24 });
    return a.includes(Number(v.x)) ? Number(v.x) : -1;
  },
};

/* ------------------------------------------------------------- Hai con trỏ */
export const twoPointers: AlgorithmDef = {
  slug: 'hai-con-tro',
  title: 'Hai con trỏ',
  category: 'van-dung',
  levels: ['thcs', 'thpt'],
  topics: ['hai-con-tro', 'mang'],
  summary: 'Tìm hai số có tổng bằng S trong dãy tăng dần bằng hai con trỏ đi từ hai đầu vào giữa.',
  explain: [
    'Đặt i ở đầu, j ở cuối. Nếu A[i] + A[j] nhỏ hơn S thì cần tổng lớn hơn: tăng i. Nếu lớn hơn S thì giảm j. Mỗi bước loại được một phần tử nên chỉ cần O(n).',
    'Cách thử mọi cặp cần O(n²) phép so sánh; với n = 100 000 là khoảng 5 tỉ phép, quá chậm.',
  ],
  pseudocode: `THUẬT TOÁN HaiConTrỏ(A, n, S)     // A tăng dần
i ← 0; j ← n - 1
TRONG KHI i < j LÀM
    NẾU A[i] + A[j] = S THÌ TRẢ VỀ (i, j)
    NẾU A[i] + A[j] < S THÌ i ← i + 1
    NGƯỢC LẠI j ← j - 1
HẾT KHI
TRẢ VỀ không có cặp nào`,
  python: `def hai_con_tro(a, s):
    i, j = 0, len(a) - 1
    while i < j:
        if a[i] + a[j] == s:
            return i, j
        if a[i] + a[j] < s:
            i += 1
        else:
            j -= 1
    return None`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4, 5], 5: [6, 7], 6: [8, 9], 8: [10] },
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', memory: 'O(1)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số (sẽ được sắp xếp tăng dần)',
      kind: 'numbers',
      default: '2 5 8 11 14 19 23 27',
      help: 'Từ 2 đến 20 số, mỗi số từ -99 đến 99.',
    },
    { id: 's', label: 'Tổng cần tìm S', kind: 'number', default: '33' },
  ],
  presets: [
    { label: 'Có cặp', values: { a: '2 5 8 11 14 19 23 27', s: '33' } },
    { label: 'Không có cặp', values: { a: '2 5 8 11 14 19 23 27', s: '4' } },
  ],
  random: (rng) => {
    const a = randomList(rng, randInt(rng, 6, 10), 1, 40).sort((p, q) => p - q);
    return { a: a.join(' '), s: String(a[1]! + a[a.length - 2]!) };
  },
  legend: ['compare', 'found', 'dim'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 2, maxLen: 20 }).sort(
      (p, q) => p - q,
    );
    const s = parseInt1(v.s, 'Tổng S', -200, 200);
    const n = a.length;
    const r = new Recorder();
    const st = (i: number, j: number, mark: CellState) => {
      const out = states(n, {}, 'dim');
      for (let k = i; k <= j; k += 1) out[k] = 'idle';
      out[i] = mark;
      out[j] = mark;
      return out;
    };
    let i = 0;
    let j = n - 1;
    r.push(
      cells(a, st(i, j, 'compare'), { i, j }),
      2,
      `Tìm hai số có tổng S = ${s} trong ${list(a)}.`,
      { S: s, i, j },
    );
    while (i < j) {
      const sum = a[i]! + a[j]!;
      r.counters.compare += 1;
      const answer = sum === s ? 2 : sum < s ? 0 : 1;
      r.push(
        cells(a, st(i, j, 'compare'), { i, j }),
        4,
        `A[${i}] + A[${j}] = ${a[i]} + ${a[j]} = ${sum}.`,
        { S: s, i, j, tổng: sum },
        {
          prompt: `Tổng ${sum}, cần ${s}. Làm gì tiếp?`,
          options: ['Tăng i', 'Giảm j', 'Đã tìm thấy'],
          answer,
        },
      );
      if (sum === s) {
        r.push(cells(a, st(i, j, 'found'), { i, j }), 4, `Tìm thấy: ${a[i]} + ${a[j]} = ${s}.`, {
          S: s,
          i,
          j,
        });
        return { steps: r.steps, result: true };
      }
      if (sum < s) {
        i += 1;
        r.push(
          cells(a, st(i, j, 'compare'), { i, j }),
          5,
          `${sum} < ${s}: cần tổng lớn hơn, tăng i.`,
          { S: s, i, j },
        );
      } else {
        j -= 1;
        r.push(
          cells(a, st(i, j, 'compare'), { i, j }),
          6,
          `${sum} > ${s}: cần tổng nhỏ hơn, giảm j.`,
          { S: s, i, j },
        );
      }
    }
    r.push(cells(a, states(n, {}, 'dim')), 8, `i gặp j: không có cặp nào có tổng ${s}.`, { S: s });
    return { steps: r.steps, result: false };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 2, maxLen: 20 });
    const s = Number(v.s);
    for (let i = 0; i < a.length; i += 1)
      for (let j = i + 1; j < a.length; j += 1) if (a[i]! + a[j]! === s) return true;
    return false;
  },
};

/* ------------------------------------------------------------- Cửa sổ trượt */
export const slidingWindow: AlgorithmDef = {
  slug: 'cua-so-truot',
  title: 'Cửa sổ trượt',
  category: 'van-dung',
  levels: ['thcs', 'thpt'],
  topics: ['cua-so-truot', 'mang'],
  summary:
    'Tìm tổng lớn nhất của k phần tử liên tiếp: trượt cửa sổ, cộng phần tử mới vào và trừ phần tử rời đi.',
  explain: [
    'Thay vì tính lại tổng k số cho mỗi vị trí (O(n·k)), khi cửa sổ dịch sang phải một ô ta chỉ cần cộng phần tử mới và trừ phần tử vừa rời khỏi cửa sổ: O(n).',
  ],
  pseudocode: `THUẬT TOÁN CửaSổTrượt(A, n, k)
tổng ← A[0] + … + A[k - 1]
tốt_nhất ← tổng
VỚI i TỪ k ĐẾN n - 1 LÀM
    tổng ← tổng + A[i] - A[i - k]
    NẾU tổng > tốt_nhất THÌ tốt_nhất ← tổng
HẾT VỚI
TRẢ VỀ tốt_nhất`,
  python: `def cua_so_truot(a, k):
    tong = sum(a[:k])
    tot_nhat = tong
    for i in range(k, len(a)):
        tong += a[i] - a[i - k]
        tot_nhat = max(tot_nhat, tong)
    return tot_nhat`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 8: [7] },
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', memory: 'O(1)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số',
      kind: 'numbers',
      default: '4 -2 7 1 -5 8 3 -1 6',
      help: 'Từ 2 đến 20 số, mỗi số từ -99 đến 99.',
    },
    { id: 'k', label: 'Độ dài cửa sổ k', kind: 'number', default: '3' },
  ],
  presets: [{ label: 'Ví dụ', values: { a: '4 -2 7 1 -5 8 3 -1 6', k: '3' } }],
  random: (rng) => ({
    a: randomList(rng, randInt(rng, 7, 12), -9, 20).join(' '),
    k: String(randInt(rng, 2, 4)),
  }),
  legend: ['active', 'swap', 'found'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 2, maxLen: 20 });
    const n = a.length;
    const k = parseInt1(v.k, 'Độ dài k', 1, n);
    const r = new Recorder();
    const win = (start: number, marks: Record<number, CellState> = {}) => {
      const s = states(n);
      for (let t = start; t < start + k; t += 1) s[t] = 'active';
      for (const [t, state] of Object.entries(marks)) s[Number(t)] = state;
      return s;
    };
    let sum = a.slice(0, k).reduce((p, q) => p + q, 0);
    let best = sum;
    let bestStart = 0;
    r.push(cells(a, win(0), { đầu: 0 }), 2, `Tổng của cửa sổ đầu tiên A[0..${k - 1}] = ${sum}.`, {
      k,
      tổng: sum,
      tốt_nhất: best,
    });
    for (let i = k; i < n; i += 1) {
      sum += a[i]! - a[i - k]!;
      r.counters.write += 1;
      r.push(
        cells(a, win(i - k + 1, { [i]: 'swap' }), { vào: i, ra: i - k }),
        5,
        `Thêm A[${i}] = ${a[i]}, bớt A[${i - k}] = ${a[i - k]}: tổng = ${sum}.`,
        { k, i, tổng: sum, tốt_nhất: best },
      );
      r.counters.compare += 1;
      if (sum > best) {
        best = sum;
        bestStart = i - k + 1;
        r.push(
          cells(a, win(bestStart), { đầu: bestStart }),
          6,
          `Tổng ${sum} lớn hơn kỷ lục: cập nhật tốt_nhất.`,
          { k, i, tổng: sum, tốt_nhất: best },
        );
      }
    }
    const fin = states(n);
    for (let t = bestStart; t < bestStart + k; t += 1) fin[t] = 'found';
    r.push(
      cells(a, fin, { đầu: bestStart }),
      8,
      `Tổng lớn nhất của ${k} số liên tiếp là ${best}.`,
      { k, tốt_nhất: best },
    );
    return { steps: r.steps, result: best };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 2, maxLen: 20 });
    const k = Number(v.k);
    let best = -Infinity;
    for (let s = 0; s + k <= a.length; s += 1)
      best = Math.max(
        best,
        a.slice(s, s + k).reduce((p, q) => p + q, 0),
      );
    return best;
  },
};

/* ------------------------------------------------------------- Cộng dồn */
export const prefixSum: AlgorithmDef = {
  slug: 'mang-cong-don',
  title: 'Mảng cộng dồn',
  category: 'van-dung',
  levels: ['thcs', 'thpt'],
  topics: ['mang-cong-don', 'mang'],
  summary:
    'Tính trước P[i] là tổng i phần tử đầu, rồi trả lời tổng mọi đoạn A[l..r] bằng một phép trừ.',
  explain: [
    'P[0] = 0 và P[i] = P[i - 1] + A[i - 1]. Khi đó tổng đoạn A[l..r] (chỉ số từ 0) bằng P[r + 1] - P[l].',
    'Tính P mất O(n), mỗi câu hỏi sau đó chỉ O(1): rất hợp với đề có hàng trăm nghìn truy vấn tổng đoạn.',
  ],
  pseudocode: `THUẬT TOÁN MảngCộngDồn(A, n)
P[0] ← 0
VỚI i TỪ 1 ĐẾN n LÀM
    P[i] ← P[i - 1] + A[i - 1]
HẾT VỚI
tổng đoạn A[l..r] ← P[r + 1] - P[l]`,
  python: `def cong_don(a):
    p = [0] * (len(a) + 1)
    for i in range(1, len(a) + 1):
        p[i] = p[i - 1] + a[i - 1]
    return p

# tổng đoạn a[l..r] (chỉ số từ 0)
tong = p[r + 1] - p[l]`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [7, 8] },
  complexity: {
    best: 'O(n) tính trước, O(1) mỗi truy vấn',
    average: 'O(n + q)',
    worst: 'O(n + q)',
    memory: 'O(n)',
  },
  fields: [
    {
      id: 'a',
      label: 'Dãy số',
      kind: 'numbers',
      default: '5 3 -2 8 4 1 7',
      help: 'Từ 1 đến 16 số, mỗi số từ -99 đến 99.',
    },
    { id: 'l', label: 'Đầu đoạn l (từ 0)', kind: 'number', default: '2' },
    { id: 'r', label: 'Cuối đoạn r', kind: 'number', default: '5' },
  ],
  presets: [{ label: 'Ví dụ', values: { a: '5 3 -2 8 4 1 7', l: '2', r: '5' } }],
  random: (rng) => {
    const n = randInt(rng, 6, 10);
    const l = randInt(rng, 0, n - 2);
    return {
      a: randomList(rng, n, -9, 20).join(' '),
      l: String(l),
      r: String(randInt(rng, l, n - 1)),
    };
  },
  legend: ['active', 'swap', 'found'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 1, maxLen: 16 });
    const n = a.length;
    const l = parseInt1(v.l, 'Đầu đoạn l', 0, n - 1);
    const rr = parseInt1(v.r, 'Cuối đoạn r', l, n - 1);
    const p = new Array<number>(n + 1).fill(0);
    const r = new Recorder();
    const pFrame = (marks: Record<number, CellState> = {}): ArrayFrame =>
      cells(p, states(n + 1, marks), undefined, 'Mảng P (P[i] là tổng i số đầu)');
    r.push([cells(a, states(n), undefined, 'Dãy A'), pFrame({ 0: 'done' })], 2, 'P[0] = 0.', {});
    for (let i = 1; i <= n; i += 1) {
      p[i] = p[i - 1]! + a[i - 1]!;
      r.counters.write += 1;
      r.push(
        [
          cells(a, states(n, { [i - 1]: 'active' }), { 'i-1': i - 1 }, 'Dãy A'),
          pFrame({ [i - 1]: 'active', [i]: 'swap' }),
        ],
        4,
        `P[${i}] = P[${i - 1}] + A[${i - 1}] = ${p[i - 1]} + ${a[i - 1]} = ${p[i]}.`,
        { i },
      );
    }
    const total = p[rr + 1]! - p[l]!;
    const seg: Record<number, CellState> = {};
    for (let k = l; k <= rr; k += 1) seg[k] = 'found';
    r.push(
      [
        cells(a, states(n, seg), { l, r: rr }, 'Dãy A'),
        pFrame({ [rr + 1]: 'compare', [l]: 'compare' }),
      ],
      6,
      `Tổng A[${l}..${rr}] = P[${rr + 1}] - P[${l}] = ${p[rr + 1]} - ${p[l]} = ${total}.`,
      { l, r: rr, tổng: total },
    );
    return { steps: r.steps, result: total };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 1, maxLen: 16 });
    return a.slice(Number(v.l), Number(v.r) + 1).reduce((p, q) => p + q, 0);
  },
};

/* ------------------------------------------------------------- Kadane */
export const kadane: AlgorithmDef = {
  slug: 'kadane',
  title: 'Đoạn con tổng lớn nhất (Kadane)',
  category: 'van-dung',
  levels: ['thpt'],
  topics: ['quy-hoach-dong', 'mang'],
  summary:
    'Duyệt một lần, giữ tổng lớn nhất của đoạn kết thúc tại vị trí đang xét: nối tiếp đoạn cũ hay bắt đầu đoạn mới.',
  explain: [
    'Gọi hiện_tại là tổng lớn nhất của đoạn kết thúc tại A[i]. Hoặc nối A[i] vào đoạn kết thúc tại A[i - 1], hoặc bắt đầu đoạn mới chỉ gồm A[i]: chọn cái lớn hơn.',
    'Bẫy hay gặp: khởi tạo tốt_nhất = 0 sẽ sai khi mọi số đều âm. Hãy khởi tạo bằng A[0].',
  ],
  pseudocode: `THUẬT TOÁN Kadane(A, n)
hiện_tại ← A[0]; tốt_nhất ← A[0]
VỚI i TỪ 1 ĐẾN n - 1 LÀM
    hiện_tại ← max(A[i], hiện_tại + A[i])
    tốt_nhất ← max(tốt_nhất, hiện_tại)
HẾT VỚI
TRẢ VỀ tốt_nhất`,
  python: `def kadane(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 7: [6] },
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', memory: 'O(1)' },
  fields: [
    {
      id: 'a',
      label: 'Dãy số',
      kind: 'numbers',
      default: '-2 3 -1 4 -6 5 2 -3',
      help: 'Từ 1 đến 20 số, mỗi số từ -99 đến 99.',
    },
  ],
  presets: [
    { label: 'Ví dụ', values: { a: '-2 3 -1 4 -6 5 2 -3' } },
    { label: 'Toàn số âm', values: { a: '-7 -3 -9 -5' } },
  ],
  random: (rng) => ({ a: randomList(rng, randInt(rng, 7, 12), -9, 9).join(' ') }),
  legend: ['active', 'found'],
  problems: ['doan-con-tong-lon-nhat'],
  run(v) {
    const a = parseNumbers(v.a, 'Dãy số', { min: -99, max: 99, minLen: 1, maxLen: 20 });
    const n = a.length;
    const r = new Recorder();
    let cur = a[0]!;
    let best = a[0]!;
    let curStart = 0;
    let bestRange: [number, number] = [0, 0];
    const st = (lo: number, hi: number, state: CellState) => {
      const s = states(n);
      for (let k = lo; k <= hi; k += 1) s[k] = state;
      return s;
    };
    r.push(
      cells(a, st(0, 0, 'active'), { i: 0 }),
      2,
      `Bắt đầu: hiện_tại = tốt_nhất = A[0] = ${cur}.`,
      { hiện_tại: cur, tốt_nhất: best },
    );
    for (let i = 1; i < n; i += 1) {
      const x = a[i]!;
      r.counters.compare += 1;
      const extend = cur + x >= x;
      r.push(
        cells(a, st(curStart, i - 1, 'active'), { i }),
        4,
        `Nối A[${i}] = ${x} vào đoạn cũ được ${cur + x}; bắt đầu đoạn mới được ${x}.`,
        { i, hiện_tại: cur, tốt_nhất: best },
        {
          prompt: `Nối vào đoạn cũ (${cur + x}) hay bắt đầu đoạn mới (${x})?`,
          options: ['Nối vào đoạn cũ', 'Bắt đầu đoạn mới'],
          answer: extend ? 0 : 1,
        },
      );
      if (extend) cur += x;
      else {
        cur = x;
        curStart = i;
      }
      if (cur > best) {
        best = cur;
        bestRange = [curStart, i];
      }
      r.push(
        cells(a, st(curStart, i, 'active'), { i }),
        5,
        `hiện_tại = ${cur}, tốt_nhất = ${best}.`,
        { i, hiện_tại: cur, tốt_nhất: best },
      );
    }
    r.push(
      cells(a, st(bestRange[0], bestRange[1], 'found')),
      7,
      `Đoạn A[${bestRange[0]}..${bestRange[1]}] có tổng lớn nhất ${best}.`,
      { tốt_nhất: best },
    );
    return { steps: r.steps, result: best };
  },
  reference: (v) => {
    const a = parseNumbers(v.a, '', { min: -99, max: 99, minLen: 1, maxLen: 20 });
    let best = -Infinity;
    for (let i = 0; i < a.length; i += 1) {
      let s = 0;
      for (let j = i; j < a.length; j += 1) {
        s += a[j]!;
        best = Math.max(best, s);
      }
    }
    return best;
  },
};

export const SEARCHING = [
  linearSearch,
  binarySearch,
  twoPointers,
  slidingWindow,
  prefixSum,
  kadane,
];
