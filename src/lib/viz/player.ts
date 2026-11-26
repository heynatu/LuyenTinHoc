/**
 * Trình phát mô phỏng (component Visualizer.astro): chạy, tạm dừng, lùi, tới, kéo thanh thời gian,
 * tốc độ, chế độ dự đoán, đồng bộ dòng giả mã và Python. Phím tắt khi focus trong vùng mô phỏng:
 * Space chạy hoặc dừng, mũi tên trái phải lùi tới, Home End về đầu cuối.
 */
import { seeded } from './helpers';
import { getAlgorithm } from './registry';
import { renderFrame, STATE_CLASS, STATE_LABEL } from './render';
import { InputError, type AlgorithmDef, type Step } from './types';

const $ = <T extends Element>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);

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

function setActiveLines(frame: Element | null, lines: number[]) {
  if (!frame) return;
  const wanted = new Set(lines);
  frame.querySelectorAll<HTMLElement>('[data-line]').forEach((row) => {
    const on = wanted.has(Number(row.dataset.line));
    row.classList.toggle('bg-surface-primary-hover', on);
    if (on) row.dataset.active = 'true';
    else delete row.dataset.active;
    const gutter = row.firstElementChild;
    gutter?.classList.toggle('text-text-info', on);
    gutter?.classList.toggle('text-text-tertiary', !on);
  });
  const first = frame.querySelector<HTMLElement>('[data-active="true"]');
  const scroller = first?.closest<HTMLElement>('.overflow-x-auto');
  if (first && scroller && scroller.scrollHeight > scroller.clientHeight) {
    scroller.scrollTop = first.offsetTop - scroller.clientHeight / 2;
  }
}

export function initVisualizer(root: HTMLElement) {
  const slug = root.dataset.visualizer ?? '';
  const algo = getAlgorithm(slug);
  if (!algo) return;
  const compact = root.dataset.compact === 'true';

  const stage = $<HTMLElement>(root, '[data-viz-stage]')!;
  const message = $<HTMLElement>(root, '[data-viz-message]')!;
  const counter = $<HTMLElement>(root, '[data-viz-counter]');
  const range = $<HTMLInputElement>(root, '[data-viz-range]');
  const playButton = $<HTMLButtonElement>(root, '[data-viz-play]');
  const playLabel = $<HTMLElement>(root, '[data-viz-play-label]');
  const speed = $<HTMLSelectElement>(root, '[data-viz-speed]');
  const vars = $<HTMLElement>(root, '[data-viz-vars]');
  const counters = $<HTMLElement>(root, '[data-viz-counters]');
  const formError = $<HTMLElement>(root, '[data-viz-error]');
  const predictToggle = $<HTMLInputElement>(root, '[data-viz-predict]');
  const questionBox = $<HTMLElement>(root, '[data-viz-question]');
  const pseudo = $<HTMLElement>(root, '[data-viz-pseudo]');
  const python = $<HTMLElement>(root, '[data-viz-python]');
  const legend = $<HTMLElement>(root, '[data-viz-legend]');

  let steps: Step[] = [];
  let index = 0;
  let timer = 0;
  let playing = false;
  let answered = new Set<number>();

  if (legend) {
    legend.replaceChildren(
      ...algo.legend.map((state) => {
        const item = el('li', 'flex items-center gap-75');
        item.append(
          el('span', `inline-block size-200 shrink-0 rounded-4 border ${STATE_CLASS[state]}`),
          el('span', 'caption-2 text-text-secondary', STATE_LABEL[state]),
        );
        return item;
      }),
    );
  }

  function readValues(): Record<string, string> {
    const values: Record<string, string> = {};
    for (const field of algo!.fields) {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        `[data-viz-field="${field.id}"]`,
      );
      values[field.id] = input?.value ?? field.default;
    }
    return values;
  }

  function writeValues(values: Record<string, string>) {
    for (const [id, value] of Object.entries(values)) {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        `[data-viz-field="${id}"]`,
      );
      if (input) input.value = value;
    }
  }

  function show(i: number, announce = !playing) {
    const step = steps[i];
    if (!step) return;
    index = i;
    stage.replaceChildren(...step.frames.map((frame) => renderFrame(frame)));
    message.textContent = step.message;
    message.setAttribute('aria-live', announce ? 'polite' : 'off');
    if (counter) counter.textContent = `Bước ${i + 1}/${steps.length}`;
    if (range) {
      range.max = String(steps.length - 1);
      range.value = String(i);
    }
    if (vars) {
      vars.replaceChildren();
      const entries = Object.entries(step.vars);
      if (entries.length === 0)
        vars.append(el('p', 'caption-2 text-text-tertiary', 'Chưa có biến.'));
      for (const [name, value] of entries) {
        const row = el('div', 'flex items-baseline justify-between gap-100 py-25');
        row.append(
          el('dt', 'body-5 font-mono text-text-secondary', name),
          el('dd', 'body-4 font-mono text-text-primary', value),
        );
        vars.append(row);
      }
    }
    if (counters) {
      const c = step.counters;
      counters.textContent = `So sánh ${c.compare} · Đổi chỗ ${c.swap} · Ghi ${c.write}${c.call ? ` · Gọi hàm ${c.call}` : ''}`;
    }
    setActiveLines(pseudo, [step.line]);
    setActiveLines(python, algo!.pyMap[step.line] ?? []);
    if (questionBox) questionBox.hidden = true;
  }

  function stop() {
    playing = false;
    window.clearTimeout(timer);
    if (playButton && playLabel) {
      playLabel.textContent = 'Chạy';
      playButton.setAttribute('aria-pressed', 'false');
    }
  }

  function askQuestion(i: number): boolean {
    const step = steps[i];
    if (!predictToggle?.checked || !step?.question || answered.has(i) || !questionBox) return false;
    stop();
    const q = step.question;
    questionBox.hidden = false;
    questionBox.replaceChildren(el('p', 'body-4 text-text-primary', `Dự đoán: ${q.prompt}`));
    const options = el('div', 'flex flex-wrap gap-75');
    const feedback = el('p', 'body-6 text-text-secondary');
    feedback.setAttribute('aria-live', 'polite');
    q.options.forEach((label, k) => {
      const button = el(
        'button',
        'button-sm min-h-touch rounded-8 border border-border-action-secondary bg-action-secondary px-100 py-75 text-text-primary transition duration-300 ease-base hover:bg-action-secondary-hover',
        label,
      );
      button.type = 'button';
      button.addEventListener('click', () => {
        answered.add(i);
        const right = k === q.answer;
        feedback.textContent = right
          ? `Đúng. ${steps[i + 1]?.message ?? ''}`
          : `Chưa đúng: đáp án là "${q.options[q.answer]}". ${steps[i + 1]?.message ?? ''}`;
        feedback.className = `body-6 ${right ? 'text-text-success' : 'text-text-error'}`;
        options.querySelectorAll('button').forEach((b) => (b.disabled = true));
        const next = el(
          'button',
          'button-sm min-h-touch rounded-8 bg-action-primary px-100 py-75 text-text-on-action transition duration-300 ease-base hover:bg-action-primary-hover',
          'Chạy tiếp',
        );
        next.type = 'button';
        next.addEventListener('click', () => {
          show(Math.min(i + 1, steps.length - 1));
          play();
        });
        questionBox.append(next);
        next.focus();
      });
      options.append(button);
    });
    questionBox.append(options, feedback);
    options.querySelector('button')?.focus();
    return true;
  }

  function tick() {
    if (!playing) return;
    if (index >= steps.length - 1) {
      stop();
      return;
    }
    if (askQuestion(index)) return;
    show(index + 1, false);
    timer = window.setTimeout(tick, 900 / Number(speed?.value ?? 1));
  }

  function play() {
    if (steps.length === 0) return;
    if (index >= steps.length - 1) show(0);
    playing = true;
    if (playButton && playLabel) {
      playLabel.textContent = 'Tạm dừng';
      playButton.setAttribute('aria-pressed', 'true');
    }
    timer = window.setTimeout(tick, 400 / Number(speed?.value ?? 1));
  }

  function build(values: Record<string, string>, autoplay = false) {
    stop();
    try {
      const output = algo!.run(values);
      steps = output.steps;
      answered = new Set();
      if (formError) formError.hidden = true;
      show(0);
      if (autoplay) play();
    } catch (error) {
      if (!(error instanceof InputError) || !formError) throw error;
      formError.textContent = `${error.message} Sửa dữ liệu rồi bấm lại.`;
      formError.hidden = false;
    }
  }

  // ------------------------------------------------------------ Sự kiện
  playButton?.addEventListener('click', () => (playing ? stop() : play()));
  $<HTMLButtonElement>(root, '[data-viz-prev]')?.addEventListener('click', () => {
    stop();
    show(Math.max(0, index - 1));
  });
  $<HTMLButtonElement>(root, '[data-viz-next]')?.addEventListener('click', () => {
    stop();
    if (!askQuestion(index)) show(Math.min(steps.length - 1, index + 1));
  });
  $<HTMLButtonElement>(root, '[data-viz-first]')?.addEventListener('click', () => {
    stop();
    show(0);
  });
  $<HTMLButtonElement>(root, '[data-viz-last]')?.addEventListener('click', () => {
    stop();
    show(steps.length - 1);
  });
  range?.addEventListener('input', () => {
    stop();
    show(Number(range.value));
  });
  $<HTMLFormElement>(root, '[data-viz-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    build(readValues());
  });
  $<HTMLButtonElement>(root, '[data-viz-random]')?.addEventListener('click', () => {
    const values = { ...readValues(), ...algo.random(seeded(Date.now() % 2147483647)) };
    writeValues(values);
    build(values);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-viz-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = algo.presets[Number(button.dataset.vizPreset)];
      if (!preset) return;
      const values = { ...readValues(), ...preset.values };
      writeValues(values);
      build(values);
    });
  });
  root.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [data-viz-question]')) return;
    if (event.key === ' ' && !target.closest('button')) {
      event.preventDefault();
      if (playing) stop();
      else play();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stop();
      show(Math.min(steps.length - 1, index + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stop();
      show(Math.max(0, index - 1));
    } else if (event.key === 'Home') {
      stop();
      show(0);
    } else if (event.key === 'End') {
      stop();
      show(steps.length - 1);
    }
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  build(readValues(), compact && !reduce);
  if (compact && !reduce) {
    // Mô phỏng ở trang chủ: chạy lặp lại khi hết, dừng khi người dùng tương tác.
    root.addEventListener('pointerdown', () => (root.dataset.touched = 'true'), { once: true });
    window.setInterval(() => {
      if (!playing && root.dataset.touched !== 'true' && index >= steps.length - 1) {
        build({ ...readValues(), ...algo.random(seeded(Date.now() % 2147483647)) }, true);
      }
    }, 2500);
  }
}

export type { AlgorithmDef };
