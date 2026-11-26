import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToOklch, hslSaturation, oklchToHex } from '../../scripts/lib/color.mjs';
import { buildCore, readJson, resolveSystem } from '../../scripts/lib/tokens.mjs';

const brand = readJson('src/design/brand.json');
const system = readJson('src/design/color-system.json');
const core = buildCore(brand);

describe('tiện ích màu', () => {
  it('tính đúng tương phản WCAG ở hai đầu thang', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it('đổi qua lại OKLCH không lệch màu', () => {
    for (const hex of ['#3B5BDB', '#179E8C', '#E09F4A', '#D94841']) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    }
  });
});

describe('Core Colors', () => {
  it('mỗi palette có ít nhất 10 shade và shade 500 đúng màu gốc', () => {
    for (const [name, palette] of Object.entries(brand.palettes) as [string, { base: string }][]) {
      expect(Object.keys(core[name] ?? {}).length).toBeGreaterThanOrEqual(10);
      expect(core[name]?.['500']).toBe(palette.base.toUpperCase());
    }
    expect(Object.keys(core.grayscale ?? {}).length).toBeGreaterThanOrEqual(10);
  });

  it('giữ đúng các nền tối bắt buộc', () => {
    expect(core.grayscale).toMatchObject({
      '1000': '#000000',
      '870': '#181818',
      '850': '#1F1F1F',
      '800': '#272727',
      '750': '#313131',
    });
  });

  it('màu nhấn có độ bão hòa dưới 80%', () => {
    expect(hslSaturation(core.accent?.['500'] ?? '')).toBeLessThan(0.8);
  });

  it('các shade sáng dần về 00 và tối dần về 1000', () => {
    for (const name of Object.keys(brand.palettes)) {
      const shades = brand.palettes[name].shades as string[];
      const ordered = [...shades].sort((a, b) => Number(a) - Number(b));
      const lightness = ordered.map((s) => hexToOklch(core[name]?.[s] ?? '#000000')[0]);
      for (let i = 1; i < lightness.length; i += 1) {
        expect(lightness[i]).toBeLessThan(lightness[i - 1] ?? 1);
      }
    }
  });
});

describe('Color System', () => {
  it('mọi token đều trỏ tới một màu lõi có thật ở cả hai mode', () => {
    const resolved = resolveSystem(core, system);
    expect(resolved.length).toBeGreaterThan(90);
    for (const token of resolved) {
      expect(token.darkHex).toMatch(/^#[0-9A-F]{6,8}$/);
      expect(token.lightHex).toMatch(/^#[0-9A-F]{6,8}$/);
    }
  });

  it('chỉ dùng các nhóm token cho phép', () => {
    expect(Object.keys(system.tokens).sort()).toEqual(
      ['action', 'border', 'icon', 'overlay', 'surface', 'text'].sort(),
    );
  });
});
