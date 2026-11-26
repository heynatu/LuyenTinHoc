/** So khớp tập kết quả SQL (logic thuần, có unit test). Tên cột không tính, thứ tự cột có tính. */

export type SqlValue = string | number | null | Uint8Array;
export type ResultSet = { columns: string[]; values: SqlValue[][] };

const cell = (v: SqlValue): string => {
  if (v === null) return 'NULL';
  if (typeof v === 'number')
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e9) / 1e9);
  if (v instanceof Uint8Array) return `blob:${v.length}`;
  return `s:${v}`;
};

const rowKey = (row: SqlValue[]) => row.map(cell).join('\u0001');

export type CompareResult = { ok: true } | { ok: false; reason: string };

export function compareResults(
  expected: ResultSet | undefined,
  actual: ResultSet | undefined,
  ordered = false,
): CompareResult {
  if (!expected)
    return actual ? { ok: false, reason: 'Câu lệnh không cần trả về bảng kết quả.' } : { ok: true };
  if (!actual)
    return { ok: false, reason: 'Câu lệnh chưa trả về bảng kết quả nào. Bạn đã viết SELECT chưa?' };
  if (expected.columns.length !== actual.columns.length) {
    return {
      ok: false,
      reason: `Kết quả cần ${expected.columns.length} cột, bạn trả về ${actual.columns.length} cột.`,
    };
  }
  if (expected.values.length !== actual.values.length) {
    return {
      ok: false,
      reason: `Kết quả cần ${expected.values.length} dòng, bạn trả về ${actual.values.length} dòng.`,
    };
  }
  const a = expected.values.map(rowKey);
  const b = actual.values.map(rowKey);
  if (ordered) {
    const i = a.findIndex((key, k) => key !== b[k]);
    if (i === -1) return { ok: true };
    const sameSet = [...a].sort().join('\n') === [...b].sort().join('\n');
    return {
      ok: false,
      reason: sameSet
        ? 'Đúng các dòng nhưng sai thứ tự. Kiểm tra lại ORDER BY.'
        : `Dòng ${i + 1} khác với kết quả cần có.`,
    };
  }
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((key, i) => key === sb[i])
    ? { ok: true }
    : {
        ok: false,
        reason: 'Có dòng khác với kết quả cần có. Kiểm tra lại điều kiện lọc và các cột.',
      };
}
