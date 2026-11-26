/**
 * Tách token giả mã tiếng Việt theo quy ước mục 5.3 của docs/SUPER_PROMPT.md.
 * Từ khóa viết hoa: NHẬP, XUẤT, NẾU … THÌ … NGƯỢC LẠI … HẾT NẾU, VỚI … TỪ … ĐẾN … LÀM … HẾT VỚI,
 * TRONG KHI … LÀM … HẾT KHI, HÀM … TRẢ VỀ … HẾT HÀM, THUẬT TOÁN, ĐỔI CHỖ, VÀ, HOẶC, KHÔNG.
 * Ghép lại toàn bộ đoạn của một dòng phải ra đúng dòng gốc (không mất ký tự).
 */
import { normalizeCode, type Line, type Segment } from './highlight';

/** Từ khóa nhiều chữ đứng trước để ưu tiên khớp dài nhất. */
export const PSEUDO_KEYWORDS = [
  'THUẬT TOÁN',
  'NGƯỢC LẠI NẾU',
  'NGƯỢC LẠI',
  'HẾT NẾU',
  'HẾT VỚI',
  'HẾT KHI',
  'HẾT HÀM',
  'TRONG KHI',
  'TRẢ VỀ',
  'ĐỔI CHỖ',
  'NHẬP',
  'XUẤT',
  'NẾU',
  'THÌ',
  'VỚI',
  'TỪ',
  'ĐẾN',
  'BƯỚC',
  'DỪNG',
  'LÀM',
  'HÀM',
  'VÀ',
  'HOẶC',
  'KHÔNG',
  'ĐÚNG',
  'SAI',
] as const;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ranh giới từ cho chữ có dấu: không đứng liền chữ cái hay chữ số Unicode khác.
const KEYWORD = new RegExp(
  `(?<![\\p{L}\\p{N}_])(?:${PSEUDO_KEYWORDS.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}_])`,
  'u',
);
const RULES: { cls: string; re: RegExp }[] = [
  { cls: 'tok-comment', re: /\/\/.*/u },
  { cls: 'tok-string', re: /"[^"\n]*"|'[^'\n]*'/u },
  { cls: 'tok-keyword', re: KEYWORD },
  { cls: 'tok-number', re: /(?<![\p{L}_])\d+(?:\.\d+)?(?![\p{L}_])/u },
  { cls: 'tok-operator', re: /←|≤|≥|≠|==|!=|<=|>=|[+\-*/%<>=]/u },
  { cls: 'tok-punctuation', re: /[()[\],:]/u },
];

function tokenizeLine(line: string): Segment[] {
  const out: Segment[] = [];
  let rest = line;
  while (rest.length > 0) {
    let best: { index: number; length: number; cls: string } | null = null;
    for (const { cls, re } of RULES) {
      const match = re.exec(rest);
      if (match && (best === null || match.index < best.index)) {
        best = { index: match.index, length: match[0].length, cls };
      }
    }
    if (!best || best.length === 0) {
      out.push({ text: rest, classes: [] });
      break;
    }
    if (best.index > 0) out.push({ text: rest.slice(0, best.index), classes: [] });
    out.push({ text: rest.slice(best.index, best.index + best.length), classes: [best.cls] });
    rest = rest.slice(best.index + best.length);
  }
  return out;
}

export function tokenizePseudocode(code: string): Line[] {
  return normalizeCode(code).split('\n').map(tokenizeLine);
}
