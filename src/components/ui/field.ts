import type { FieldState } from './recipes';

/** aria-describedby cho ô nhập theo gợi ý và lỗi đang hiển thị (khớp id trong FieldShell). */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

/**
 * Trạng thái nhìn thấy: ép theo `state` (trưng bày), hoặc `interactive` khi chạy thật.
 * Lỗi khi chạy thật hiện qua biến thể error: (aria-invalid), không cần trạng thái riêng.
 */
export function resolveFieldState(state: FieldState | undefined, disabled?: boolean): FieldState {
  if (state) return state;
  return disabled ? 'disabled' : 'interactive';
}
