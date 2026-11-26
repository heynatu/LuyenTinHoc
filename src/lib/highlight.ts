/**
 * Tô màu code lúc build bằng Prism, trả về từng dòng gồm các đoạn chữ kèm lớp CSS.
 * Không sinh chuỗi HTML (không chèn HTML thô): component tự dựng <span> và Astro tự escape.
 * Chỉ chạy phía máy chủ khi build; Prism không được gửi xuống trình duyệt.
 */
import Prism from 'prismjs';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-sql.js';

export type CodeLang = 'python' | 'sql' | 'text';

export type Segment = { text: string; classes: string[] };
export type Line = Segment[];

/** Chuẩn hóa xuống dòng và bỏ một dòng trống ở cuối (thường có khi viết code trong template). */
export function normalizeCode(code: string): string {
  return code.replace(/\r\n?/g, '\n').replace(/\n$/, '');
}

function tokenClasses(token: Prism.Token): string[] {
  const aliases = Array.isArray(token.alias) ? token.alias : token.alias ? [token.alias] : [];
  return [token.type, ...aliases].map((name) => `tok-${name}`);
}

function flatten(stream: Prism.TokenStream, inherited: string[], out: Segment[]): void {
  if (typeof stream === 'string') {
    out.push({ text: stream, classes: inherited });
    return;
  }
  if (Array.isArray(stream)) {
    for (const part of stream) flatten(part, inherited, out);
    return;
  }
  flatten(stream.content, [...inherited, ...tokenClasses(stream)], out);
}

/** Tách các đoạn theo ký tự xuống dòng để mỗi dòng tự đứng được (đánh số, tô sáng dòng). */
export function splitLines(segments: Segment[]): Line[] {
  const lines: Line[] = [[]];
  for (const segment of segments) {
    const parts = segment.text.split('\n');
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part.length > 0) lines[lines.length - 1]?.push({ text: part, classes: segment.classes });
    });
  }
  return lines;
}

export function highlightLines(code: string, lang: CodeLang): Line[] {
  const source = normalizeCode(code);
  const grammar = lang === 'text' ? undefined : Prism.languages[lang];
  if (!grammar) return splitLines([{ text: source, classes: [] }]);
  const segments: Segment[] = [];
  flatten(Prism.tokenize(source, grammar), [], segments);
  return splitLines(segments);
}
