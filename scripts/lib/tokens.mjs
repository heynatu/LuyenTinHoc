// Sinh Core Colors từ brand.json và phân giải Color System từ color-system.json.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { hexToOklch, oklchToHex } from './color.mjs';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export function readJson(/** @type {string} */ relPath) {
  return JSON.parse(readFileSync(new URL(`../../${relPath}`, import.meta.url), 'utf8'));
}

// Vị trí tương đối của từng shade giữa màu gốc (500) và hai đầu sáng nhất, tối nhất.
const LIGHT_T = {
  '00': 1,
  50: 0.93,
  100: 0.83,
  150: 0.73,
  200: 0.63,
  300: 0.46,
  350: 0.37,
  400: 0.27,
  450: 0.14,
};
const DARK_T = { 600: 0.16, 700: 0.33, 800: 0.5, 850: 0.6, 900: 0.7, 950: 0.82, 1000: 0.92 };
// Hệ số độ đậm màu (chroma) theo shade: nhạt ở hai đầu, đậm nhất ở 500.
const CHROMA_F = {
  '00': 0.06,
  50: 0.12,
  100: 0.25,
  150: 0.35,
  200: 0.48,
  300: 0.68,
  350: 0.78,
  400: 0.88,
  450: 0.95,
  500: 1,
  600: 0.96,
  700: 0.86,
  800: 0.72,
  850: 0.62,
  900: 0.52,
  950: 0.42,
  1000: 0.32,
};
const L_MAX = 0.985;
const L_MIN = 0.17;

/** @returns {Record<string, Record<string, string>>} palette -> shade -> hex */
export function buildCore(/** @type {any} */ brand) {
  /** @type {Record<string, Record<string, string>>} */
  const core = {};
  for (const [name, { base, shades }] of Object.entries(brand.palettes)) {
    const [Lb, Cb, Hb] = hexToOklch(base);
    core[name] = {};
    for (const shade of /** @type {string[]} */ (shades)) {
      if (shade === '500') {
        core[name][shade] = base.toUpperCase();
        continue;
      }
      const key = /** @type {keyof typeof CHROMA_F} */ (shade);
      let L;
      if (shade in LIGHT_T)
        L = Lb + (L_MAX - Lb) * LIGHT_T[/** @type {keyof typeof LIGHT_T} */ (shade)];
      else if (shade in DARK_T)
        L = Lb - (Lb - L_MIN) * DARK_T[/** @type {keyof typeof DARK_T} */ (shade)];
      else throw new Error(`Shade chưa có quy tắc: ${name}-${shade}`);
      core[name][shade] = oklchToHex([L, Cb * (CHROMA_F[key] ?? 1), Hb]);
    }
  }
  core.grayscale = { ...brand.grayscale };
  const alphaBase = brand.grayscale[brand.grayscaleAlpha.shade];
  core['grayscale-alpha'] = {};
  for (const level of brand.grayscaleAlpha.levels) {
    const alpha = Math.round((level / 100) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    core['grayscale-alpha'][`${brand.grayscaleAlpha.shade}-${level}`] = `${alphaBase}${alpha}`;
  }
  return core;
}

/** Tách tham chiếu "palette-shade" (palette có thể chứa dấu gạch). */
export function parseRef(/** @type {string} */ ref) {
  if (ref.startsWith('grayscale-alpha-'))
    return ['grayscale-alpha', ref.slice('grayscale-alpha-'.length)];
  const i = ref.lastIndexOf('-');
  return [ref.slice(0, i), ref.slice(i + 1)];
}

export function coreVar(/** @type {string} */ ref) {
  const [palette, shade] = parseRef(ref);
  return `--core-${palette}-${shade}`;
}

/**
 * @returns {{ name: string, group: string, dark: string, light: string, darkHex: string, lightHex: string }[]}
 */
export function resolveSystem(/** @type {any} */ core, /** @type {any} */ system) {
  const out = [];
  for (const [group, tokens] of Object.entries(system.tokens)) {
    for (const [token, pair] of Object.entries(
      /** @type {Record<string, [string, string]>} */ (tokens),
    )) {
      const [dark, light] = pair;
      const hex = (/** @type {string} */ ref) => {
        const [palette, shade] = parseRef(ref);
        const value = core[palette]?.[shade];
        if (!value)
          throw new Error(`Token ${group}/${token} trỏ tới màu lõi không tồn tại: ${ref}`);
        return value;
      };
      out.push({
        name: `${group}-${token}`,
        group,
        dark,
        light,
        darkHex: hex(dark),
        lightHex: hex(light),
      });
    }
  }
  return out;
}
