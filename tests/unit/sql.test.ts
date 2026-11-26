import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { schemaSql, SQL_DATABASES, SQL_EXERCISES } from '../../src/data/sql';
import { compareResults, type ResultSet } from '../../src/lib/sql/compare';

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

function fresh(dbId: string): Database {
  const db = new SQL.Database();
  db.exec(schemaSql(SQL_DATABASES.find((d) => d.id === dbId)!));
  return db;
}
const last = (r: ResultSet[]) => r[r.length - 1];

describe('so khớp tập kết quả SQL', () => {
  const a: ResultSet = {
    columns: ['x', 'y'],
    values: [
      [1, 'a'],
      [2, 'b'],
    ],
  };
  it('không phân biệt thứ tự dòng khi không yêu cầu, không tính tên cột', () => {
    expect(
      compareResults(a, {
        columns: ['p', 'q'],
        values: [
          [2, 'b'],
          [1, 'a'],
        ],
      }).ok,
    ).toBe(true);
  });
  it('bắt sai thứ tự khi bài yêu cầu ORDER BY', () => {
    const r = compareResults(
      a,
      {
        columns: ['x', 'y'],
        values: [
          [2, 'b'],
          [1, 'a'],
        ],
      },
      true,
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain('ORDER BY');
  });
  it('báo đúng lý do khi sai số cột, số dòng, hoặc không trả về bảng', () => {
    expect(compareResults(a, { columns: ['x'], values: [[1], [2]] }).ok).toBe(false);
    expect(compareResults(a, { columns: ['x', 'y'], values: [[1, 'a']] }).ok).toBe(false);
    expect(compareResults(a, undefined).ok).toBe(false);
  });
  it('so số thực với sai số làm tròn', () => {
    const x: ResultSet = { columns: ['v'], values: [[0.3]] };
    expect(compareResults(x, { columns: ['v'], values: [[0.1 + 0.2]] }).ok).toBe(true);
    expect(compareResults(x, { columns: ['v'], values: [[0.31]] }).ok).toBe(false);
  });
});

describe('cơ sở dữ liệu mẫu và bài tập', () => {
  it('mỗi cơ sở dữ liệu tạo được, khóa ngoài trỏ tới dòng có thật', () => {
    for (const d of SQL_DATABASES) {
      const db = fresh(d.id);
      const violations = db.exec('PRAGMA foreign_key_check;');
      expect(violations, `${d.id} vi phạm khóa ngoài`).toEqual([]);
      db.close();
    }
  });

  it('id bài không trùng, mỗi bài trỏ tới cơ sở dữ liệu có thật', () => {
    expect(new Set(SQL_EXERCISES.map((e) => e.id)).size).toBe(SQL_EXERCISES.length);
    for (const e of SQL_EXERCISES) expect(SQL_DATABASES.map((d) => d.id)).toContain(e.db);
  });

  for (const e of SQL_EXERCISES) {
    it(`lời giải ${e.id} chạy được và cho kết quả khác rỗng`, () => {
      const db = fresh(e.db);
      const out = db.exec(e.solution) as ResultSet[];
      const result = e.check ? last(db.exec(e.check) as ResultSet[]) : last(out);
      expect(result, `${e.id} không trả về bảng`).toBeDefined();
      expect(result!.values.length).toBeGreaterThan(0);
      if (e.check) {
        const before = last(fresh(e.db).exec(e.check) as ResultSet[]);
        expect(
          compareResults(before, result, true).ok,
          `${e.id}: lời giải không làm thay đổi dữ liệu`,
        ).toBe(false);
      }
      expect(compareResults(result, result, e.ordered).ok).toBe(true);
      db.close();
    });
  }
});
