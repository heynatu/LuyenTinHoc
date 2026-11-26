// Một số máy Windows bật App Control (Smart App Control, WDAC) chặn file native .node
// của các gói vừa phát hành (ví dụ trình biên dịch Astro, rolldown, satteri), làm dev và build lỗi
// "An Application Control policy has blocked this file".
//
// Script này KHÔNG đổi chính sách bảo mật của máy. Nó chỉ phát hiện file native bị chặn và cài
// bản WebAssembly dự phòng (gói *-wasm32-wasi) do chính tác giả các gói đó phát hành; trình nạp
// của gói tự chuyển sang bản WASM khi bản native không nạp được.
// Cài bằng --no-save nên package.json và package-lock.json không đổi; Vercel và CI (Linux) không bị ảnh hưởng.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

if (process.platform !== 'win32') process.exit(0);

const require = createRequire(import.meta.url);
const NODE_MODULES = join(ROOT, 'node_modules');
const SUFFIX = `${process.platform}-${process.arch}-msvc`;

/** Tìm thư mục gói native của nền tảng hiện tại (tối đa 4 cấp node_modules lồng nhau). */
function findBindingDirs(dir, depth = 0, out = []) {
  if (depth > 4 || !existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith('@')) {
      findBindingDirs(full, depth, out);
    } else if (name.endsWith(SUFFIX)) {
      out.push(full);
    } else {
      const nested = join(full, 'node_modules');
      if (existsSync(nested)) findBindingDirs(nested, depth + 1, out);
    }
  }
  return out;
}

/** Bản WASM cần có: tên gói -> phiên bản (trùng phiên bản bản native bị chặn). */
const needed = new Map();
for (const dir of findBindingDirs(NODE_MODULES)) {
  const nodeFile = readdirSync(dir).find((file) => file.endsWith('.node'));
  if (!nodeFile) continue;
  try {
    require(join(dir, nodeFile));
  } catch (error) {
    if (!String(error?.message).includes('Application Control')) continue;
    const { name, version } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    needed.set(name.replace(SUFFIX, 'wasm32-wasi'), version);
  }
}

const isInstalled = (/** @type {string} */ name, /** @type {string} */ version) => {
  const manifest = join(NODE_MODULES, ...name.split('/'), 'package.json');
  return existsSync(manifest) && JSON.parse(readFileSync(manifest, 'utf8')).version === version;
};

if ([...needed].every(([name, version]) => isInstalled(name, version))) process.exit(0);

// Cài cả nhóm trong một lệnh: mỗi lần `npm install --no-save` sẽ dọn các gói --no-save cài trước đó.
const specs = [...needed].map(([name, version]) => `${name}@${version}`);
console.log(
  'ensure-native: Windows App Control chặn file native của các gói sau, đang cài bản WebAssembly dự phòng:',
);
for (const spec of specs) console.log(`  ${spec}`);

// Tên gói và phiên bản đọc từ package.json trong node_modules, chỉ gồm ký tự an toàn.
if (!specs.every((spec) => /^[@a-z0-9/._-]+@[0-9a-z.+-]+$/i.test(spec))) {
  console.error('ensure-native: tên gói không hợp lệ, dừng lại.');
  process.exit(1);
}
const command = [
  'npm install --no-save --force --ignore-scripts --no-audit --no-fund',
  ...specs,
].join(' ');
const result = spawnSync(command, { cwd: ROOT, stdio: 'inherit', shell: true });
if (result.status !== 0) {
  console.error(
    'ensure-native: không cài được bản WebAssembly dự phòng. Kiểm tra kết nối mạng rồi chạy lại.',
  );
  process.exit(1);
}
console.log('ensure-native: xong. package.json và package-lock.json không thay đổi.');
