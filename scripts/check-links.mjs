// Kiểm tra link chết trong bản build (dist/): mọi href, src nội bộ phải trỏ tới file có thật,
// mọi neo #id phải tồn tại trên trang đích. Chạy sau `astro build`. Thoát mã 1 nếu có lỗi.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const DIST = join(ROOT, 'dist');
if (!existsSync(DIST)) {
  console.error('check-links: chưa có dist/. Chạy npm run build trước.');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = new Map();
for (const file of walk(DIST)) {
  const rel = '/' + relative(DIST, file).split(sep).join('/');
  const route = rel === '/index.html' ? '/' : rel.replace(/\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(route, { file: rel, html, ids });
}

function targetExists(pathname) {
  if (pages.has(pathname)) return true;
  const file = join(DIST, decodeURIComponent(pathname));
  return existsSync(file) && statSync(file).isFile();
}

const broken = [];
let checked = 0;
let external = 0;
for (const [route, { file, html, ids }] of pages) {
  for (const match of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const url = match[2].replace(/&amp;/g, '&');
    if (!url || url.startsWith('mailto:') || url.startsWith('data:') || url.startsWith('blob:'))
      continue;
    if (/^https?:\/\//.test(url) || url.startsWith('//')) {
      external += 1;
      continue;
    }
    checked += 1;
    const [pathPart, hash] = url.split('#');
    const pathname = (pathPart ?? '').split('?')[0] ?? '';
    if (pathname === '') {
      if (hash && !ids.has(decodeURIComponent(hash)))
        broken.push(`${file}: neo #${hash} không tồn tại`);
      continue;
    }
    if (!pathname.startsWith('/')) {
      broken.push(`${file}: link tương đối "${url}" (dùng đường dẫn tuyệt đối bắt đầu bằng /)`);
      continue;
    }
    if (!targetExists(pathname)) {
      broken.push(`${file}: ${url} không tồn tại`);
      continue;
    }
    if (hash && pages.has(pathname) && !pages.get(pathname).ids.has(decodeURIComponent(hash))) {
      broken.push(`${file}: ${url} trỏ tới neo không tồn tại`);
    }
  }
  void route;
}

if (broken.length > 0) {
  console.log([...new Set(broken)].join('\n'));
  console.log(
    `\ncheck-links: ${broken.length} link hỏng (${checked} link nội bộ, ${pages.size} trang).`,
  );
  process.exit(1);
}
console.log(
  `check-links: ${checked} link nội bộ trên ${pages.size} trang đều hợp lệ (${external} link ngoài không kiểm).`,
);
