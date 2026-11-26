/**
 * Vẽ một hình (Frame) của mô phỏng bằng DOM và SVG. Chỉ đổi màu (không animate kích thước):
 * chuyển động chỉ trên opacity và transform, đúng quy tắc 3.8.
 * Trạng thái luôn có nhãn chữ trong chú giải và trong câu diễn giải, không chỉ dựa vào màu.
 */
import type { ArrayFrame, CellState, Frame, GraphFrame, GridFrame, PegsFrame } from './types';

export const STATE_CLASS: Record<CellState, string> = {
  idle: 'bg-surface-secondary text-text-primary border-border-action-secondary',
  compare: 'bg-surface-accent text-text-on-warning border-border-warning',
  swap: 'bg-surface-info text-text-inverted border-border-action-primary',
  done: 'bg-surface-success text-text-on-warning border-border-success',
  pivot: 'bg-surface-warning text-text-on-warning border-border-warning',
  active: 'bg-surface-info-subtle text-text-info-inverted border-border-action-primary',
  found: 'bg-surface-success text-text-on-warning border-border-success border-2',
  dim: 'bg-surface-primary text-text-tertiary border-border-primary',
  wall: 'bg-surface-inverted text-text-inverted border-border-primary',
  path: 'bg-surface-success-subtle text-text-success-inverted border-border-success',
};

export const STATE_LABEL: Record<CellState, string> = {
  idle: 'Chưa xét',
  compare: 'Đang so sánh',
  swap: 'Vừa thay đổi',
  done: 'Đã xong',
  pivot: 'Đang xử lý, phần tử chốt',
  active: 'Trong phạm vi đang xét',
  found: 'Kết quả',
  dim: 'Đã loại',
  wall: 'Tường, ô cấm',
  path: 'Đường đi',
};

const NODE_CLASS: Record<CellState, { shape: string; text: string }> = {
  idle: {
    shape: 'fill-surface-secondary stroke-border-action-secondary',
    text: 'fill-text-primary',
  },
  compare: { shape: 'fill-surface-accent stroke-border-warning', text: 'fill-text-on-warning' },
  swap: { shape: 'fill-surface-info stroke-border-action-primary', text: 'fill-text-inverted' },
  done: { shape: 'fill-surface-success stroke-border-success', text: 'fill-text-on-warning' },
  pivot: { shape: 'fill-surface-warning stroke-border-warning', text: 'fill-text-on-warning' },
  active: {
    shape: 'fill-surface-info-subtle stroke-border-action-primary',
    text: 'fill-text-info-inverted',
  },
  found: { shape: 'fill-surface-success stroke-border-success', text: 'fill-text-on-warning' },
  dim: { shape: 'fill-surface-primary stroke-border-primary', text: 'fill-text-tertiary' },
  wall: { shape: 'fill-surface-inverted stroke-border-primary', text: 'fill-text-inverted' },
  path: {
    shape: 'fill-surface-success-subtle stroke-border-success',
    text: 'fill-text-success-inverted',
  },
};

const EDGE_CLASS: Record<CellState, string> = {
  idle: 'stroke-border-tertiary',
  compare: 'stroke-border-warning',
  swap: 'stroke-border-action-primary',
  done: 'stroke-border-success',
  pivot: 'stroke-border-warning',
  active: 'stroke-border-action-primary',
  found: 'stroke-border-success',
  dim: 'stroke-border-primary',
  wall: 'stroke-border-primary',
  path: 'stroke-border-success',
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string | number,
) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
}

const SVG = 'http://www.w3.org/2000/svg';
function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  className = '',
) {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (className) node.setAttribute('class', className);
  return node;
}

function caption(text?: string) {
  return text ? el('p', 'caption-2 text-text-tertiary', text) : null;
}

function pointerRow(frame: ArrayFrame) {
  const row = el('div', 'flex gap-25');
  const names = new Map<number, string[]>();
  for (const [name, index] of Object.entries(frame.pointers ?? {})) {
    names.set(index, [...(names.get(index) ?? []), name]);
  }
  frame.values.forEach((_, i) => {
    row.append(
      el(
        'span',
        'caption-3 min-w-0 flex-1 truncate text-center text-text-info',
        (names.get(i) ?? []).join(', ') || ' ',
      ),
    );
  });
  return row;
}

function renderArray(frame: ArrayFrame) {
  const wrap = el('div', 'flex w-full flex-col gap-75');
  if (frame.cells) {
    const scroller = el('div', 'overflow-x-auto');
    const table = el('div', 'inline-flex min-w-full flex-col gap-25');
    const row = el('div', 'flex gap-25');
    const idx = el('div', 'flex gap-25');
    frame.values.forEach((value, i) => {
      const cell = el(
        'div',
        `body-5 flex min-h-touch min-w-touch flex-1 items-center justify-center rounded-8 border font-mono transition-colors duration-300 ease-base ${STATE_CLASS[frame.states[i] ?? 'idle']}`,
        value,
      );
      cell.title = STATE_LABEL[frame.states[i] ?? 'idle'];
      row.append(cell);
      idx.append(el('span', 'caption-5 min-w-touch flex-1 text-center text-text-tertiary', i));
    });
    table.append(row, idx);
    if (frame.pointers) {
      const p = pointerRow(frame);
      p.className = 'flex gap-25';
      [...p.children].forEach((c) => c.classList.add('min-w-touch'));
      table.append(p);
    }
    scroller.append(table);
    wrap.append(scroller);
  } else {
    const max = Math.max(...frame.values, 1);
    const min = Math.min(...frame.values, 0);
    const span = max - min || 1;
    const bars = el('div', 'flex h-stage items-end gap-25');
    const labels = el('div', 'flex gap-25');
    frame.values.forEach((value, i) => {
      const column = el('div', 'flex h-full min-w-0 flex-1 flex-col justify-end');
      const bar = el(
        'div',
        `w-full rounded-4 border transition-colors duration-300 ease-base ${STATE_CLASS[frame.states[i] ?? 'idle']}`,
      );
      bar.style.height = `${8 + ((value - min) / span) * 92}%`;
      bar.title = `A[${i}] = ${value}: ${STATE_LABEL[frame.states[i] ?? 'idle']}`;
      column.append(bar);
      bars.append(column);
      labels.append(
        el(
          'span',
          'caption-4 min-w-0 flex-1 truncate text-center font-mono text-text-primary',
          value,
        ),
      );
    });
    wrap.append(bars, labels);
    if (frame.pointers) wrap.append(pointerRow(frame));
  }
  const cap = caption(frame.caption);
  if (cap) wrap.prepend(cap);
  return wrap;
}

function renderGrid(frame: GridFrame) {
  const wrap = el('div', 'flex flex-col gap-75');
  const cap = caption(frame.caption);
  if (cap) wrap.append(cap);
  const scroller = el('div', 'overflow-x-auto');
  const table = el('table', 'border-separate border-spacing-25');
  if (frame.colLabels?.length) {
    const head = el('tr', '');
    if (frame.rowLabels?.length) head.append(el('th', ''));
    frame.colLabels.forEach((label) =>
      head.append(el('th', 'caption-4 px-50 text-center font-mono text-text-tertiary', label)),
    );
    table.append(head);
  }
  frame.cells.forEach((row, i) => {
    const tr = el('tr', '');
    if (frame.rowLabels?.length)
      tr.append(
        el(
          'th',
          'caption-4 pr-75 text-right whitespace-nowrap text-text-tertiary',
          frame.rowLabels[i] ?? '',
        ),
      );
    row.forEach((value, j) => {
      const state = frame.states[i]?.[j] ?? 'idle';
      const td = el(
        'td',
        `body-6 h-500 min-w-500 rounded-6 border px-50 text-center font-mono transition-colors duration-300 ease-base ${STATE_CLASS[state]}`,
        value,
      );
      td.title = STATE_LABEL[state];
      tr.append(td);
    });
    table.append(tr);
  });
  scroller.append(table);
  wrap.append(scroller);
  return wrap;
}

function renderGraph(frame: GraphFrame) {
  const wrap = el('div', 'flex flex-col gap-75');
  const cap = caption(frame.caption);
  if (cap) wrap.append(cap);
  const root = svg(
    'svg',
    { viewBox: '0 0 100 100', role: 'img', 'aria-label': 'Đồ thị' },
    'mx-auto block aspect-square w-full max-w-narrow',
  );
  frame.edges.forEach((edge, k) => {
    const a = frame.nodes[edge.a]!;
    const b = frame.nodes[edge.b]!;
    const state = frame.edgeStates[k] ?? 'idle';
    root.append(
      svg(
        'line',
        { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'stroke-width': state === 'idle' ? 0.6 : 1.4 },
        EDGE_CLASS[state],
      ),
    );
    if (edge.w !== undefined && edge.w !== 1) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      root.append(
        svg('circle', { cx: mx, cy: my, r: 3.2 }, 'fill-surface-primary stroke-border-primary'),
      );
      const t = svg(
        'text',
        { x: mx, y: my + 1.2, 'text-anchor': 'middle', 'font-size': 3.4 },
        'fill-text-secondary',
      );
      t.textContent = String(edge.w);
      root.append(t);
    }
  });
  frame.nodes.forEach((node, i) => {
    const state = frame.nodeStates[i] ?? 'idle';
    const cls = NODE_CLASS[state];
    root.append(svg('circle', { cx: node.x, cy: node.y, r: 5.5, 'stroke-width': 0.8 }, cls.shape));
    const label = svg(
      'text',
      { x: node.x, y: node.y + 1.5, 'text-anchor': 'middle', 'font-size': 4.2, 'font-weight': 600 },
      cls.text,
    );
    label.textContent = String(i + 1);
    root.append(label);
    const note = frame.nodeNotes?.[i];
    if (note) {
      const t = svg(
        'text',
        { x: node.x, y: node.y + 10, 'text-anchor': 'middle', 'font-size': 3.2 },
        'fill-text-secondary',
      );
      t.textContent = note;
      root.append(t);
    }
  });
  wrap.append(root);
  return wrap;
}

function renderPegs(frame: PegsFrame) {
  const wrap = el('div', 'flex flex-col gap-75');
  const cap = caption(frame.caption);
  if (cap) wrap.append(cap);
  const row = el('div', 'grid h-stage grid-cols-3 gap-200');
  frame.pegs.forEach((peg, p) => {
    const col = el(
      'div',
      'flex flex-col items-center justify-end gap-25 rounded-8 border border-border-primary p-75',
    );
    [...peg].reverse().forEach((disk) => {
      const moving = frame.moving?.disk === disk && frame.moving.to === p;
      const d = el(
        'div',
        `caption-3 flex h-300 items-center justify-center rounded-full border ${STATE_CLASS[moving ? 'swap' : 'idle']}`,
        disk,
      );
      d.style.width = `${25 + (disk / frame.disks) * 75}%`;
      col.append(d);
    });
    col.append(el('p', 'title-4 pt-50 text-text-primary', `Cọc ${'ABC'[p]}`));
    row.append(col);
  });
  wrap.append(row);
  return wrap;
}

export function renderFrame(frame: Frame): HTMLElement {
  switch (frame.kind) {
    case 'array':
      return renderArray(frame);
    case 'grid':
      return renderGrid(frame);
    case 'graph':
      return renderGraph(frame);
    case 'pegs':
      return renderPegs(frame);
  }
}
