import { afterEach, describe, expect, it, vi } from 'vitest';
import { readStorage, removeStorage, writeStorage } from '../../src/lib/storage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage an toàn', () => {
  it('không ném lỗi khi trình duyệt chặn localStorage', () => {
    const blocked = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    vi.stubGlobal('window', { localStorage: blocked });
    expect(readStorage('theme')).toBeNull();
    expect(writeStorage('theme', 'dark')).toBe(false);
    expect(() => removeStorage('theme')).not.toThrow();
  });

  it('thêm tiền tố phiên bản vào khóa', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
      },
    });
    expect(writeStorage('level', 'thcs')).toBe(true);
    expect(store.get('tdt:v1:level')).toBe('thcs');
    expect(readStorage('level')).toBe('thcs');
  });
});
