// Tiện ích màu dùng chung cho build-tokens và check-contrast.
// sRGB <-> OKLCH theo công thức của Björn Ottosson, tương phản theo WCAG 2.2.

/** @param {string} hex */
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)) throw new Error(`Mã màu không hợp lệ: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

/** @param {number[]} rgb */
export function rgbToHex(rgb) {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

const toLinear = (/** @type {number} */ c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (/** @type {number} */ c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

/** Độ chói tương đối theo WCAG. @param {string} hex */
export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Tỉ lệ tương phản WCAG giữa hai màu đục. */
export function contrastRatio(/** @type {string} */ a, /** @type {string} */ b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** @param {number[]} rgb tuyến tính */
function linearRgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** @param {number[]} lab */
function oklabToLinearRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** @param {string} hex @returns {[number, number, number]} [L, C, H] */
export function hexToOklch(hex) {
  const [L, a, b] = linearRgbToOklab(hexToRgb(hex).map(toLinear));
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, Math.hypot(a, b), H];
}

/** Đổi OKLCH sang hex, giảm dần độ đậm màu cho tới khi nằm trong gam sRGB. */
export function oklchToHex(/** @type {[number, number, number]} */ [L, C, H]) {
  const rad = (H * Math.PI) / 180;
  let c = C;
  for (let i = 0; i < 80; i += 1) {
    const rgb = oklabToLinearRgb([L, c * Math.cos(rad), c * Math.sin(rad)]);
    if (rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4)) {
      return rgbToHex(rgb.map((v) => toGamma(Math.min(1, Math.max(0, v)))));
    }
    c *= 0.94;
  }
  return rgbToHex(oklabToLinearRgb([L, 0, 0]).map((v) => toGamma(Math.min(1, Math.max(0, v)))));
}

/** Độ bão hòa HSL (0..1), để kiểm tra quy tắc màu nhấn < 80%. */
export function hslSaturation(/** @type {string} */ hex) {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return 0;
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}
