// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypeCodeFrame, remarkCallouts } from './src/lib/markdown/plugins.ts';

// TEN_MIEN (Phần 0). Đổi khi gắn tên miền riêng.
const SITE_URL = 'https://tu-duy-tin.vercel.app';

/** Trang không đưa vào sitemap (đồng thời có noindex trong trang). */
const NOINDEX_PATHS = ['/thiet-ke', '/tien-do', '/thi-thu/'];

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // Đồng bộ với vercel.json: cleanUrls = true, trailingSlash = false
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname.startsWith(path)),
    }),
  ],
  // Dùng bộ xử lý Markdown thuần JavaScript (unified) thay cho Sätteri mặc định của Astro 7:
  // Sätteri cần file native mà một số máy Windows có App Control chặn, làm build lỗi.
  markdown: {
    // smartypants tắt để không tự đổi dấu nháy, dấu gạch trong nội dung tiếng Việt và code.
    // Callout ([!MEO], [!BAY]…) và khung code tự dựng (số dòng, tô màu Prism lúc build, sao chép).
    processor: unified({
      smartypants: false,
      // Plugin tự viết dùng kiểu cây tối giản (src/lib/markdown/hast.ts), không phải kiểu của unified.
      remarkPlugins: [/** @type {any} */ (remarkCallouts)],
      rehypePlugins: [/** @type {any} */ (rehypeCodeFrame)],
    }),
    // Tắt tô màu mặc định: rehypeCodeFrame tự tô bằng Prism để khung code giống component.
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
    // Không nhúng tài nguyên thành data: URI (CSP chỉ cho font và ảnh từ 'self').
    build: { assetsInlineLimit: 0 },
  },
  security: {
    // CSP bằng hash cho script và thẻ <style>. Xem SECURITY.md.
    csp: {
      algorithm: 'SHA-256',
      // 'wasm-unsafe-eval': cho phép biên dịch WebAssembly (Pyodide, sql.js), không cho phép eval.
      scriptDirective: {
        resources: ["'self'", "'wasm-unsafe-eval'"],
      },
      // Thẻ <style> và file CSS: chỉ 'self' + hash. Thuộc tính style="" (biến CSS cho hiệu ứng,
      // kích thước động của mô phỏng): cho phép, vì không thể chạy script qua thuộc tính style.
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  devToolbar: { enabled: false },
});
