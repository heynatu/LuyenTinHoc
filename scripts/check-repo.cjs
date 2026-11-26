// Kiểm tra repo có đủ file trước khi build (chạy đầu tiên trong prebuild, cả trên Vercel).
// Lỗi hay gặp: tải dự án lên GitHub bằng kéo thả trên web làm sót thư mục hoặc file.
// File .cjs, chỉ dùng thư viện có sẵn của Node, để chạy được kể cả khi repo thiếu nhiều thứ.
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const ROOT = join(__dirname, '..');
const REQUIRED = [
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'vercel.json',
  'tsconfig.json',
  'scripts/ensure-native.mjs',
  'scripts/build-tokens.mjs',
  'scripts/copy-wasm.mjs',
  'scripts/lib/tokens.mjs',
  'scripts/lib/color.mjs',
  'src/content.config.ts',
  'src/site.config.ts',
  'src/design/brand.json',
  'src/design/color-system.json',
  'src/layouts/BaseLayout.astro',
  'src/pages/index.astro',
  'src/content/lessons',
  'src/content/problems',
  'src/content/handbook',
  'public/theme-init.js',
  'public/judge',
];

const missing = REQUIRED.filter((f) => !existsSync(join(ROOT, f)));
if (missing.length > 0) {
  console.error('\nRepo thiếu file hoặc thư mục cần cho build:');
  for (const f of missing) console.error(`  - ${f}`);
  console.error(
    '\nThường do tải dự án lên GitHub bằng cách kéo thả trên trang web (mỗi lần tối đa 100 file,' +
      '\ndễ sót thư mục con). Hãy đẩy lên bằng git theo hướng dẫn "Đưa lên GitHub" trong README.md.\n',
  );
  process.exit(1);
}
console.log(`check-repo: đủ ${REQUIRED.length} file và thư mục cần cho build.`);
