import { describe, expect, it } from 'vitest';
import { seeded } from '../../src/lib/viz/helpers';
import { ALGORITHMS } from '../../src/lib/viz/registry';
import { tokenizePseudocode } from '../../src/lib/pseudocode';
import { InputError, type AlgorithmDef } from '../../src/lib/viz/types';

const defaults = (algo: AlgorithmDef) =>
  Object.fromEntries(algo.fields.map((f) => [f.id, f.default]));

describe('danh mục thuật toán', () => {
  it('có ít nhất 26 thuật toán, slug không trùng', () => {
    expect(ALGORITHMS.length).toBeGreaterThanOrEqual(26);
    expect(new Set(ALGORITHMS.map((a) => a.slug)).size).toBe(ALGORITHMS.length);
  });
});

describe.each(ALGORITHMS.map((a) => [a.slug, a] as const))('%s', (_slug, algo) => {
  const pseudoLines = tokenizePseudocode(algo.pseudocode).length;
  const pyLines = algo.python.split('\n').length;

  it('kết quả khớp cách giải tham chiếu (mặc định, mẫu, 150 bộ ngẫu nhiên)', () => {
    const inputs = [
      defaults(algo),
      ...algo.presets.map((p) => ({ ...defaults(algo), ...p.values })),
    ];
    const rng = seeded(20261123);
    for (let k = 0; k < 150; k += 1) inputs.push({ ...defaults(algo), ...algo.random(rng) });
    for (const input of inputs) {
      const { steps, result } = algo.run(input);
      expect(steps.length, JSON.stringify(input)).toBeGreaterThan(1);
      expect(result, JSON.stringify(input)).toEqual(algo.reference(input));
    }
  });

  it('mọi bước trỏ tới dòng giả mã có thật, pyMap trỏ tới dòng Python có thật', () => {
    const { steps } = algo.run(defaults(algo));
    for (const step of steps) {
      expect(step.line).toBeGreaterThanOrEqual(1);
      expect(step.line).toBeLessThanOrEqual(pseudoLines);
      expect(step.message.length).toBeGreaterThan(3);
      if (step.question) expect(step.question.answer).toBeLessThan(step.question.options.length);
    }
    for (const [line, targets] of Object.entries(algo.pyMap)) {
      expect(Number(line)).toBeLessThanOrEqual(pseudoLines);
      for (const t of targets) expect(t).toBeLessThanOrEqual(pyLines);
    }
  });

  it('dữ liệu sai báo lỗi tiếng Việt, không làm hỏng chương trình', () => {
    const bad = Object.fromEntries(
      algo.fields.map((f) => [
        f.id,
        f.kind === 'select' ? f.default : f.kind === 'text' ? 'x'.repeat(50) : 'abc',
      ]),
    );
    expect(() => algo.run(bad)).toThrow(InputError);
  });
});
