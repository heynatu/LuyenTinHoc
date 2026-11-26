/** Chuẩn hóa tiếng Việt để tìm không dấu: bỏ dấu, đ thành d, chữ thường, gộp khoảng trắng. */
export function foldVi(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Mọi từ của câu truy vấn đều phải xuất hiện (không dấu) trong văn bản. */
export function matchesQuery(haystack: string, query: string): boolean {
  const words = foldVi(query).split(' ').filter(Boolean);
  if (words.length === 0) return true;
  const text = foldVi(haystack);
  return words.every((w) => text.includes(w));
}
