// Kiểm tra tương phản mọi cặp chữ/nền và thành phần giao diện dự kiến, ở cả hai mode.
// Chữ thường >= 4.5:1. Chữ lớn, icon, viền ô nhập, focus ring >= 3:1. Thoát mã 1 nếu có cặp không đạt.
import { contrastRatio, hslSaturation } from './lib/color.mjs';
import { buildCore, readJson, resolveSystem } from './lib/tokens.mjs';

const BODY = 4.5;
const UI = 3;

const core = buildCore(readJson('src/design/brand.json'));
const tokens = new Map(
  resolveSystem(core, readJson('src/design/color-system.json')).map((t) => [t.name, t]),
);

const READING_SURFACES = [
  'surface-primary',
  'surface-primary-subtle',
  'surface-primary-hover',
  'surface-secondary',
];

/** @type {[string, string, number, string][]} [chữ, nền, ngưỡng, ghi chú] */
const pairs = [];
for (const bg of READING_SURFACES) {
  for (const fg of [
    'text-primary',
    'text-secondary',
    'text-tertiary',
    'text-primary-subtle',
    'text-info',
    'text-error',
    'text-success',
    'text-warning',
  ]) {
    pairs.push([fg, bg, BODY, 'chữ trên nền đọc']);
  }
  for (const fg of [
    'icon-default',
    'icon-secondary',
    'icon-subtle',
    'icon-info',
    'icon-error',
    'icon-success',
    'icon-warning',
  ]) {
    pairs.push([fg, bg, UI, 'icon']);
  }
  for (const fg of ['border-action-primary', 'border-action-secondary', 'border-error']) {
    pairs.push([fg, bg, UI, 'focus ring, viền ô nhập']);
  }
  pairs.push(
    ['text-hero-start', bg, UI, 'chữ lớn hero'],
    ['text-hero-end', bg, UI, 'chữ lớn hero (đầu nhạt)'],
  );
}
pairs.push(['text-inverted', 'surface-inverted', BODY, 'chữ trên nền đảo']);
for (const bg of [
  'action-primary',
  'action-primary-hover',
  'action-primary-click',
  'action-error',
  'action-error-hover',
  'surface-error-darker',
]) {
  pairs.push(['text-on-action', bg, BODY, 'chữ trên nút đậm']);
}
for (const bg of ['action-secondary', 'action-secondary-hover', 'action-secondary-click']) {
  pairs.push(['text-primary', bg, BODY, 'chữ trên nút Secondary']);
}
for (const bg of [
  'action-warning',
  'action-warning-hover',
  'surface-accent',
  'surface-warning',
  'surface-accent-subtle',
]) {
  pairs.push(['text-on-warning', bg, BODY, 'chữ trên nền vàng, hổ phách']);
}
pairs.push(
  ['text-error-inverted', 'surface-error-subtle', BODY, 'Callout lỗi'],
  ['text-success-inverted', 'surface-success-subtle', BODY, 'Callout thành công'],
  ['text-info-inverted', 'surface-info-subtle', BODY, 'Callout thông tin'],
  ['text-warning-inverted', 'surface-warning-subtle', BODY, 'Callout cảnh báo'],
  ['text-inverted', 'surface-info', BODY, 'nhãn trên nền info'],
  ['icon-info-inverted', 'surface-info-subtle', UI, 'icon trên ô nền info nhạt'],
  ['surface-primary', 'action-primary', UI, 'núm công tắc khi bật'],
  ['icon-subtle', 'surface-secondary', UI, 'núm công tắc khi tắt'],
  ['text-on-action', 'action-primary', UI, 'dấu tích trong checkbox'],
  ['text-info', 'surface-primary-hover', BODY, 'số dòng đang tô sáng trong khối code'],
  ['text-inverted', 'surface-inverted', BODY, 'chữ trong tooltip'],
  ['text-on-warning', 'surface-success', BODY, 'số trong ô mô phỏng đã xong'],
  ['text-tertiary', 'surface-primary', BODY, 'số trong ô mô phỏng đã loại'],
);

let failures = 0;
const rows = [];
for (const mode of /** @type {const} */ (['light', 'dark'])) {
  for (const [fgName, bgName, min, note] of pairs) {
    const fg = tokens.get(fgName);
    const bg = tokens.get(bgName);
    if (!fg || !bg) {
      console.error(`Thiếu token: ${!fg ? fgName : bgName}`);
      failures += 1;
      continue;
    }
    const fgHex = mode === 'light' ? fg.lightHex : fg.darkHex;
    const bgHex = mode === 'light' ? bg.lightHex : bg.darkHex;
    const ratio = contrastRatio(fgHex, bgHex);
    const ok = ratio >= min;
    if (!ok) failures += 1;
    rows.push({ mode, ok, ratio, min, fgName, bgName, fgHex, bgHex, note });
  }
}

const accentSat = hslSaturation(core.accent['500']);
const accentOk = accentSat < 0.8;
if (!accentOk) failures += 1;

const bad = rows.filter((r) => !r.ok);
const pad = (/** @type {string} */ s, /** @type {number} */ n) => s.padEnd(n);
for (const r of bad) {
  console.log(
    `KHÔNG ĐẠT  ${pad(r.mode, 5)}  ${r.ratio.toFixed(2)} < ${r.min}  ${pad(r.fgName, 26)} ${r.fgHex}  trên  ${pad(r.bgName, 24)} ${r.bgHex}  (${r.note})`,
  );
}
console.log(
  `Màu nhấn accent-500 ${core.accent['500']}: độ bão hòa ${(accentSat * 100).toFixed(1)}% ${accentOk ? '(đạt, < 80%)' : '(KHÔNG ĐẠT, phải < 80%)'}`,
);
console.log(
  `Đã kiểm tra ${rows.length} cặp ở 2 mode: ${rows.length - bad.length} đạt, ${bad.length} không đạt.`,
);
process.exit(failures > 0 ? 1 : 0);
