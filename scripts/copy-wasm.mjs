// Chép Pyodide và sql.js từ node_modules vào public/ dưới đường dẫn có phiên bản,
// để tự host (CSP chỉ cần 'self') và cache immutable an toàn. Chạy trước dev và build.
// Gói nào chưa cài (ví dụ trước Giai đoạn 4 và 9) thì bỏ qua.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const TARGETS = [
  {
    pkg: 'pyodide',
    dest: 'public/pyodide',
    files: [
      'pyodide.asm.mjs',
      'pyodide.asm.wasm',
      'pyodide.mjs',
      'python_stdlib.zip',
      'pyodide-lock.json',
    ],
  },
  {
    pkg: 'sql.js',
    dest: 'public/sqljs',
    files: ['dist/sql-wasm-browser.wasm'],
  },
];

/** @type {Record<string, string>} */
const versions = {};
for (const { pkg, dest, files } of TARGETS) {
  const pkgDir = join(ROOT, 'node_modules', pkg);
  const manifest = join(pkgDir, 'package.json');
  if (!existsSync(manifest)) {
    console.log(`copy-wasm: chưa cài ${pkg}, bỏ qua.`);
    continue;
  }
  const { version } = JSON.parse(readFileSync(manifest, 'utf8'));
  const outDir = join(ROOT, dest, `v${version}`);
  rmSync(join(ROOT, dest), { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const file of files) {
    const src = join(pkgDir, file);
    if (!existsSync(src)) throw new Error(`copy-wasm: không thấy ${pkg}/${file}`);
    cpSync(src, join(outDir, file.split('/').pop() ?? file));
  }
  versions[pkg] = version;
  console.log(`copy-wasm: ${pkg} ${version} -> ${dest}/v${version}/`);
}

mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
writeFileSync(
  join(ROOT, 'src/generated/wasm-versions.json'),
  JSON.stringify(versions, null, 2) + '\n',
);
