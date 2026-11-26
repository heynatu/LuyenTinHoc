import { describe, expect, it } from 'vitest';
import { PUZZLES } from '../../src/data/puzzles';
import {
  binarySum,
  dailyIndex,
  isOrdered,
  runRobot,
  seededShuffle,
} from '../../src/lib/puzzles/engines';
import { buildIndex, searchDocs, type SearchDoc } from '../../src/lib/search';
import { foldVi, matchesQuery } from '../../src/lib/text';

describe('câu đố tư duy', () => {
  it('id không trùng, có ít nhất 24 câu, đủ bốn động cơ', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(24);
    expect(new Set(PUZZLES.map((p) => p.id)).size).toBe(PUZZLES.length);
    expect(new Set(PUZZLES.map((p) => p.engine))).toEqual(
      new Set(['robot', 'binary', 'order', 'choice']),
    );
  });

  for (const p of PUZZLES) {
    it(`${p.id} giải được`, () => {
      expect(p.hints).toHaveLength(2);
      if (p.engine === 'robot') {
        const rows = new Set(p.grid.map((r) => r.length));
        expect(rows.size, 'các hàng của lưới phải dài bằng nhau').toBe(1);
        const outcome = runRobot(p.grid, p.answer, p.maxCommands);
        expect(outcome.message).toBe('Robot đã tới đích.');
        expect(outcome.ok).toBe(true);
      } else if (p.engine === 'binary') {
        const total = p.cards.reduce((s, c) => s + c, 0);
        expect(p.target).toBeGreaterThan(0);
        expect(p.target).toBeLessThanOrEqual(total);
        const on = p.cards.map((_, i) => ((p.target >> (p.cards.length - 1 - i)) & 1) === 1);
        expect(binarySum(p.cards, on)).toBe(p.target);
      } else if (p.engine === 'order') {
        expect(p.steps.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.steps).size).toBe(p.steps.length);
      } else {
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThan(p.options.length);
        expect(new Set(p.options).size).toBe(p.options.length);
      }
    });
  }

  it('robot báo lỗi khi đụng tường, ra ngoài bản đồ, thiếu sao hoặc quá số lệnh', () => {
    const grid = ['S#G', '...'];
    expect(runRobot(grid, [{ dir: 'R', steps: 1 }], 3).message).toContain('đụng tường');
    expect(runRobot(grid, [{ dir: 'U', steps: 1 }], 3).message).toContain('ra khỏi bản đồ');
    expect(runRobot(['S*G'], [{ dir: 'R', steps: 2 }], 1).ok).toBe(true);
    expect(runRobot(['S.G*'], [{ dir: 'R', steps: 2 }], 1).message).toContain('ngôi sao');
    expect(
      runRobot(
        grid,
        [
          { dir: 'D', steps: 1 },
          { dir: 'R', steps: 2 },
          { dir: 'U', steps: 1 },
        ],
        2,
      ).ok,
    ).toBe(false);
    expect(runRobot(grid, [], 2).ok).toBe(false);
  });

  it('thứ tự xáo tất định, là hoán vị và không trùng thứ tự đúng', () => {
    for (let n = 2; n <= 8; n += 1) {
      const order = seededShuffle(n, 1234 + n);
      expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(isOrdered(order)).toBe(false);
      expect(seededShuffle(n, 1234 + n)).toEqual(order);
    }
  });

  it('câu đố của ngày luôn nằm trong danh sách và đổi theo ngày', () => {
    const a = dailyIndex(new Date(2026, 0, 1), PUZZLES.length);
    const b = dailyIndex(new Date(2026, 0, 2), PUZZLES.length);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(PUZZLES.length);
    expect(a).not.toBe(b);
  });
});

describe('tìm kiếm không dấu', () => {
  it('bỏ dấu, đổi đ thành d, gộp khoảng trắng', () => {
    expect(foldVi('  Quy Hoạch   Động ')).toBe('quy hoach dong');
    expect(foldVi('Đường đi')).toBe('duong di');
    expect(matchesQuery('Số nguyên tố trong đoạn', 'nguyen to')).toBe(true);
    expect(matchesQuery('Số nguyên tố trong đoạn', 'nguyen chan')).toBe(false);
    expect(matchesQuery('bất kỳ', '')).toBe(true);
  });

  it('MiniSearch tìm được khi gõ không dấu và gõ thiếu chữ', () => {
    const docs: SearchDoc[] = [
      {
        id: 0,
        title: 'Quy hoạch động nhập môn',
        url: '/a',
        kind: 'Bài học',
        text: 'trạng thái, công thức truy hồi',
      },
      {
        id: 1,
        title: 'Đường đi trên lưới',
        url: '/b',
        kind: 'Luyện đề',
        text: 'quy hoạch động đếm đường',
      },
      {
        id: 2,
        title: 'Sắp xếp nổi bọt',
        url: '/c',
        kind: 'Mô phỏng',
        text: 'đổi chỗ các cặp kề nhau',
      },
    ];
    const index = buildIndex(docs);
    const hits = searchDocs(index, 'quy hoach dong');
    expect(hits.map((h) => h.url)).toEqual(['/a', '/b']);
    expect(searchDocs(index, 'sap xe').map((h) => h.url)).toEqual(['/c']);
    expect(searchDocs(index, 'duong')[0]?.url).toBe('/b');
    expect(searchDocs(index, '   ')).toEqual([]);
  });
});
