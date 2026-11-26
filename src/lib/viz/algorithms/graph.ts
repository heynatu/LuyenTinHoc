/** Đồ thị: BFS, DFS, Dijkstra trên đồ thị nhỏ; BFS trên lưới mê cung. */
import { parseInt1, randInt, Recorder } from '../helpers';
import {
  InputError,
  type AlgorithmDef,
  type ArrayFrame,
  type CellState,
  type GraphFrame,
  type GridFrame,
} from '../types';

type Graph = {
  n: number;
  edges: { a: number; b: number; w: number }[];
  adj: { v: number; w: number; e: number }[][];
};

function parseGraph(
  rawN: string | undefined,
  rawEdges: string | undefined,
  weighted: boolean,
): Graph {
  const n = parseInt1(rawN, 'Số đỉnh n', 2, 9);
  const lines = (rawEdges ?? '')
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length > 20) throw new InputError('Tối đa 20 cạnh.');
  const edges = lines.map((line, k) => {
    const parts = line.split(/[\s,]+/).map(Number);
    if (parts.length !== (weighted ? 3 : 2) || parts.some((x) => !Number.isInteger(x))) {
      throw new InputError(
        `Dòng cạnh ${k + 1} "${line}": cần ${weighted ? 'ba số u v w' : 'hai số u v'}.`,
      );
    }
    const [a, b, w = 1] = parts as [number, number, number?];
    if (a < 1 || a > n || b < 1 || b > n || a === b)
      throw new InputError(`Dòng cạnh ${k + 1}: đỉnh phải từ 1 đến ${n} và hai đầu khác nhau.`);
    if (weighted && (w < 1 || w > 50))
      throw new InputError(`Dòng cạnh ${k + 1}: trọng số phải từ 1 đến 50.`);
    return { a: a - 1, b: b - 1, w };
  });
  const adj = Array.from({ length: n }, () => [] as { v: number; w: number; e: number }[]);
  edges.forEach(({ a, b, w }, e) => {
    adj[a]!.push({ v: b, w, e });
    adj[b]!.push({ v: a, w, e });
  });
  adj.forEach((list) => list.sort((p, q) => p.v - q.v));
  return { n, edges, adj };
}

function layout(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { id: i, x: 50 + 38 * Math.cos(angle), y: 50 + 38 * Math.sin(angle) };
  });
}

function randomGraph(rng: () => number, weighted: boolean) {
  const n = randInt(rng, 5, 8);
  const lines: string[] = [];
  const seen = new Set<string>();
  for (let v = 1; v < n; v += 1) {
    const u = randInt(rng, 0, v - 1);
    seen.add(`${u},${v}`);
    lines.push(`${u + 1} ${v + 1}${weighted ? ` ${randInt(rng, 1, 9)}` : ''}`);
  }
  for (let k = 0; k < 3; k += 1) {
    const u = randInt(rng, 0, n - 1);
    const v = randInt(rng, 0, n - 1);
    if (u === v || seen.has(`${Math.min(u, v)},${Math.max(u, v)}`)) continue;
    seen.add(`${Math.min(u, v)},${Math.max(u, v)}`);
    lines.push(`${u + 1} ${v + 1}${weighted ? ` ${randInt(rng, 1, 9)}` : ''}`);
  }
  return { n: String(n), e: lines.join('\n'), s: '1' };
}

const fmt = (d: number) => (d === Infinity ? '∞' : String(d));

const graphFrame = (
  g: Graph,
  nodeStates: CellState[],
  edgeStates: CellState[],
  notes: (string | null)[],
  caption: string,
): GraphFrame => ({
  kind: 'graph',
  nodes: layout(g.n),
  edges: g.edges.map(({ a, b, w }) => ({ a, b, w })),
  directed: false,
  nodeStates: [...nodeStates],
  edgeStates: [...edgeStates],
  nodeNotes: [...notes],
  caption,
});

const GRAPH_FIELDS = (weighted: boolean) => [
  { id: 'n', label: 'Số đỉnh n (2 đến 9)', kind: 'number' as const, default: weighted ? '6' : '7' },
  {
    id: 'e',
    label: weighted ? 'Cạnh, mỗi dòng: u v w (w là trọng số)' : 'Cạnh, mỗi dòng: u v',
    kind: 'textarea' as const,
    default: weighted
      ? '1 2 4\n1 3 1\n3 2 2\n2 4 5\n3 5 8\n4 5 3\n4 6 6\n5 6 1'
      : '1 2\n1 3\n2 4\n3 4\n3 5\n5 6\n6 7',
    help: 'Đồ thị vô hướng, tối đa 20 cạnh. Đỉnh đánh số từ 1.',
  },
  { id: 's', label: 'Đỉnh xuất phát', kind: 'number' as const, default: '1' },
];

/* ------------------------------------------------------------- BFS */
export const bfs: AlgorithmDef = {
  slug: 'bfs',
  title: 'Tìm kiếm theo chiều rộng (BFS)',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['do-thi', 'bfs', 'hang-doi'],
  summary:
    'Thăm đỉnh theo từng lớp khoảng cách bằng hàng đợi; cho số cạnh ít nhất từ đỉnh xuất phát tới mọi đỉnh.',
  explain: [
    'Hàng đợi bảo đảm đỉnh gần được xử lý trước đỉnh xa. Lần đầu gặp một đỉnh chính là lúc tìm được đường ngắn nhất (tính theo số cạnh) tới nó.',
    'Mỗi đỉnh vào hàng đợi một lần, mỗi cạnh xét hai lần: O(n + m). Trong Python dùng collections.deque; list.pop(0) là O(n) và làm chương trình chậm hẳn.',
  ],
  pseudocode: `THUẬT TOÁN BFS(đồ thị, s)
d[s] ← 0; d[v] ← ∞ với v khác s
hàng_đợi ← [s]
TRONG KHI hàng_đợi khác rỗng LÀM
    u ← lấy đỉnh đầu hàng_đợi
    VỚI mỗi đỉnh kề v của u LÀM
        NẾU d[v] = ∞ THÌ
            d[v] ← d[u] + 1; thêm v vào cuối hàng_đợi
        HẾT NẾU
    HẾT VỚI
HẾT KHI`,
  python: `from collections import deque


def bfs(ke, s):
    d = [-1] * len(ke)
    d[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in ke[u]:
            if d[v] == -1:
                d[v] = d[u] + 1
                q.append(v)
    return d`,
  pyMap: { 1: [4], 2: [5, 6], 3: [7], 4: [8], 5: [9], 6: [10], 7: [11], 8: [12, 13], 11: [14] },
  complexity: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n + m)', memory: 'O(n)' },
  fields: GRAPH_FIELDS(false),
  presets: [{ label: 'Ví dụ', values: { n: '7', e: '1 2\n1 3\n2 4\n3 4\n3 5\n5 6\n6 7', s: '1' } }],
  random: (rng) => randomGraph(rng, false),
  legend: ['pivot', 'active', 'compare', 'done'],
  problems: ['me-cung'],
  run(v) {
    const g = parseGraph(v.n, v.e, false);
    const s = parseInt1(v.s, 'Đỉnh xuất phát', 1, g.n) - 1;
    const d = new Array<number>(g.n).fill(Infinity);
    const ns = new Array<CellState>(g.n).fill('idle');
    const es = new Array<CellState>(g.edges.length).fill('idle');
    const queue: number[] = [s];
    const r = new Recorder();
    const frames = (caption: string): [GraphFrame, ArrayFrame] => [
      graphFrame(
        g,
        ns,
        es,
        d.map((x) => `d=${fmt(x)}`),
        caption,
      ),
      {
        kind: 'array',
        values: queue.map((x) => x + 1),
        states: queue.map(() => 'active'),
        cells: true,
        caption: 'Hàng đợi (đầu bên trái)',
      },
    ];
    d[s] = 0;
    ns[s] = 'active';
    r.push(
      frames('Đỉnh xanh đậm: đang xử lý; xanh nhạt: trong hàng đợi; xanh lá: đã xử lý.'),
      3,
      `Bắt đầu từ đỉnh ${s + 1}: d[${s + 1}] = 0.`,
      { s: s + 1 },
    );
    while (queue.length > 0) {
      const u = queue.shift()!;
      ns[u] = 'pivot';
      r.push(frames(''), 5, `Lấy đỉnh ${u + 1} ở đầu hàng đợi (d = ${d[u]}).`, {
        u: u + 1,
        'd[u]': d[u]!,
      });
      for (const { v: w, e } of g.adj[u]!) {
        r.counters.compare += 1;
        es[e] = 'compare';
        if (d[w] === Infinity) {
          d[w] = d[u]! + 1;
          queue.push(w);
          ns[w] = 'active';
          r.counters.write += 1;
          r.push(
            frames(''),
            8,
            `Đỉnh ${w + 1} chưa thăm: d[${w + 1}] = ${d[w]}, thêm vào hàng đợi.`,
            { u: u + 1, v: w + 1, 'd[v]': d[w]! },
          );
          es[e] = 'path';
        } else {
          r.push(frames(''), 7, `Đỉnh ${w + 1} đã có d = ${d[w]}: bỏ qua.`, { u: u + 1, v: w + 1 });
          es[e] = es[e] === 'compare' ? 'idle' : es[e]!;
        }
      }
      ns[u] = 'done';
    }
    r.push(
      frames(''),
      11,
      `Xong. Khoảng cách: ${d.map((x, i) => `${i + 1}:${fmt(x)}`).join(', ')}.`,
      {},
    );
    return { steps: r.steps, result: d.map((x) => (x === Infinity ? -1 : x)) };
  },
  reference: (v) => {
    const g = parseGraph(v.n, v.e, false);
    const s = Number(v.s) - 1;
    const d = new Array<number>(g.n).fill(Infinity);
    d[s] = 0;
    for (let k = 0; k < g.n; k += 1)
      for (const { a, b } of g.edges) {
        d[b] = Math.min(d[b]!, d[a]! + 1);
        d[a] = Math.min(d[a]!, d[b]! + 1);
      }
    return d.map((x) => (x === Infinity ? -1 : x));
  },
};

/* ------------------------------------------------------------- DFS */
export const dfs: AlgorithmDef = {
  slug: 'dfs',
  title: 'Tìm kiếm theo chiều sâu (DFS)',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['do-thi', 'dfs', 'de-quy'],
  summary:
    'Đi sâu theo một nhánh tới khi không đi tiếp được thì quay lui; dùng để tìm các đỉnh đến được, đếm thành phần liên thông.',
  explain: [
    'Từ đỉnh u, lần lượt thử các đỉnh kề chưa thăm và gọi đệ quy. Khi mọi đỉnh kề đã thăm, hàm kết thúc và quay về đỉnh trước đó.',
    'Bẫy: đồ thị 10⁵ đỉnh dạng đường thẳng làm đệ quy sâu 10⁵ tầng, vượt giới hạn đệ quy của Python. Khi đó dùng ngăn xếp tự quản hoặc BFS.',
  ],
  pseudocode: `THUẬT TOÁN DFS(u)
đánh dấu u đã thăm
VỚI mỗi đỉnh kề v của u LÀM
    NẾU v chưa thăm THÌ DFS(v)
HẾT VỚI`,
  python: `def dfs(u, ke, da_tham):
    da_tham[u] = True
    for v in ke[u]:
        if not da_tham[v]:
            dfs(v, ke, da_tham)`,
  pyMap: { 1: [1], 2: [2], 3: [3], 4: [4, 5] },
  complexity: {
    best: 'O(n + m)',
    average: 'O(n + m)',
    worst: 'O(n + m)',
    memory: 'O(n) cho ngăn xếp đệ quy',
  },
  fields: GRAPH_FIELDS(false),
  presets: [
    { label: 'Ví dụ', values: { n: '7', e: '1 2\n1 3\n2 4\n3 4\n3 5\n5 6\n6 7', s: '1' } },
    { label: 'Hai thành phần', values: { n: '7', e: '1 2\n2 3\n4 5\n5 6\n6 7', s: '1' } },
  ],
  random: (rng) => randomGraph(rng, false),
  legend: ['pivot', 'active', 'done', 'compare'],
  problems: ['dem-vung'],
  run(v) {
    const g = parseGraph(v.n, v.e, false);
    const s = parseInt1(v.s, 'Đỉnh xuất phát', 1, g.n) - 1;
    const seen = new Array<boolean>(g.n).fill(false);
    const order: number[] = [];
    const ns = new Array<CellState>(g.n).fill('idle');
    const es = new Array<CellState>(g.edges.length).fill('idle');
    const stack: number[] = [];
    const r = new Recorder();
    const frames = (): [GraphFrame, ArrayFrame] => [
      graphFrame(
        g,
        ns,
        es,
        ns.map((_, i) => (order.includes(i) ? `#${order.indexOf(i) + 1}` : null)),
        'Số dưới đỉnh: thứ tự thăm.',
      ),
      {
        kind: 'array',
        values: stack.map((x) => x + 1),
        states: stack.map((_, i) => (i === stack.length - 1 ? 'pivot' : 'active')),
        cells: true,
        caption: 'Ngăn xếp đệ quy (đỉnh trên cùng bên phải)',
      },
    ];
    const visit = (u: number) => {
      r.counters.call += 1;
      seen[u] = true;
      order.push(u);
      stack.push(u);
      ns[u] = 'pivot';
      r.push(frames(), 2, `Thăm đỉnh ${u + 1}.`, { u: u + 1 });
      for (const { v: w, e } of g.adj[u]!) {
        r.counters.compare += 1;
        if (!seen[w]) {
          es[e] = 'path';
          ns[u] = 'active';
          r.push(frames(), 4, `Đỉnh ${w + 1} chưa thăm: đi sâu vào ${w + 1}.`, {
            u: u + 1,
            v: w + 1,
          });
          visit(w);
          ns[u] = 'pivot';
          r.push(frames(), 3, `Quay lui về đỉnh ${u + 1}.`, { u: u + 1 });
        } else {
          r.push(frames(), 4, `Đỉnh ${w + 1} đã thăm: bỏ qua.`, { u: u + 1, v: w + 1 });
        }
      }
      ns[u] = 'done';
      stack.pop();
    };
    visit(s);
    r.push(
      frames(),
      5,
      `Xong. Đến được ${order.length} đỉnh: ${order.map((x) => x + 1).join(', ')}.`,
      {},
    );
    return { steps: r.steps, result: [...order].sort((p, q) => p - q) };
  },
  reference: (v) => {
    const g = parseGraph(v.n, v.e, false);
    const parent = Array.from({ length: g.n }, (_, i) => i);
    const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
    g.edges.forEach(({ a, b }) => (parent[find(a)] = find(b)));
    const s = Number(v.s) - 1;
    return Array.from({ length: g.n }, (_, i) => i).filter((i) => find(i) === find(s));
  },
};

/* ------------------------------------------------------------- Dijkstra */
export const dijkstra: AlgorithmDef = {
  slug: 'dijkstra',
  title: 'Đường đi ngắn nhất Dijkstra',
  category: 'chuyen-sau',
  levels: ['thpt'],
  topics: ['do-thi', 'duong-di-ngan-nhat'],
  summary:
    'Mỗi lần chốt đỉnh chưa chốt có khoảng cách nhỏ nhất, rồi cập nhật (nới lỏng) các cạnh đi ra từ nó. Trọng số không âm.',
  explain: [
    'Khi một đỉnh có khoảng cách tạm nhỏ nhất trong các đỉnh chưa chốt, không đường nào khác làm nó nhỏ hơn được nữa (vì trọng số không âm): chốt đỉnh đó.',
    'Dùng hàng đợi ưu tiên heapq: O((n + m) log n), chạy tốt với 10⁵ đỉnh. Có cạnh âm thì Dijkstra cho kết quả sai.',
  ],
  pseudocode: `THUẬT TOÁN Dijkstra(đồ thị, s)
d[s] ← 0; d[v] ← ∞ với v khác s
TRONG KHI còn đỉnh chưa chốt có d hữu hạn LÀM
    u ← đỉnh chưa chốt có d nhỏ nhất; chốt u
    VỚI mỗi cạnh (u, v, w) LÀM
        NẾU d[u] + w < d[v] THÌ d[v] ← d[u] + w
    HẾT VỚI
HẾT KHI`,
  python: `import heapq


def dijkstra(ke, s):
    INF = float("inf")
    d = [INF] * len(ke)
    d[s] = 0
    pq = [(0, s)]
    while pq:
        du, u = heapq.heappop(pq)
        if du > d[u]:
            continue
        for v, w in ke[u]:
            if du + w < d[v]:
                d[v] = du + w
                heapq.heappush(pq, (d[v], v))
    return d`,
  pyMap: { 1: [4], 2: [5, 6, 7, 8], 3: [9], 4: [10, 11, 12], 5: [13], 6: [14, 15, 16], 8: [17] },
  complexity: {
    best: 'O((n + m) log n)',
    average: 'O((n + m) log n)',
    worst: 'O((n + m) log n)',
    memory: 'O(n + m)',
  },
  fields: GRAPH_FIELDS(true),
  presets: [
    {
      label: 'Ví dụ',
      values: { n: '6', e: '1 2 4\n1 3 1\n3 2 2\n2 4 5\n3 5 8\n4 5 3\n4 6 6\n5 6 1', s: '1' },
    },
  ],
  random: (rng) => randomGraph(rng, true),
  legend: ['pivot', 'compare', 'swap', 'done'],
  problems: ['giao-hang'],
  run(v) {
    const g = parseGraph(v.n, v.e, true);
    const s = parseInt1(v.s, 'Đỉnh xuất phát', 1, g.n) - 1;
    const d = new Array<number>(g.n).fill(Infinity);
    const fixed = new Array<boolean>(g.n).fill(false);
    const ns = new Array<CellState>(g.n).fill('idle');
    const es = new Array<CellState>(g.edges.length).fill('idle');
    const r = new Recorder();
    const frame = () =>
      graphFrame(
        g,
        ns,
        es,
        d.map((x) => `d=${fmt(x)}`),
        'Xanh lá: đã chốt. Số trên cạnh là trọng số.',
      );
    d[s] = 0;
    r.push(frame(), 2, `d[${s + 1}] = 0, các đỉnh khác ∞.`, { s: s + 1 });
    for (;;) {
      let u = -1;
      for (let i = 0; i < g.n; i += 1)
        if (!fixed[i] && d[i]! < Infinity && (u === -1 || d[i]! < d[u]!)) u = i;
      if (u === -1) break;
      fixed[u] = true;
      ns[u] = 'pivot';
      r.push(frame(), 4, `Chốt đỉnh ${u + 1}: d nhỏ nhất trong các đỉnh chưa chốt (${d[u]}).`, {
        u: u + 1,
        'd[u]': d[u]!,
      });
      for (const { v: w, w: wt, e } of g.adj[u]!) {
        if (fixed[w]) continue;
        r.counters.compare += 1;
        es[e] = 'compare';
        const cand = d[u]! + wt;
        if (cand < d[w]!) {
          const old = d[w]!;
          d[w] = cand;
          ns[w] = 'active';
          r.counters.write += 1;
          r.push(
            frame(),
            6,
            `Qua ${u + 1}: ${d[u]} + ${wt} = ${cand} < ${fmt(old)}, cập nhật d[${w + 1}].`,
            { u: u + 1, v: w + 1, 'd[v]': cand },
          );
          es[e] = 'swap';
        } else {
          r.push(
            frame(),
            6,
            `Qua ${u + 1}: ${d[u]} + ${wt} = ${cand} không nhỏ hơn ${fmt(d[w]!)}.`,
            { u: u + 1, v: w + 1 },
          );
          es[e] = 'idle';
        }
      }
      ns[u] = 'done';
    }
    r.push(
      frame(),
      8,
      `Xong. Khoảng cách: ${d.map((x, i) => `${i + 1}:${fmt(x)}`).join(', ')}.`,
      {},
    );
    return { steps: r.steps, result: d.map((x) => (x === Infinity ? -1 : x)) };
  },
  reference: (v) => {
    const g = parseGraph(v.n, v.e, true);
    const s = Number(v.s) - 1;
    const d = new Array<number>(g.n).fill(Infinity);
    d[s] = 0;
    for (let k = 0; k < g.n; k += 1)
      for (const { a, b, w } of g.edges) {
        d[b] = Math.min(d[b]!, d[a]! + w);
        d[a] = Math.min(d[a]!, d[b]! + w);
      }
    return d.map((x) => (x === Infinity ? -1 : x));
  },
};

/* ------------------------------------------------------------- BFS mê cung */
function parseGrid(raw: string | undefined): string[] {
  const rows = (raw ?? '')
    .trim()
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (rows.length < 2 || rows.length > 9) throw new InputError('Mê cung cần từ 2 đến 9 dòng.');
  const width = rows[0]!.length;
  if (width < 2 || width > 12) throw new InputError('Mỗi dòng cần từ 2 đến 12 ô.');
  for (const row of rows) {
    if (row.length !== width) throw new InputError('Các dòng phải dài bằng nhau.');
    if (!/^[.#]+$/.test(row)) throw new InputError('Chỉ dùng dấu chấm (ô trống) và # (tường).');
  }
  if (rows[0]![0] === '#' || rows.at(-1)!.at(-1) === '#')
    throw new InputError('Ô xuất phát (trên trái) và ô đích (dưới phải) không được là tường.');
  return rows;
}

export const bfsGrid: AlgorithmDef = {
  slug: 'bfs-me-cung',
  title: 'BFS tìm đường ngắn nhất trong mê cung',
  category: 'chuyen-sau',
  levels: ['thcs', 'thpt'],
  topics: ['bfs', 'do-thi', 'hang-doi'],
  summary: 'Loang từ ô xuất phát theo từng lớp; lần đầu chạm ô đích chính là số bước ít nhất.',
  explain: [
    'Mỗi ô là một đỉnh, nối với 4 ô kề không phải tường. BFS từ ô trên trái loang ra như vết dầu: các ô cách k bước được thăm trước các ô cách k + 1 bước.',
    'Đề HSG hay cho mê cung 1000 × 1000: với Python nên lưu khoảng cách trong mảng phẳng và dùng deque.',
  ],
  pseudocode: `THUẬT TOÁN BFSMêCung(lưới)
d[ô đầu] ← 0; hàng_đợi ← [ô đầu]
TRONG KHI hàng_đợi khác rỗng LÀM
    (x, y) ← lấy ô đầu hàng_đợi
    NẾU (x, y) là ô đích THÌ TRẢ VỀ d[x][y]
    VỚI mỗi ô kề (u, v) trong 4 hướng LÀM
        NẾU (u, v) trong lưới, không là tường, chưa thăm THÌ
            d[u][v] ← d[x][y] + 1; thêm (u, v) vào hàng_đợi
    HẾT VỚI
HẾT KHI
TRẢ VỀ -1 (không tới được)`,
  python: `from collections import deque


def bfs_me_cung(luoi):
    m, n = len(luoi), len(luoi[0])
    d = [[-1] * n for _ in range(m)]
    d[0][0] = 0
    q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        if (x, y) == (m - 1, n - 1):
            return d[x][y]
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            u, v = x + dx, y + dy
            if 0 <= u < m and 0 <= v < n and luoi[u][v] == "." and d[u][v] == -1:
                d[u][v] = d[x][y] + 1
                q.append((u, v))
    return -1`,
  pyMap: {
    1: [4, 5],
    2: [6, 7, 8],
    3: [9],
    4: [10],
    5: [11, 12],
    6: [13, 14],
    7: [15],
    8: [16, 17],
    11: [18],
  },
  complexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)', memory: 'O(m·n)' },
  fields: [
    {
      id: 'g',
      label: 'Mê cung (dấu chấm là ô trống, # là tường)',
      kind: 'textarea',
      default: '..#.....\n.##.###.\n....#...\n.##.#.#.\n.#..#.#.\n...##...',
      help: 'Từ 2 đến 9 dòng, mỗi dòng 2 đến 12 ô. Đi từ ô trên trái tới ô dưới phải.',
    },
  ],
  presets: [
    { label: 'Ví dụ', values: { g: '..#.....\n.##.###.\n....#...\n.##.#.#.\n.#..#.#.\n...##...' } },
    { label: 'Không có đường', values: { g: '..#..\n..#..\n###..\n.....' } },
  ],
  random: (rng) => {
    const m = randInt(rng, 4, 7);
    const n = randInt(rng, 5, 9);
    const rows = Array.from({ length: m }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        (i === 0 && j === 0) || (i === m - 1 && j === n - 1) || rng() > 0.27 ? '.' : '#',
      ).join(''),
    );
    return { g: rows.join('\n') };
  },
  legend: ['pivot', 'active', 'done', 'wall', 'found'],
  problems: ['me-cung'],
  run(v) {
    const grid = parseGrid(v.g);
    const m = grid.length;
    const n = grid[0]!.length;
    const d = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
    const st: CellState[][] = grid.map((row) =>
      row.split('').map((ch): CellState => (ch === '#' ? 'wall' : 'idle')),
    );
    const r = new Recorder();
    const frame = (caption = 'Số trong ô: số bước từ ô xuất phát.'): GridFrame => ({
      kind: 'grid',
      cells: d.map((row, i) => row.map((x, j) => (grid[i]![j] === '#' ? '' : x < 0 ? '' : x))),
      states: st.map((row) => [...row]),
      caption,
    });
    const queue: [number, number][] = [[0, 0]];
    d[0]![0] = 0;
    st[0]![0] = 'active';
    r.push(frame(), 2, 'Bắt đầu ở ô (0, 0), số bước 0.', { 'hàng đợi': 1 });
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      st[x]![y] = 'pivot';
      r.push(frame(), 4, `Lấy ô (${x}, ${y}) ra khỏi hàng đợi, d = ${d[x]![y]}.`, {
        x,
        y,
        'hàng đợi': queue.length,
      });
      if (x === m - 1 && y === n - 1) {
        // Tô lại đường đi ngắn nhất bằng cách lần ngược từ đích.
        let cx = x;
        let cy = y;
        while (cx !== 0 || cy !== 0) {
          st[cx]![cy] = 'found';
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const) {
            const px = cx + dx;
            const py = cy + dy;
            if (px >= 0 && px < m && py >= 0 && py < n && d[px]![py] === d[cx]![cy]! - 1) {
              cx = px;
              cy = py;
              break;
            }
          }
        }
        st[0]![0] = 'found';
        r.push(frame('Đường ngắn nhất được tô màu.'), 5, `Tới ô đích sau ${d[x]![y]} bước.`, {
          'kết quả': d[x]![y]!,
        });
        return { steps: r.steps, result: d[x]![y]! };
      }
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const u = x + dx;
        const w = y + dy;
        r.counters.compare += 1;
        if (u >= 0 && u < m && w >= 0 && w < n && grid[u]![w] === '.' && d[u]![w] === -1) {
          d[u]![w] = d[x]![y]! + 1;
          st[u]![w] = 'active';
          queue.push([u, w]);
          r.counters.write += 1;
        }
      }
      r.push(frame(), 8, `Thêm các ô kề còn trống của (${x}, ${y}) vào hàng đợi.`, {
        x,
        y,
        'hàng đợi': queue.length,
      });
      st[x]![y] = 'done';
    }
    r.push(frame(), 11, 'Hàng đợi rỗng mà chưa tới đích: không có đường đi.', { 'kết quả': -1 });
    return { steps: r.steps, result: -1 };
  },
  reference: (v) => {
    const grid = parseGrid(v.g);
    const m = grid.length;
    const n = grid[0]!.length;
    const d = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity));
    d[0]![0] = 0;
    for (let changed = true; changed;) {
      changed = false;
      for (let i = 0; i < m; i += 1)
        for (let j = 0; j < n; j += 1) {
          if (grid[i]![j] === '#') continue;
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const) {
            const u = i + dx;
            const w = j + dy;
            if (u >= 0 && u < m && w >= 0 && w < n && d[u]![w]! + 1 < d[i]![j]!) {
              d[i]![j] = d[u]![w]! + 1;
              changed = true;
            }
          }
        }
    }
    const end = d[m - 1]![n - 1]!;
    return end === Infinity ? -1 : end;
  },
};

export const GRAPH = [bfsGrid, bfs, dfs, dijkstra];
