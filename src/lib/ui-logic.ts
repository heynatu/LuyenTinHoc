/** Logic thuần của component giao diện (dùng chung cho Astro, React và unit test). */

export type PageItem = number | 'gap';

/**
 * Dãy trang hiển thị cho Pagination: luôn có trang đầu, trang cuối, trang hiện tại và
 * `siblings` trang hai bên; chỗ bị lược bỏ thành 'gap'. Không bao giờ có 'gap' thay cho đúng một trang.
 */
export function paginationRange(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 0) return [];
  const page = Math.min(Math.max(1, current), total);
  const start = Math.max(2, page - siblings);
  const end = Math.min(total - 1, page + siblings);
  const items: PageItem[] = [1];
  if (start > 3) items.push('gap');
  else for (let p = 2; p < start; p += 1) items.push(p);
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < total - 2) items.push('gap');
  else for (let p = end + 1; p < total; p += 1) items.push(p);
  if (total > 1) items.push(total);
  return items;
}

/** Vị trí tab tiếp theo theo phím (mẫu ARIA Tabs, vòng tròn ở hai đầu). Phím khác trả null. */
export function nextTabIndex(current: number, key: string, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

/** Giới hạn phần trăm cho ProgressRing và tính độ dài nét vẽ. */
export function ringGeometry(value: number, size: number, stroke: number) {
  const pct = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return { pct, radius, circumference, offset: circumference * (1 - pct / 100) };
}

export const LEVELS = {
  1: 'Làm quen',
  2: 'Cơ bản',
  3: 'Vận dụng',
  4: 'Vận dụng cao',
  5: 'Chuyên sâu',
} as const;

export type Level = keyof typeof LEVELS;

export const SOURCE_LABELS = {
  official: 'Đề chính thức',
  adapted: 'Phỏng theo đề gốc',
  original: 'Đề luyện biên soạn',
} as const;

export type SourceKind = keyof typeof SOURCE_LABELS;
