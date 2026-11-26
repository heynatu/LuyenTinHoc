// Quét vi phạm design system (mục 3.11 của docs/SUPER_PROMPT.md).
// Bỏ qua một dòng có chủ đích: thêm chú thích `design-lint-ignore: <lý do>` trên chính dòng đó.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const SCAN_DIRS = ['src'];
const EXTENSIONS = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.css', '.mdx', '.md']);
const SKIP_FILES = new Set(['src/styles/tokens.css', 'src/styles/theme.css']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro']);

/** Tệp được phép định nghĩa giá trị gốc (text style, gradient chữ hero). */
const DEFINITION_FILES = new Set(['src/styles/global.css']);
/** Trang hiển thị design system được phép đọc màu lõi. */
const CORE_ALLOWED = (/** @type {string} */ f) =>
  f.startsWith('src/pages/thiet-ke') || f.startsWith('src/components/design-system/');

/**
 * @typedef {{ id: string, message: string, test: (line: string, file: string) => boolean }} Rule
 * @type {Rule[]}
 */
const RULES = [
  {
    id: 'arbitrary-value',
    message: 'Giá trị trong ngoặc vuông của Tailwind. Dùng token (spacing, radius, container…).',
    test: (line) => /(?<![\w$.])-?[a-z][a-z0-9-]*-\[[^\]\s'"`]+\]/.test(line),
  },
  {
    id: 'hex-color',
    message: 'Mã màu hex ngoài tokens.css. Dùng token Color System.',
    test: (line) =>
      /(?<![&\w/=])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/.test(
        line.replace(/href=["'][^"']*["']/g, '').replace(/id=["'][^"']*["']/g, ''),
      ),
  },
  {
    id: 'core-color',
    message: 'Component dùng màu lõi (--core-*). Chỉ dùng token Color System.',
    test: (line, file) => !CORE_ALLOWED(file) && /--core-/.test(line),
  },
  {
    id: 'italic',
    message: 'Không dùng chữ nghiêng.',
    test: (line) => /(?<![\w-])italic(?![\w-])|font-style:\s*(italic|oblique)/.test(line),
  },
  {
    id: 'ultra-bold',
    message: 'Không dùng độ đậm trên Bold.',
    test: (line) => /font-(extrabold|black)\b|font-weight:\s*(800|900)\b/.test(line),
  },
  {
    id: 'loose-type',
    message: 'Cỡ chữ hoặc độ đậm rời. Dùng text style có tên (heading-1, body-4, caption-2…).',
    test: (line, file) =>
      /(?<![\w-])text-(xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/.test(line) ||
      /(?<![\w-])font-(thin|extralight|light|normal|medium|semibold|bold)(?![\w-])/.test(line) ||
      (!DEFINITION_FILES.has(file) && /font-size:\s*[\d.]/.test(line)),
  },
  {
    id: 'material-icons',
    message: 'Không dùng Material Icons/Symbols. Dùng Phosphor.',
    test: (line) => /material-icons|material-symbols|@mui\/icons|react-icons\/md/i.test(line),
  },
  {
    id: 'default-easing',
    message: 'Đường cong mặc định. Dùng ease-base: cubic-bezier(0.22, 1, 0.36, 1).',
    test: (line) =>
      /(?<![\w-])ease-(in|out|in-out|linear)(?![\w-])/.test(line) ||
      /(transition|animation)(-timing-function)?:[^;]*\b(ease|linear|ease-in|ease-out|ease-in-out)\b(?!-)/.test(
        line,
      ),
  },
  {
    id: 'background-gradient',
    message: 'Không dùng gradient nền. Gradient chỉ dùng cho chữ hero qua lớp text-hero-gradient.',
    test: (line, file) =>
      /(?<![\w-])bg-(gradient|linear|radial|conic)-/.test(line) ||
      (!DEFINITION_FILES.has(file) && /(linear|radial|conic)-gradient\(/.test(line)),
  },
  {
    id: 'single-side-border',
    message: 'Viền một cạnh. Viền bao 4 cạnh hoặc dùng khối phân cách cao 1px tô token border-*.',
    test: (line) =>
      /(?<![\w-])border-[tblrxyse](-\d+)?(?![\w-])/.test(line) ||
      /border-(top|bottom|left|right|inline|block)(-start|-end)?(-width|-style|-color)?:/.test(
        line,
      ),
  },
  {
    id: 'unsafe-html',
    message: 'Chèn HTML thô. Dùng textContent hoặc nội dung từ repo đã kiểm soát.',
    test: (line) =>
      /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML|dangerouslySetInnerHTML|set:html/.test(
        line,
      ),
  },
  {
    id: 'alert',
    message: 'Không dùng window.alert. Hiện lỗi ngay trong giao diện.',
    test: (line) => /(?<![\w.])(window\.)?alert\s*\(/.test(line),
  },
  {
    id: 'dead-link',
    message: 'Link chết href="#". Gắn đích thật hoặc dùng nút disabled có chú thích.',
    test: (line) => /href=["']#["']/.test(line),
  },
  {
    id: 'raw-spacing',
    message:
      'Khoảng cách hoặc bo góc bằng số trong CSS. Dùng var(--spacing-*) hoặc var(--radius-*).',
    test: (line, file) =>
      !DEFINITION_FILES.has(file) &&
      (/(?<![\w-])(margin|padding|gap|row-gap|column-gap)(-[a-z-]+)?:\s*[^;]*?(?<![\w.-])(?!0(px|rem)?\b)\d*\.?\d+(px|rem|em)\b/.test(
        line,
      ) ||
        /border(-[a-z-]+)?-radius:\s*[^;]*?\d+(px|rem|em|%)/.test(line)),
  },
];

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTENSIONS.has(extname(name))) out.push(full);
  }
  return out;
}

const violations = [];
let fileCount = 0;
for (const dir of SCAN_DIRS) {
  for (const full of walk(join(ROOT, dir))) {
    const file = relative(ROOT, full).split(sep).join('/');
    if (SKIP_FILES.has(file)) continue;
    fileCount += 1;
    const lines = readFileSync(full, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes('design-lint-ignore')) return;
      for (const rule of RULES) {
        if (rule.test(line, file)) {
          violations.push(
            `${file}:${index + 1}  [${rule.id}] ${rule.message}\n    ${line.trim().slice(0, 160)}`,
          );
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.log(violations.join('\n'));
  console.log(`\n${violations.length} vi phạm design system trong ${fileCount} tệp.`);
  process.exit(1);
}
console.log(`Không có vi phạm design system (${fileCount} tệp).`);
