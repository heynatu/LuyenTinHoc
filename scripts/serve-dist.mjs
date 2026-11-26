// Server tĩnh mô phỏng Vercel cho dist/: áp đúng header trong vercel.json (CSP, bảo mật, cache),
// cleanUrls, trailingSlash: false, trang 404 tùy biến. Dùng cho test e2e để kiểm tra trang chạy
// được dưới CSP thật, kể cả trong Web Worker (CSP của worker lấy từ header của chính file worker).
// Dùng: node scripts/serve-dist.mjs [cổng]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const PORT = Number(process.argv[2] ?? 4321);
const DIST = resolve(ROOT, 'dist');
const config = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.zip': 'application/zip',
  '.sql': 'text/plain; charset=utf-8',
};

// "/(.*)" kiểu Vercel → biểu thức chính quy.
const rules = (config.headers ?? []).map((rule) => ({
  re: new RegExp(`^${rule.source.replace(/\//g, '\\/')}$`),
  headers: rule.headers,
}));

function headersFor(pathname) {
  const out = {};
  for (const rule of rules) {
    if (rule.re.test(pathname)) for (const { key, value } of rule.headers) out[key] = value;
  }
  return out;
}

function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
  const base = resolve(DIST, clean);
  if (base !== DIST && !base.startsWith(DIST + sep)) return null; // chặn ../
  const candidates = pathname === '/' ? [join(DIST, 'index.html')] : [base, `${base}.html`];
  return candidates.find((file) => existsSync(file) && statSync(file).isFile()) ?? null;
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const { pathname } = url;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(308, { Location: pathname.slice(0, -1) + url.search });
    res.end();
    return;
  }
  if (pathname.endsWith('.html') && pathname !== '/404.html') {
    res.writeHead(308, { Location: pathname.slice(0, -5) || '/' });
    res.end();
    return;
  }
  const file = resolveFile(pathname);
  const status = file ? 200 : 404;
  const target = file ?? join(DIST, '404.html');
  res.writeHead(status, {
    'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream',
    ...headersFor(pathname),
  });
  createReadStream(target).pipe(res);
});

server.listen(PORT, () =>
  console.log(`serve-dist: http://localhost:${PORT} (header theo vercel.json)`),
);
