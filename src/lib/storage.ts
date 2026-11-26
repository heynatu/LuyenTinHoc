import { SITE } from '../site.config';

/**
 * Đọc ghi localStorage an toàn: mọi lỗi (chế độ ẩn danh, trình duyệt trường học chặn lưu trữ)
 * đều bị nuốt để trang vẫn chạy đúng khi không lưu được.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(SITE.storagePrefix + key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(SITE.storagePrefix + key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(SITE.storagePrefix + key);
  } catch {
    // Không lưu được thì cũng không có gì để xóa.
  }
}
