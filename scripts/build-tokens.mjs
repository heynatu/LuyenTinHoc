// Sinh src/styles/tokens.css (Core Colors), src/styles/theme.css (Color System Light/Dark)
// và src/design/tokens.generated.json (cho trang /thiet-ke). Chạy: npm run tokens
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCore, coreVar, readJson, resolveSystem, ROOT } from './lib/tokens.mjs';

const HEADER =
  '/* Sinh tự động bởi scripts/build-tokens.mjs. Không sửa tay: sửa src/design/*.json rồi chạy npm run tokens. */\n';

const brand = readJson('src/design/brand.json');
const system = readJson('src/design/color-system.json');
const core = buildCore(brand);
const resolved = resolveSystem(core, system);

// tokens.css
let tokensCss = `${HEADER}:root {\n`;
for (const [palette, shades] of Object.entries(core)) {
  for (const [shade, hex] of Object.entries(shades))
    tokensCss += `  --core-${palette}-${shade}: ${hex};\n`;
}
tokensCss += '}\n';

// theme.css
const block = (/** @type {'dark' | 'light'} */ mode, indent = '  ') =>
  resolved.map((t) => `${indent}--${t.name}: var(${coreVar(t[mode])});`).join('\n');

let themeCss = HEADER;
// Reset bảng màu mặc định của Tailwind ngay tại đây (sau mọi @theme khác) để chỉ còn token ngữ nghĩa.
themeCss += '@theme inline {\n  --color-*: initial;\n';
themeCss += resolved.map((t) => `  --color-${t.name}: var(--${t.name});`).join('\n');
themeCss += '\n}\n\n';
themeCss += `:root,\n[data-theme='light'] {\n  color-scheme: light;\n${block('light')}\n}\n\n`;
themeCss += `[data-theme='dark'] {\n  color-scheme: dark;\n${block('dark')}\n}\n\n`;
themeCss += `/* Dự phòng khi JavaScript tắt: theo cài đặt hệ thống. */\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n    color-scheme: dark;\n${block('dark', '    ')}\n  }\n}\n`;

writeFileSync(join(ROOT, 'src/styles/tokens.css'), tokensCss);
writeFileSync(join(ROOT, 'src/styles/theme.css'), themeCss);
writeFileSync(
  join(ROOT, 'src/design/tokens.generated.json'),
  JSON.stringify({ core, system: resolved, extensions: system.extensions }, null, 2) + '\n',
);

const count = Object.values(core).reduce((n, s) => n + Object.keys(s).length, 0);
console.log(`Đã sinh ${count} màu lõi và ${resolved.length} token ngữ nghĩa.`);
