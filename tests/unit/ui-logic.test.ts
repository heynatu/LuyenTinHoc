import { describe, expect, it } from 'vitest';
import { highlightLines } from '../../src/lib/highlight';
import { tokenizePseudocode } from '../../src/lib/pseudocode';
import { cleanPath, nextTabIndex, paginationRange, ringGeometry } from '../../src/lib/ui-logic';
import {
  BUTTON_VARIANTS,
  buttonClasses,
  fieldClasses,
  FIELD_STATES,
  iconButtonClasses,
  VISUAL_STATES,
} from '../../src/components/ui/recipes';

const lineText = (line: { text: string }[]) => line.map((s) => s.text).join('');

describe('paginationRange', () => {
  it('trả đúng các trường hợp tiêu biểu', () => {
    expect(paginationRange(1, 0)).toEqual([]);
    expect(paginationRange(1, 1)).toEqual([1]);
    expect(paginationRange(1, 3)).toEqual([1, 2, 3]);
    expect(paginationRange(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12]);
    expect(paginationRange(12, 12)).toEqual([1, 'gap', 11, 12]);
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(paginationRange(99, 5)).toEqual([1, 'gap', 4, 5]);
  });

  it('với mọi tổng số trang và trang hiện tại: tăng dần, có trang đầu, cuối, hiện tại, mỗi chỗ lược bỏ ít nhất 2 trang', () => {
    for (let total = 1; total <= 30; total += 1) {
      for (let current = 1; current <= total; current += 1) {
        const items = paginationRange(current, total);
        const pages = items.filter((i): i is number => i !== 'gap');
        expect(pages[0]).toBe(1);
        expect(pages.at(-1)).toBe(total);
        expect(pages).toContain(current);
        for (let i = 1; i < pages.length; i += 1)
          expect(pages[i]).toBeGreaterThan(pages[i - 1] ?? 0);
        items.forEach((item, i) => {
          if (item !== 'gap') return;
          const before = items[i - 1] as number;
          const after = items[i + 1] as number;
          expect(after - before).toBeGreaterThanOrEqual(3);
        });
      }
    }
  });
});

describe('nextTabIndex', () => {
  it('đi vòng tròn bằng mũi tên, Home, End', () => {
    expect(nextTabIndex(0, 'ArrowRight', 3)).toBe(1);
    expect(nextTabIndex(2, 'ArrowRight', 3)).toBe(0);
    expect(nextTabIndex(0, 'ArrowLeft', 3)).toBe(2);
    expect(nextTabIndex(1, 'Home', 3)).toBe(0);
    expect(nextTabIndex(0, 'End', 3)).toBe(2);
    expect(nextTabIndex(0, 'Enter', 3)).toBeNull();
    expect(nextTabIndex(0, 'ArrowRight', 0)).toBeNull();
  });
});

describe('ringGeometry', () => {
  it('giới hạn giá trị trong 0 đến 100', () => {
    expect(ringGeometry(-5, 64, 6).pct).toBe(0);
    expect(ringGeometry(140, 64, 6).pct).toBe(100);
    expect(ringGeometry(Number.NaN, 64, 6).pct).toBe(0);
    const half = ringGeometry(50, 64, 6);
    expect(half.offset).toBeCloseTo(half.circumference / 2, 6);
  });
});

describe('highlightLines (Prism lúc build)', () => {
  const code = 'def f(x):\r\n    """doc\r\nline"""\r\n    return x // 2  # chú thích\r\n';

  it('không mất ký tự: ghép các đoạn ra đúng từng dòng gốc', () => {
    const lines = highlightLines(code, 'python');
    expect(lines.map(lineText)).toEqual([
      'def f(x):',
      '    """doc',
      'line"""',
      '    return x // 2  # chú thích',
    ]);
  });

  it('gắn đúng lớp token, kể cả chuỗi nhiều dòng', () => {
    const lines = highlightLines(code, 'python');
    expect(lines[0]?.[0]).toEqual({ text: 'def', classes: ['tok-keyword'] });
    expect(lines[2]?.[0]?.classes).toContain('tok-triple-quoted-string');
    expect(lines[3]?.at(-1)?.classes).toContain('tok-comment');
  });

  it('SQL và văn bản thuần', () => {
    expect(highlightLines('SELECT 1;', 'sql')[0]?.[0]?.classes).toContain('tok-keyword');
    expect(highlightLines('a\nb', 'text')).toEqual([
      [{ text: 'a', classes: [] }],
      [{ text: 'b', classes: [] }],
    ]);
  });
});

describe('tokenizePseudocode', () => {
  const code = `THUẬT TOÁN Tìm(A, n)   // chỉ số từ 0
NẾU A[i] ≥ 10 THÌ
    x ← "xong"
NGƯỢC LẠI
    TRẢ VỀ SAI
HẾT NẾU
NẾUA vẫn là tên biến`;

  it('không mất ký tự', () => {
    expect(tokenizePseudocode(code).map(lineText)).toEqual(code.split('\n'));
  });

  it('nhận từ khóa nhiều chữ, chú thích, chuỗi, số, phép gán', () => {
    const lines = tokenizePseudocode(code);
    const tokens = (n: number, cls: string) =>
      (lines[n] ?? []).filter((s) => s.classes.includes(cls)).map((s) => s.text);
    expect(tokens(0, 'tok-keyword')).toEqual(['THUẬT TOÁN']);
    expect(tokens(0, 'tok-comment')).toEqual(['// chỉ số từ 0']);
    expect(tokens(1, 'tok-keyword')).toEqual(['NẾU', 'THÌ']);
    expect(tokens(1, 'tok-number')).toEqual(['10']);
    expect(tokens(1, 'tok-operator')).toEqual(['≥']);
    expect(tokens(2, 'tok-operator')).toEqual(['←']);
    expect(tokens(2, 'tok-string')).toEqual(['"xong"']);
    expect(tokens(3, 'tok-keyword')).toEqual(['NGƯỢC LẠI']);
    expect(tokens(4, 'tok-keyword')).toEqual(['TRẢ VỀ', 'SAI']);
    expect(tokens(5, 'tok-keyword')).toEqual(['HẾT NẾU']);
    expect(tokens(6, 'tok-keyword')).toEqual([]);
  });
});

describe('recipe class', () => {
  it('mọi loại và trạng thái của Button dùng text style, vùng bấm 44px, không có giá trị ngoài token', () => {
    for (const variant of BUTTON_VARIANTS) {
      for (const state of [...VISUAL_STATES, 'interactive'] as const) {
        const classes = buttonClasses(variant, 'md', state);
        expect(classes).toContain('button-md');
        expect(classes).toContain('min-h-touch');
        expect(classes).not.toMatch(/\[/);
      }
      expect(buttonClasses(variant, 'md', 'disabled')).toContain('cursor-not-allowed');
      expect(buttonClasses(variant, 'md', 'focus')).toContain('focus-ring');
    }
  });

  it('IconButton và ô nhập có đủ trạng thái', () => {
    for (const state of VISUAL_STATES)
      expect(iconButtonClasses('ghost', state)).toContain('min-w-touch');
    for (const state of FIELD_STATES) expect(fieldClasses(state)).toContain('body-3');
    expect(fieldClasses('error')).toContain('border-border-error');
    expect(fieldClasses('interactive')).toContain('error:border-border-error');
  });
});

describe('cleanPath', () => {
  it('bỏ đuôi .html và index của bản build format file', () => {
    expect(cleanPath('/index.html')).toBe('/');
    expect(cleanPath('/hoc.html')).toBe('/hoc');
    expect(cleanPath('/tu-duy/gap-giay.html')).toBe('/tu-duy/gap-giay');
    expect(cleanPath('/hoc/index.html')).toBe('/hoc');
  });
  it('giữ nguyên đường dẫn sạch của dev server', () => {
    expect(cleanPath('/')).toBe('/');
    expect(cleanPath('')).toBe('/');
    expect(cleanPath('/hoc')).toBe('/hoc');
    expect(cleanPath('/hoc/')).toBe('/hoc');
  });
});
