/** Số học: Euclid, sàng Eratosthenes, lũy thừa nhanh, đổi cơ số. */
import { parseInt1, randInt, Recorder } from '../helpers';
import {
  InputError,
  type AlgorithmDef,
  type ArrayFrame,
  type CellState,
  type GridFrame,
} from '../types';

const table = (header: string[], rows: (string | number)[][], highlight = -1): GridFrame => ({
  kind: 'grid',
  colLabels: header,
  cells: rows.map((row) => [...row]),
  states: rows.map((row, i) => row.map((): CellState => (i === highlight ? 'active' : 'idle'))),
});

/* ------------------------------------------------------------- Euclid */
export const euclid: AlgorithmDef = {
  slug: 'euclid-ucln',
  title: 'Thuật toán Euclid tìm ƯCLN',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['so-hoc'],
  summary: 'ƯCLN(a, b) = ƯCLN(b, a mod b): lặp lại cho tới khi số chia bằng 0.',
  explain: [
    'Mọi ước chung của a và b cũng là ước của a mod b, nên ƯCLN(a, b) = ƯCLN(b, a mod b). Khi b = 0, ƯCLN là a.',
    'Số bước tăng rất chậm theo độ lớn của số (cỡ log của số nhỏ hơn), nên tìm ƯCLN của hai số 18 chữ số vẫn chỉ mất vài chục bước. Bội chung nhỏ nhất: BCNN(a, b) = a // ƯCLN(a, b) × b.',
  ],
  pseudocode: `THUẬT TOÁN Euclid(a, b)
TRONG KHI b ≠ 0 LÀM
    r ← a mod b
    a ← b
    b ← r
HẾT KHI
TRẢ VỀ a`,
  python: `def ucln(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [3], 5: [3], 7: [4] },
  complexity: {
    best: 'O(1)',
    average: 'O(log min(a, b))',
    worst: 'O(log min(a, b))',
    memory: 'O(1)',
  },
  fields: [
    { id: 'a', label: 'Số a', kind: 'number', default: '252' },
    { id: 'b', label: 'Số b', kind: 'number', default: '105' },
  ],
  presets: [
    { label: 'Ví dụ', values: { a: '252', b: '105' } },
    { label: 'Hai số Fibonacci (nhiều bước nhất)', values: { a: '987', b: '610' } },
    { label: 'Nguyên tố cùng nhau', values: { a: '35', b: '18' } },
  ],
  random: (rng) => ({ a: String(randInt(rng, 20, 999)), b: String(randInt(rng, 2, 500)) }),
  legend: ['active'],
  run(v) {
    let a = parseInt1(v.a, 'Số a', 0, 1_000_000_000);
    let b = parseInt1(v.b, 'Số b', 0, 1_000_000_000);
    if (a === 0 && b === 0)
      throw new InputError('ƯCLN(0, 0) không xác định: nhập ít nhất một số khác 0.');
    const header = ['a', 'b', 'a mod b'];
    const rows: (string | number)[][] = [];
    const r = new Recorder();
    r.push(table(header, [[a, b, '']], 0), 1, `Tìm ƯCLN(${a}, ${b}).`, { a, b });
    while (b !== 0) {
      const rem = a % b;
      rows.push([a, b, rem]);
      r.counters.write += 1;
      r.push(table(header, rows, rows.length - 1), 3, `${a} mod ${b} = ${rem}.`, { a, b, r: rem });
      a = b;
      b = rem;
      r.push(
        table(header, [...rows, [a, b, '']], rows.length),
        5,
        `Thay (a, b) bằng (${a}, ${b}).`,
        { a, b },
      );
    }
    r.push(table(header, [...rows, [a, b, '']], rows.length), 7, `b = 0 nên ƯCLN là ${a}.`, {
      ƯCLN: a,
    });
    return { steps: r.steps, result: a };
  },
  reference: (v) => {
    const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));
    // Đối chiếu bằng cách thử mọi ước của số nhỏ hơn.
    const a = Number(v.a);
    const b = Number(v.b);
    if (a === 0 || b === 0) return a + b;
    let best = 1;
    for (let d = 1; d <= Math.min(a, b); d += 1) if (a % d === 0 && b % d === 0) best = d;
    return best === g(a, b) ? best : NaN;
  },
};

/* ------------------------------------------------------------- Sàng */
export const sieve: AlgorithmDef = {
  slug: 'sang-eratosthenes',
  title: 'Sàng Eratosthenes',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['so-nguyen-to', 'so-hoc'],
  summary: 'Gạch bỏ bội của từng số nguyên tố, những số còn lại đến cuối là số nguyên tố.',
  explain: [
    'Bắt đầu coi mọi số từ 2 đến N là nguyên tố. Với mỗi p còn là nguyên tố, gạch bỏ các bội p², p² + p, … Chỉ cần xét p tới √N.',
    'Bắt đầu gạch từ p² vì các bội nhỏ hơn đã bị gạch bởi số nguyên tố nhỏ hơn. Độ phức tạp O(N log log N): sàng tới 10⁶ chạy trong vài phần mười giây bằng Python.',
  ],
  pseudocode: `THUẬT TOÁN SàngEratosthenes(N)
coi mọi số từ 2 đến N là nguyên tố
VỚI p TỪ 2 TRONG KHI p × p ≤ N LÀM
    NẾU p còn là nguyên tố THÌ
        VỚI k TỪ p × p ĐẾN N BƯỚC p LÀM
            gạch k (là hợp số)
        HẾT VỚI
    HẾT NẾU
HẾT VỚI`,
  python: `def sang(n):
    la_nt = [True] * (n + 1)
    la_nt[0] = la_nt[1] = False
    p = 2
    while p * p <= n:
        if la_nt[p]:
            for k in range(p * p, n + 1, p):
                la_nt[k] = False
        p += 1
    return [i for i in range(n + 1) if la_nt[i]]`,
  pyMap: { 1: [1], 2: [2, 3], 3: [4, 5, 9], 4: [6], 5: [7], 6: [8], 9: [10] },
  complexity: {
    best: 'O(N log log N)',
    average: 'O(N log log N)',
    worst: 'O(N log log N)',
    memory: 'O(N)',
  },
  fields: [{ id: 'n', label: 'N (từ 10 đến 200)', kind: 'number', default: '60' }],
  presets: [
    { label: 'N = 60', values: { n: '60' } },
    { label: 'N = 120', values: { n: '120' } },
  ],
  random: (rng) => ({ n: String(randInt(rng, 30, 120)) }),
  legend: ['pivot', 'compare', 'dim', 'done'],
  run(v) {
    const n = parseInt1(v.n, 'N', 10, 200);
    const prime = new Array<boolean>(n + 1).fill(true);
    prime[0] = false;
    prime[1] = false;
    const confirmed = new Set<number>();
    const cols = 10;
    const r = new Recorder();
    const grid = (marks: Record<number, CellState> = {}): GridFrame => {
      const cells: number[][] = [];
      const st: CellState[][] = [];
      for (let start = 1; start <= n; start += cols) {
        const row: number[] = [];
        const srow: CellState[] = [];
        for (let x = start; x < start + cols && x <= n; x += 1) {
          row.push(x);
          srow.push(marks[x] ?? (x < 2 || !prime[x] ? 'dim' : confirmed.has(x) ? 'done' : 'idle'));
        }
        cells.push(row);
        st.push(srow);
      }
      return {
        kind: 'grid',
        cells,
        states: st,
        caption: 'Số đã gạch bị làm mờ; số nguyên tố đã chắc chắn có nền xanh.',
      };
    };
    r.push(grid(), 2, `Coi mọi số từ 2 đến ${n} là nguyên tố.`, { N: n });
    for (let p = 2; p * p <= n; p += 1) {
      r.counters.compare += 1;
      if (!prime[p]) {
        r.push(grid({ [p]: 'compare' }), 4, `${p} đã bị gạch (là hợp số): bỏ qua.`, { p });
        continue;
      }
      confirmed.add(p);
      r.push(
        grid({ [p]: 'pivot' }),
        4,
        `${p} là số nguyên tố: gạch các bội của ${p} từ ${p * p}.`,
        { p },
      );
      for (let k = p * p; k <= n; k += p) {
        const was = prime[k];
        prime[k] = false;
        r.counters.write += 1;
        r.push(
          grid({ [p]: 'pivot', [k]: 'compare' }),
          6,
          was ? `Gạch ${k} = ${p} × ${k / p}.` : `${k} đã bị gạch trước đó.`,
          { p, k },
        );
      }
    }
    for (let x = 2; x <= n; x += 1) if (prime[x]) confirmed.add(x);
    const primes = [...confirmed].sort((a, b) => a - b);
    r.push(grid(), 9, `Còn lại ${primes.length} số nguyên tố không vượt quá ${n}.`, {
      N: n,
      'số lượng': primes.length,
    });
    return { steps: r.steps, result: primes };
  },
  reference: (v) => {
    const n = Number(v.n);
    const out: number[] = [];
    for (let x = 2; x <= n; x += 1) {
      let ok = true;
      for (let d = 2; d * d <= x; d += 1) if (x % d === 0) ok = false;
      if (ok) out.push(x);
    }
    return out;
  },
};

/* ------------------------------------------------------------- Lũy thừa nhanh */
export const fastPower: AlgorithmDef = {
  slug: 'luy-thua-nhanh',
  title: 'Lũy thừa nhanh',
  category: 'van-dung',
  levels: ['thpt'],
  topics: ['so-hoc'],
  summary: 'Tính aᵇ mod m bằng cách xét từng bit của b: chỉ cần khoảng log₂ b phép nhân.',
  explain: [
    'Viết b dưới dạng nhị phân. Mỗi vòng: nếu bit thấp nhất của b là 1 thì nhân kết quả với a; sau đó bình phương a và chia b cho 2.',
    'Trong Python có sẵn pow(a, b, m) làm đúng việc này. Lấy mod ở mỗi bước để số không phình to.',
  ],
  pseudocode: `THUẬT TOÁN LũyThừaNhanh(a, b, m)
kq ← 1
TRONG KHI b > 0 LÀM
    NẾU b lẻ THÌ kq ← kq × a mod m
    a ← a × a mod m
    b ← ⌊b / 2⌋
HẾT KHI
TRẢ VỀ kq`,
  python: `def luy_thua(a, b, m):
    kq = 1
    a %= m
    while b > 0:
        if b % 2 == 1:
            kq = kq * a % m
        a = a * a % m
        b //= 2
    return kq`,
  pyMap: { 1: [1], 2: [2, 3], 3: [4], 4: [5, 6], 5: [7], 6: [8], 8: [9] },
  complexity: { best: 'O(log b)', average: 'O(log b)', worst: 'O(log b)', memory: 'O(1)' },
  fields: [
    { id: 'a', label: 'Cơ số a', kind: 'number', default: '3' },
    { id: 'b', label: 'Số mũ b', kind: 'number', default: '45' },
    { id: 'm', label: 'Lấy dư cho m', kind: 'number', default: '1000' },
  ],
  presets: [{ label: 'Ví dụ', values: { a: '3', b: '45', m: '1000' } }],
  random: (rng) => ({
    a: String(randInt(rng, 2, 30)),
    b: String(randInt(rng, 5, 200)),
    m: String(randInt(rng, 7, 999)),
  }),
  legend: ['active', 'done'],
  run(v) {
    let a = parseInt1(v.a, 'Cơ số a', 0, 1_000_000);
    let b = parseInt1(v.b, 'Số mũ b', 0, 1_000_000_000);
    const m = parseInt1(v.m, 'm', 1, 1_000_000);
    const bits = b.toString(2).split('').reverse().map(Number);
    const r = new Recorder();
    const bitFrame = (pos: number): ArrayFrame => ({
      kind: 'array',
      // Hiển thị bit cao nhất bên trái; ô thứ d ứng với bit số (độ dài - 1 - d).
      values: [...bits].reverse(),
      states: bits.map((_, d): CellState => {
        const bit = bits.length - 1 - d;
        return bit === pos ? 'active' : bit < pos ? 'done' : 'idle';
      }),
      cells: true,
      caption: `b = ${b} viết dạng nhị phân`,
    });
    let kq = 1 % m;
    a %= m;
    let pos = 0;
    r.push(bitFrame(-1), 2, `kq = 1. b = ${b} = ${b.toString(2)} (nhị phân).`, { kq, a, b });
    while (b > 0) {
      r.counters.compare += 1;
      if (b % 2 === 1) {
        const before = kq;
        kq = (kq * a) % m;
        r.counters.write += 1;
        r.push(bitFrame(pos), 4, `Bit ${pos} bằng 1: kq = ${before} × ${a} mod ${m} = ${kq}.`, {
          kq,
          a,
          b,
        });
      } else {
        r.push(bitFrame(pos), 4, `Bit ${pos} bằng 0: giữ nguyên kq.`, { kq, a, b });
      }
      const old = a;
      a = (a * a) % m;
      b = Math.floor(b / 2);
      pos += 1;
      r.push(bitFrame(pos - 1), 6, `a = ${old}² mod ${m} = ${a}; b ← ${b}.`, { kq, a, b });
    }
    r.push(bitFrame(bits.length), 8, `Kết quả: ${kq}.`, { kq });
    return { steps: r.steps, result: kq };
  },
  reference: (v) => {
    const m = BigInt(v.m ?? 1);
    let result = 1n % m;
    const base = BigInt(v.a ?? 0) % m;
    for (let i = 0; i < Number(v.b); i += 1) result = (result * base) % m;
    return Number(result);
  },
};

/* ------------------------------------------------------------- Đổi cơ số */
const DIGITS = '0123456789ABCDEF';
export const baseConversion: AlgorithmDef = {
  slug: 'doi-co-so',
  title: 'Đổi số sang hệ cơ số khác',
  category: 'co-ban',
  levels: ['thcs', 'thpt'],
  topics: ['so-hoc'],
  summary:
    'Chia liên tiếp cho cơ số k và ghi lại số dư; đọc các số dư từ dưới lên được biểu diễn trong hệ k.',
  explain: [
    'Số dư của phép chia n cho k là chữ số hàng thấp nhất trong hệ k. Lấy thương chia tiếp cho k để được chữ số kế tiếp, cho tới khi thương bằng 0.',
    'Hệ 16 dùng thêm các chữ A đến F cho giá trị 10 đến 15.',
  ],
  pseudocode: `THUẬT TOÁN ĐổiCơSố(n, k)
chữ_số ← rỗng
TRONG KHI n > 0 LÀM
    thêm (n mod k) vào đầu chữ_số
    n ← ⌊n / k⌋
HẾT KHI
TRẢ VỀ chữ_số`,
  python: `def doi_co_so(n, k):
    chu_so = "0123456789ABCDEF"
    if n == 0:
        return "0"
    kq = ""
    while n > 0:
        kq = chu_so[n % k] + kq
        n //= k
    return kq`,
  pyMap: { 1: [1], 2: [2, 3, 4, 5], 3: [6], 4: [7], 5: [8], 7: [9] },
  complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', memory: 'O(log n)' },
  fields: [
    { id: 'n', label: 'Số n (hệ 10)', kind: 'number', default: '2026' },
    {
      id: 'k',
      label: 'Cơ số k',
      kind: 'select',
      default: '2',
      options: [
        { value: '2', label: 'Hệ 2 (nhị phân)' },
        { value: '8', label: 'Hệ 8' },
        { value: '16', label: 'Hệ 16' },
      ],
    },
  ],
  presets: [
    { label: '2026 sang hệ 2', values: { n: '2026', k: '2' } },
    { label: '255 sang hệ 16', values: { n: '255', k: '16' } },
  ],
  random: (rng) => ({
    n: String(randInt(rng, 10, 5000)),
    k: ['2', '8', '16'][randInt(rng, 0, 2)]!,
  }),
  legend: ['active'],
  run(v) {
    let n = parseInt1(v.n, 'Số n', 0, 1_000_000_000);
    const k = Number(v.k) === 8 ? 8 : Number(v.k) === 16 ? 16 : 2;
    const header = ['n', `n mod ${k}`, `⌊n / ${k}⌋`];
    const rows: (string | number)[][] = [];
    const r = new Recorder();
    let digits = '';
    r.push(table(header, [[n, '', '']], 0), 2, `Đổi ${n} sang hệ ${k}.`, { n, k });
    if (n === 0) digits = '0';
    while (n > 0) {
      const rem = n % k;
      const q = Math.floor(n / k);
      digits = DIGITS[rem]! + digits;
      rows.push([n, `${rem} (${DIGITS[rem]})`, q]);
      r.counters.write += 1;
      r.push(
        table(header, rows, rows.length - 1),
        4,
        `${n} chia ${k} được ${q}, dư ${rem}: thêm "${DIGITS[rem]}" vào đầu → ${digits}.`,
        { n, k, chữ_số: digits },
      );
      n = q;
    }
    r.push(table(header, rows), 7, `Kết quả: ${digits} (hệ ${k}). Đọc cột số dư từ dưới lên.`, {
      chữ_số: digits,
    });
    return { steps: r.steps, result: digits };
  },
  reference: (v) => Number(v.n).toString(Number(v.k)).toUpperCase(),
};

export const NUMBER = [euclid, sieve, fastPower, baseConversion];
