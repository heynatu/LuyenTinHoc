/**
 * So sánh kết quả của bộ chấm thử. Cùng luật với same_output trong
 * scripts/content/verify_content.py để chấm trên web và kiểm định cho cùng kết luận.
 */
export type CompareMode = 'tokens' | 'lines' | 'float';

export const FLOAT_EPS = 1e-6;

const normalize = (text: string) => text.replace(/\r\n?/g, '\n');
const tokens = (text: string) => text.split(/\s+/).filter(Boolean);

export function sameOutput(
  expected: string,
  actual: string,
  mode: CompareMode = 'tokens',
): boolean {
  const a = normalize(expected);
  const b = normalize(actual);
  if (mode === 'lines') {
    const lines = (t: string) =>
      t
        .replace(/\n+$/, '')
        .split('\n')
        .map((line) => line.trimEnd());
    const la = lines(a);
    const lb = lines(b);
    return la.length === lb.length && la.every((line, i) => line === lb[i]);
  }
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length !== tb.length) return false;
  if (mode === 'tokens') return ta.every((t, i) => t === tb[i]);
  return ta.every((t, i) => {
    const u = tb[i]!;
    if (t === u) return true;
    const x = Number(t);
    const y = Number(u);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    return Math.abs(x - y) <= FLOAT_EPS * Math.max(1, Math.abs(x));
  });
}
