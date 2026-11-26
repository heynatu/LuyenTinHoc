/** Mã hóa code vào phần #hash của đường dẫn để chia sẻ (không gửi lên máy chủ nào). */

export const SHARE_LIMIT = 8000;

export function encodeShare(code: string): string {
  const bytes = new TextEncoder().encode(code);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(value: string): string | null {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return text.length <= SHARE_LIMIT ? text : null;
  } catch {
    return null;
  }
}
