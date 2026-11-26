# SUPER PROMPT: Nền tảng học Tin học "Tư Duy Tin" (Tiểu học → THPT, CT GDPT 2018)

> **Cách dùng (dành cho bạn, không phải cho AI)**
>
> 1. Tạo một thư mục trống cho dự án, mở bằng Claude Code (nên bật plugin có 2 skill `figma-designer` và `landing-page-design`).
> 2. Chép file này vào `docs/SUPER_PROMPT.md` trong thư mục đó.
> 3. Điền **Phần 0** (tên web, email, màu…). Chỗ nào chưa có, cứ để mặc định.
> 4. Gõ cho AI: `Đọc docs/SUPER_PROMPT.md. Thực hiện Giai đoạn 1 rồi dừng lại báo cáo.`
> 5. Duyệt kết quả, rồi lần lượt: `Thực hiện Giai đoạn 2`, `Giai đoạn 3`… Mỗi giai đoạn là một lần giao việc, không gộp.
> 6. Muốn thêm đề: dùng prompt mẫu ở mục 5.6 và 5.7.
>
> Mọi thứ bên dưới đường kẻ là prompt gửi AI.

---

## PHẦN 0. THÔNG SỐ DỰ ÁN

| Khóa | Giá trị | Ghi chú |
|---|---|---|
| `TEN_WEB` | Tư Duy Tin | Tên hiển thị |
| `SLUG` | tu-duy-tin | Tên repo, tiền tố localStorage `tdt:` |
| `TEN_MIEN` | `{{tu-duy-tin.vercel.app}}` | Dùng cho canonical, sitemap, OG |
| `DON_VI` | `{{Tên trường hoặc nhóm giáo viên}}` | Hiện ở chân trang và trang Giới thiệu |
| `EMAIL_LIEN_HE` | `{{email liên hệ}}` | Chỉ dùng `mailto:`, không có form |
| `MAU_CHINH` (Primary 500) | `#3B5BDB` | Xanh chàm, chữ trắng đạt 5.6:1 |
| `MAU_PHU` (Secondary 500) | `#179E8C` | Xanh ngọc |
| `MAU_NHAN` (Accent 500) | `#E09F4A` | Hổ phách, độ bão hòa ~71% (< 80%) |
| `FONT_CHINH` | Manrope | Có bộ chữ tiếng Việt (đã kiểm tra). Poppins bị loại vì không có tiếng Việt |
| `FONT_CODE` | Geist Mono | Có tiếng Việt, chỉ dùng cho code, số liệu |
| `PYTHON_TOI_THIEU` | 3.8 | Lời giải mẫu phải chạy được trên máy chấm cũ |
| `XUNG_HO` | bạn | Thống nhất toàn site |
| `GIAY_PHEP_CODE` | MIT | Người sở hữu tự quyết |
| `GIAY_PHEP_NOI_DUNG` | `{{CC BY-NC-SA 4.0}}` | Người sở hữu tự quyết |

Giá trị dạng `{{...}}` là chỗ trống có đánh dấu. Không được tự bịa giá trị cho chúng. Hiển thị chúng nguyên dạng trong code cho tới khi được điền, và liệt kê chúng trong mỗi báo cáo.

---

## PHẦN 1. VAI TRÒ, MỤC TIÊU VÀ NGUYÊN TẮC BẤT BIẾN

> Ở Giai đoạn 1, chép Phần 1, Phần 3 (tóm lược) và mục 2.10 thành `CLAUDE.md` ở gốc repo để mọi phiên sau đều tuân thủ. Duy trì `docs/PROGRESS.md`: giai đoạn hiện tại, việc đã xong, việc còn lại, chỗ trống `{{...}}` chưa điền. Đầu mỗi phiên, đọc `CLAUDE.md` và `docs/PROGRESS.md` trước khi làm.

### 1.1 Vai trò

Bạn đồng thời là:
- Kỹ sư frontend cấp cao (Astro, React, TypeScript, WebAssembly) và kỹ sư bảo mật web.
- Nhà thiết kế sản phẩm, tuân thủ tuyệt đối design system ở Phần 3.
- Giáo viên bồi dưỡng học sinh giỏi Tin học nhiều năm, nắm vững Chương trình GDPT 2018 môn Tin học và cách ra đề, chấm đề bằng Themis.
- Biên tập viên nội dung giáo dục: tiếng Việt chuẩn, đúng thuật ngữ SGK, trình bày từ dễ đến khó.

### 1.2 Sản phẩm trong một câu

Một website tĩnh, miễn phí, không cần tài khoản, giúp học sinh Tiểu học, THCS, THPT **học tin học theo CT GDPT 2018, xem thuật toán chạy từng bước, chạy Python và SQL ngay trên trình duyệt, và luyện đề thi học sinh giỏi, Tin học trẻ với lời giải Python đã kiểm chứng, giả mã, phân tích bẫy**, triển khai trên Vercel từ GitHub.

### 1.3 Người dùng

| Nhóm | Nhu cầu chính | Hệ quả thiết kế |
|---|---|---|
| Học sinh Tiểu học (lớp 3 đến 5) | Làm quen tư duy tuần tự, lặp, rẽ nhánh | Câu đố trực quan, chữ to, ít chữ, vùng bấm ≥ 44px |
| Học sinh THCS (lớp 6 đến 9) | Thuật toán cơ bản, chuẩn bị HSG lớp 9, Tin học trẻ bảng B | Mô phỏng, Python mở rộng, đề có subtask |
| Học sinh THPT (lớp 10 đến 12) | Python, SQL, CTDL và giải thuật, HSG tỉnh | Kho đề sâu, thi thử có bấm giờ, cẩm nang |
| Giáo viên bồi dưỡng | Giao bài, in đề, tham khảo lời giải | Link chia sẻ, bản in sạch, tải bộ test dạng Themis |
| Phụ huynh | Hiểu con học gì, có an toàn không | Trang Giới thiệu, Chính sách bảo mật rõ ràng |

### 1.4 Mười nguyên tắc bất biến

1. **Không bịa dữ kiện.** Không bịa đề thi thật, năm thi, số liệu thống kê, lời chứng thực, lịch thi, thể lệ. Thiếu thì dùng chỗ trống `{{...}}` hoặc ghi rõ "cần xác minh".
2. **Lời giải phải được kiểm định tự động** (mục 5.2) trước khi hiển thị. Bài chưa kiểm định không được xuất bản.
3. **Website tĩnh 100%:** không backend, không API route, không cơ sở dữ liệu máy chủ, không tài khoản, không thu thập dữ liệu cá nhân, không cookie. Tiến độ học lưu trong localStorage của chính trình duyệt học sinh.
4. **Code học sinh chỉ chạy trong trình duyệt**, trong Web Worker, có giới hạn thời gian và có thể dừng cưỡng bức.
5. **Design system ở Phần 3 là luật.** Không giá trị màu, cỡ chữ, khoảng cách, bo góc tự chế. Có script kiểm tra tự động.
6. **Tiếng Việt chuẩn, có dấu**, thuật ngữ khớp SGK (thuật toán, sơ đồ khối, cấu trúc rẽ nhánh, mảng cộng dồn…). Lần đầu xuất hiện thuật ngữ tiếng Anh thì kèm nghĩa tiếng Việt.
7. **Làm từng giai đoạn, từng phần.** Sau mỗi phần: build, chạy test, chụp màn hình (Playwright hoặc trình duyệt) ở 1440px và 390px, sửa lỗi rồi mới làm tiếp.
8. **Không thêm thư viện khi chưa cần.** Mọi phụ thuộc ghim phiên bản chính xác, commit `package-lock.json`.
9. **Truy cập được (WCAG 2.2 AA):** dùng được bằng bàn phím, có focus ring, `lang="vi"`, không truyền tải trạng thái chỉ bằng màu.
10. **Báo cáo trung thực:** đã làm gì, bỏ qua gì và vì sao, cái gì chưa kiểm chứng. Test lỗi thì nói lỗi, kèm output.

---

## PHẦN 2. KIẾN TRÚC KỸ THUẬT

### 2.1 Công nghệ (đã chốt, không đổi nếu không có lý do kỹ thuật được nêu rõ)

| Hạng mục | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Astro** (bản ổn định mới nhất, `output: 'static'`) + **React** islands | Nội dung là chính, trang nội dung gần như không có JS, chạy nhanh trên máy yếu ở trường |
| Ngôn ngữ | TypeScript `strict` | Bắt lỗi sớm |
| CSS | **Tailwind CSS v4** (`@tailwindcss/vite`), token bằng CSS variables | Khớp thang Tailwind của design system |
| Nội dung | Astro Content Collections + MDX, schema **zod** | Nội dung sai schema thì build fail, không lọt lên web |
| Trình soạn code | **CodeMirror 6** (`@codemirror/lang-python`, `@codemirror/lang-sql`) | Nhẹ hơn Monaco, chạy tốt trên điện thoại |
| Chạy Python | **Pyodide** (gói npm `pyodide`, ghim phiên bản) trong Web Worker | Chạy CPython thật bằng WebAssembly, không cần máy chủ |
| Chạy SQL | **sql.js** (SQLite WebAssembly) | Phòng thực hành SQL lớp 11 |
| Tô màu cú pháp tĩnh | Shiki (có sẵn trong Astro), theme dạng CSS variables | Không tốn JS lúc chạy, bám token Light/Dark |
| Tìm kiếm | **MiniSearch**, chỉ mục JSON sinh lúc build, tải khi mở ô tìm | Bắt buộc **tìm không dấu**: "thuat toan" phải ra "thuật toán" |
| Icon | `@phosphor-icons/react` (một độ dày: Regular) | Theo design system |
| Font | `@fontsource-variable/manrope`, `@fontsource/geist-mono` (subset latin + vietnamese) | Tự host, không gọi Google lúc chạy |
| Kiểm thử | Vitest (logic), Playwright (e2e, chromium) | |
| Chất lượng code | ESLint + Prettier; Python: **ruff** (`target-version = "py38"`) + **vermin** | Lời giải tương thích Python 3.8 |
| CI | GitHub Actions | Chặn merge khi test hoặc kiểm định nội dung lỗi |
| Hosting | Vercel, framework preset Astro | Không cần biến môi trường |

Node: bản LTS hiện hành mà Vercel hỗ trợ, khai báo trong `.nvmrc` và `"engines"` của `package.json`.

### 2.2 Cấu trúc repo

```
tu-duy-tin/
├─ .github/
│  ├─ workflows/ci.yml
│  └─ dependabot.yml
├─ docs/
│  ├─ SUPER_PROMPT.md          # file này
│  ├─ PROGRESS.md              # nhật ký tiến độ
│  └─ SOURCES.md               # nguồn đã tra cứu (URL, ngày tra) cho thể lệ, cấu trúc đề
├─ public/
│  ├─ favicon.svg, og-default.png, robots.txt, theme-init.js
│  └─ judge/<problem-id>/tests.json     # sinh bởi script, có commit
├─ scripts/
│  ├─ copy-wasm.mjs            # chép pyodide, sql.js từ node_modules vào public/ (prebuild, predev)
│  ├─ lint-design.mjs          # quét vi phạm design system
│  ├─ check-contrast.mjs       # kiểm tra tương phản mọi cặp token chữ/nền ở cả 2 mode
│  ├─ build-search-index.mjs   # chỉ mục MiniSearch đã bỏ dấu
│  ├─ run-python.mjs           # tìm python3 / python / py -3 (chạy được trên Windows)
│  └─ content/verify_content.py, make_tests.py, stress.py, themis_zip.py
├─ source-materials/           # đề gốc PDF/DOCX người dùng cung cấp (mặc định .gitignore)
├─ src/
│  ├─ content.config.ts        # schema zod cho mọi collection
│  ├─ content/
│  │  ├─ lessons/<cap>/<lop>/<slug>.mdx
│  │  ├─ problems/<id>/{index.mdx, sol.py, brute.py, gen.py, sub1.py?, checker.py?, verify.json}
│  │  ├─ exams/<id>.yaml        # đề thi thử ghép từ problems
│  │  ├─ contests/<id>.mdx      # hồ sơ từng kỳ thi
│  │  ├─ traps/<slug>.mdx
│  │  ├─ handbook/<slug>.mdx
│  │  ├─ puzzles/<id>.json
│  │  ├─ algorithms/<slug>.mdx  # mô tả, giả mã, Python cho trang mô phỏng
│  │  └─ sql/<db>/{schema.sql, seed.sql, exercises.yaml}
│  ├─ components/{ui,layout,editor,runner,judge,visualizer,puzzles,sql,home}/
│  ├─ lib/
│  │  ├─ python/{worker.ts, client.ts, errors-vi.ts, tracer.py}
│  │  ├─ judge/{compare.ts, score.ts}
│  │  ├─ algorithms/<slug>.ts   # generator sinh các bước mô phỏng
│  │  ├─ progress.ts            # localStorage có try/catch, có version
│  │  └─ search.ts, vi-normalize.ts
│  ├─ styles/{tokens.css, theme.css, global.css}
│  ├─ layouts/BaseLayout.astro
│  └─ pages/ (xem 4.1)
├─ tests/{unit,e2e}/
├─ .gitignore  .gitattributes  .nvmrc  .editorconfig
├─ astro.config.mjs  tsconfig.json  package.json  package-lock.json
├─ ruff.toml  requirements-dev.txt
├─ vercel.json
├─ CLAUDE.md  README.md  CONTRIBUTING.md  SECURITY.md  LICENSE  CONTENT_LICENSE.md
```

### 2.3 Script trong `package.json`

```
predev / prebuild : node scripts/copy-wasm.mjs
dev               : astro dev
build             : astro build && node scripts/build-search-index.mjs
preview           : astro preview
lint              : eslint . && prettier --check .
typecheck         : astro check && tsc --noEmit
lint:design       : node scripts/lint-design.mjs
check:contrast    : node scripts/check-contrast.mjs
test              : vitest run
test:e2e          : playwright test
verify:content    : node scripts/run-python.mjs scripts/content/verify_content.py
check:all         : lint + typecheck + lint:design + check:contrast + test + build
```

**`npm run build` tuyệt đối không được cần Python.** Kiểm định Python chạy ở máy dev và CI; kết quả (`verify.json`, `public/judge/**`) được commit.

### 2.4 Cấu hình Vercel và định tuyến

- `astro.config.mjs`: `site: TEN_MIEN`, `output: 'static'`, `build.format: 'file'`, `trailingSlash: 'never'`.
- `vercel.json` (mẫu, chỉnh khi cần và ghi lý do vào `SECURITY.md`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'; upgrade-insecure-requests" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains" }
      ]
    },
    { "source": "/pyodide/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/sqljs/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/_astro/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

Lưu ý bắt buộc:
- **CSP và script nội tuyến:** Astro chèn script nội tuyến cho islands. Nếu bản Astro đang dùng hỗ trợ CSP bằng hash tự động thì bật và **bỏ** `'unsafe-inline'` khỏi `script-src`. Nếu chưa hỗ trợ, giữ `'unsafe-inline'` và bù bằng: không có nội dung do người dùng tạo được render thành HTML, không `set:html`/`dangerouslySetInnerHTML` với dữ liệu ngoài repo. Ghi rõ quyết định vào `SECURITY.md`.
- **Script khởi tạo theme** (chống nháy màu) đặt ở file `public/theme-init.js`, nạp bằng `<script src>` trong `<head>`, không viết nội tuyến.
- **Pyodide và sql.js tự host** dưới đường dẫn có phiên bản: `/pyodide/v<phiên bản>/`, `/sqljs/v<phiên bản>/` (vì cache `immutable` một năm, đổi phiên bản phải đổi đường dẫn). `public/pyodide/` và `public/sqljs/` sinh lúc build, nằm trong `.gitignore`.
- Sau khi deploy preview, mở console trên các trang có Python, SQL, mô phỏng: **không được có lỗi CSP**. Nếu Pyodide cần nới CSP, chỉ nới tối thiểu và ghi lý do.
- Không bật COEP, không dùng SharedArrayBuffer. Dừng chương trình treo bằng `worker.terminate()`.
- Kiểm tra trên bản preview: mở thẳng link sâu (ví dụ `/luyen-de/abc`), tải lại trang, không có vòng lặp chuyển hướng, `/khong-ton-tai` ra trang 404 tùy biến.

### 2.5 Bộ chạy Python (Pyodide trong Web Worker)

Giao thức tin nhắn giữa trang và worker:
- Gửi: `{ type: 'run', id, code, stdin, files: { [tên]: nội dung }, timeoutMs, trace?: boolean }`
- Nhận: `stdout` (từng đoạn), `stderr`, `done { files, timeMs }`, `error { kind, line, message, messageVi }`.

Yêu cầu:
1. **Nạp lười:** chỉ tải Pyodide khi người dùng vào trang có trình soạn code (nạp sẵn lúc rảnh) hoặc bấm Chạy. Trong lúc tải hiện skeleton đúng hình khung soạn thảo và dòng trạng thái "Đang tải Python, lần đầu khoảng `{{dung lượng thực đo}}`".
2. **Giới hạn thời gian:** mặc định 3 giây ở phòng lập trình. Quá hạn thì `terminate()` worker, tạo worker mới, báo: "Chương trình chạy quá 3 giây nên đã được dừng. Kiểm tra điều kiện dừng của vòng lặp while hoặc của hàm đệ quy."
3. **Dữ liệu vào:** không hỗ trợ `input()` tương tác. Có ô "Dữ liệu vào" điền trước. `sys.stdin` phải là `io.TextIOWrapper(io.BytesIO(data), encoding='utf-8')` để **có thuộc tính `.buffer`**, giúp mẫu đọc nhanh `sys.stdin.buffer.read()` chạy được.
4. **Mô phỏng đọc ghi file như phòng thi:** ghi dữ liệu vào file ảo (ví dụ `BAI1.INP`) trong thư mục làm việc của Pyodide, đồng thời đưa vào stdin. Sau khi chạy, đọc file kết quả (ví dụ `BAI1.OUT`). Nếu bài yêu cầu file mà không tìm thấy file kết quả, báo đúng lỗi phòng thi: "Không tìm thấy file BAI1.OUT. Kiểm tra tên file và chữ hoa chữ thường."
5. **Mỗi lần chạy dùng namespace mới**, không giữ biến từ lần trước.
6. **Giới hạn output** 1 MB hoặc 10.000 dòng, quá thì cắt và báo. Hiển thị bằng `textContent`, **không bao giờ** dùng `innerHTML`.
7. **Dịch lỗi sang tiếng Việt** (`errors-vi.ts`): SyntaxError, IndentationError, NameError, TypeError, ValueError (ví dụ `int('')` khi thiếu dữ liệu vào), IndexError, KeyError, ZeroDivisionError, RecursionError, MemoryError, FileNotFoundError, EOFError. Mỗi lỗi có: dòng lỗi (tính theo code của học sinh), giải thích ngắn, gợi ý sửa, link tới bẫy liên quan.
8. **Hiện phiên bản Python** của trình duyệt và lưu ý "Lời giải mẫu tương thích Python 3.8 để chạy được trên máy chấm cũ".
9. **Code chia sẻ qua link** (mã hóa trong `#hash`) **không tự chạy**; phải bấm Chạy.
10. **Trình theo dõi từng dòng (code tracer):** dùng `sys.settrace` trong worker, ghi tối đa 1.000 bước cho chương trình ≤ 60 dòng: dòng đang chạy, biến cục bộ (số, xâu, list, dict nhỏ, cắt bớt khi lớn), ngăn xếp lời gọi, output tới thời điểm đó. Giao diện: thanh thời gian kéo được, nút lùi tới, bảng biến, tô sáng dòng.

### 2.6 Bộ chấm thử trong trình duyệt (mô phỏng Themis)

- Kiểu so sánh mỗi bài: `tokens` (mặc định, bỏ qua khoảng trắng thừa và dòng trống cuối), `lines-exact`, `float:<epsilon>`, `checker` (cho bài nhiều đáp án, checker viết bằng Python chạy trong Pyodide).
- Luôn bỏ `\r` trước khi so sánh.
- Kết quả từng test, có **icon và chữ** (không chỉ màu): Đúng, Sai kết quả, Quá thời gian, Lỗi khi chạy, Không tìm thấy file kết quả.
- Thời gian đo trên trình duyệt chậm hơn máy chấm. Dùng hệ số `TL × {{3}}` có thể chỉnh, và luôn ghi "thời gian ước lượng, máy chấm thật có thể khác".
- Chấm điểm theo cấu hình bài: `per-test` (điểm theo tỉ lệ test đúng, giống đa số kỳ thi cấp tỉnh) hoặc `subtask` (đúng hết nhóm mới có điểm nhóm).
- Bộ test tải lười từ `/judge/<id>/tests.json` khi bấm "Chấm thử". Mỗi bài ≤ 2 MB test; test cỡ lớn hơn chỉ có trong gói tải về.
- Nút **"Tải bộ test dạng Themis"**: file zip theo cấu trúc thư mục Themis (mỗi test một thư mục con chứa `.INP` và `.OUT` đặt tên theo bài), sinh sẵn bởi `themis_zip.py`.

### 2.7 Động cơ mô phỏng thuật toán

- Mỗi thuật toán là một **generator TypeScript** thuần: `function* run(input, params): Generator<Step>`.
- `Step = { kind: 'compare' | 'swap' | 'set' | 'mark' | 'push' | 'pop' | 'visit' | 'relax' | 'call' | 'return' | 'note', targets, vars, pseudoLine, pyLine, messageVi, counters }`.
- Chạy trước toàn bộ generator thành mảng bước (giới hạn 50.000 bước, báo khi vượt) để **lùi bước** và **kéo thanh thời gian** được.
- Bộ hiển thị dùng chung: `ArrayBars`, `ArrayCells`, `Grid2D` (bảng QHĐ, lưới mê cung), `GraphView` (SVG, vị trí đỉnh tính một lần), `TreeView` (cây đệ quy, heap, segment tree), `StackQueueView`, `NumberLine` (tìm kiếm nhị phân).
- Mỗi giả mã và code Python đánh nhãn dòng (`# [L3]`) để **tô sáng đồng bộ** dòng giả mã, dòng Python và hình minh họa.
- Unit test bắt buộc cho mỗi thuật toán: kết quả cuối khớp kết quả tham chiếu (ví dụ mảng sau sắp xếp bằng `toSorted()`, đường đi ngắn nhất khớp cài đặt tham chiếu) trên ≥ 200 bộ ngẫu nhiên có seed.

### 2.8 Lưu tiến độ (không tài khoản)

- Khóa `tdt:v1:progress`, có `schemaVersion` và hàm migrate.
- **Mọi lần đọc ghi localStorage bọc `try/catch`**; trang vẫn chạy đúng khi localStorage bị chặn (chế độ ẩn danh, trình duyệt trường học).
- Lưu: bài đã xong, điểm chấm thử tốt nhất, code nháp theo bài, chuỗi ngày học, huy hiệu, cấp học đang chọn, theme.
- Có **Xuất tiến độ** (tải file JSON) và **Nhập tiến độ** (kiểm tra bằng zod, chỉ nhận dữ liệu, không bao giờ eval).

### 2.9 CI (`.github/workflows/ci.yml`)

- `permissions: contents: read`. Ghim action theo commit SHA của bản major mới nhất.
- Job `web`: `npm ci` → `lint` → `typecheck` → `lint:design` → `check:contrast` → `test` → `build` → cài chromium → `test:e2e`.
- Job `content`: setup Python 3.12, cài `requirements-dev.txt` (ruff, vermin ghim phiên bản) → `verify_content.py --ci` (chạy lại kiểm định, kiểm tra hash `sol.py` khớp `verify.json`, `ruff check`, `vermin -t=3.8- --no-tips`).
- `dependabot.yml`: npm, pip, github-actions, hằng tuần.

### 2.10 Bảo mật: danh sách kiểm (chép vào `SECURITY.md` và `CLAUDE.md`)

1. Không có secret, không có `.env` cần thiết. `.gitignore` chặn `.env*`, `node_modules`, `dist`, `.vercel`, `public/pyodide`, `public/sqljs`, `source-materials`.
2. Không backend, không form gửi dữ liệu (`form-action 'none'`), không cookie, không analytics mặc định. Nếu sau này bật Vercel Web Analytics thì cập nhật Chính sách bảo mật.
3. Không thu thập dữ liệu cá nhân của học sinh (phù hợp quy định bảo vệ dữ liệu cá nhân của Việt Nam, đặc biệt với trẻ em).
4. Header bảo mật như 2.4. Kiểm tra lại bằng `curl -I` trên bản preview.
5. Không `innerHTML`, `set:html`, `dangerouslySetInnerHTML` với dữ liệu không đến từ repo. Output chương trình luôn qua `textContent`.
6. Code học sinh chạy trong Worker, có timeout, `connect-src 'self'` chặn gửi dữ liệu ra ngoài.
7. Nếu có phòng HTML/CSS (lớp 12): iframe `srcdoc` với `sandbox` **không có** `allow-scripts` và `allow-same-origin`, chỉ HTML/CSS.
8. Nhập file tiến độ: giới hạn 1 MB, parse JSON, kiểm tra bằng zod.
9. Phụ thuộc: ghim phiên bản, `npm audit --audit-level=high` không có lỗi, Dependabot bật.
10. Link ngoài: `rel="noopener noreferrer"`.
11. `.gitattributes`: `* text=auto eol=lf`, `*.wasm binary`, `*.INP text eol=lf`, `*.OUT text eol=lf` (tránh lỗi CRLF khi dev trên Windows).

### 2.11 Hiệu năng và chất lượng

- Lighthouse di động: Performance ≥ 90 ở trang chủ và trang nội dung; Accessibility, Best Practices, SEO ≥ 95.
- Trang nội dung: JS ≤ 100 KB gzip (trước khi mở trình soạn code). Pyodide, sql.js, CodeMirror chỉ tải ở trang cần.
- Ảnh qua `astro:assets` (AVIF/WebP), có `width`/`height`.
- Kiểm tra ở 390px: không cuộn ngang, nút không tràn chữ, nút hành động chính thấy được ngay màn hình đầu.
- Có stylesheet in (`@media print`) cho trang đề bài và đề thi thử: ẩn điều hướng, nền trắng chữ đen.

---

## PHẦN 3. DESIGN SYSTEM (BẮT BUỘC)

### 3.1 Nguồn và quyết định khi xung đột

Nguồn: skill `figma-designer` (cấu trúc token, màu hai lớp, component và trạng thái) và skill `landing-page-design` (quy tắc web, trang chủ, chuyển động). Nếu có hai skill này trong môi trường, **tải và đọc chúng trước** Giai đoạn 1. Khi hai nguồn khác nhau, áp dụng các quyết định đã chốt:

| Điểm khác | Quyết định cho website |
|---|---|
| Độ đậm Heading (Figma: Regular, web: Semibold) | **Semibold** (theo `landing-page-design`). Nếu dựng Figma ở Giai đoạn 0 thì đặt Heading Semibold để đồng bộ |
| Font (Figma: tự do, web: chỉ Geist, Manrope, Poppins) | **Manrope** (có tiếng Việt) + **Geist Mono** cho code |
| Tên token | Giữ tên của `figma-designer`, chuyển sang kebab case cho CSS: `Surface/Primary-Hover` → `--surface-primary-hover` |

### 3.2 Chữ

- Một kiểu chữ: Manrope. Geist Mono chỉ cho code, giả mã, số liệu, bảng test.
- **Không chữ nghiêng. Không độ đậm trên Bold** (không 800, 900).
- Cỡ chữ chỉ theo thang Tailwind: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128. Lệch thang thì lấy bậc dưới kèm line height của bậc đó.
- Mọi đoạn chữ dùng một **text style có tên**, định nghĩa một lần bằng `@utility` trong Tailwind v4, tên kebab case:

| Style | Cỡ / line height | Độ đậm |
|---|---|---|
| heading-1 … heading-6 | 60/60, 48/48, 36/40, 30/36, 24/32, 20/28 | Semibold |
| title-1 … title-5 | 20/28, 18/28, 16/24, 14/20, 12/16 | Medium |
| body-1, body-2, body-3 | 16/24 | Semibold, Medium, Regular |
| body-4, body-5, body-6 | 14/20 | Semibold, Medium, Regular |
| button-lg, button-md, button-sm, button-xsm | 18/28, 16/24, 14/20, 12/16 | Semibold |
| caption-1, caption-2 | 14/20 | Medium, Regular |
| caption-3, caption-4, caption-5 | 12/16 | Semibold, Medium, Regular |

- Dùng nhóm nào: Heading cho tiêu đề trang và mục (heading-1 chỉ cho hero). Title cho tiêu đề thẻ, mục danh sách, nav. Body cho văn bản. Button chỉ cho chữ trong nút (nút chính button-md, nút nhỏ ở header button-sm). Caption cho metadata, nhãn, huy hiệu, thời gian.
- Cần style mới thì thêm số kế tiếp trong nhóm (ví dụ body-7) từ một bậc của thang. Không đặt tên mới.
- Heading dùng `text-wrap: balance`, đoạn văn dùng `text-wrap: pretty`. Không để một từ đứng một mình ở dòng cuối tiêu đề, ngắt dòng thủ công ở chỗ ý ngắt.
- Trên màn hình nhỏ, heading-1 của hero hạ xuống heading-3 hoặc heading-4 (vẫn là style có tên).

### 3.3 Khoảng cách

Chỉ dùng các token sau (reset namespace spacing của Tailwind rồi khai báo lại, để `p-200` = 16px và các lớp ngoài danh sách không tồn tại):

| Token | 0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| px | 0 | 2 | 4 | 8 | 12 | 16 | 24 | 32 | 40 | 48 | 64 | 80 | 96 |

- Nút chính: padding dọc 8 (`spacing-75`), ngang 12 (`spacing-100`). Vùng bấm trên di động vẫn ≥ 44 × 44 (dùng min-height).
- Giá trị lệch thì làm tròn về token gần nhất.

### 3.4 Bo góc

- Chỉ dùng: 0, 2, 4, 6, 8, 12, 16, 24, full, khai báo thành `--radius-0` … `--radius-24`, `--radius-full`.
- **Quy tắc lồng nhau:** khi một khối nằm trong khối khác và khoảng cách < 32px thì `bo trong = bo ngoài − khoảng cách`, chỉ áp dụng khi kết quả > 2. Ví dụ thẻ bo 16, padding 8 thì phần tử bên trong bo 8.

### 3.5 Màu: hai lớp, Light và Dark

**Lớp 1, Core Colors** (`tokens.css`, biến `--core-<palette>-<shade>`): bảng màu thô sinh từ màu thương hiệu ở Phần 0 theo thang OKLCH, `00` gần trắng, `500` là màu gốc, `1000` gần đen.

| Palette | Shade |
|---|---|
| primary | 00, 50, 100, 150, 200, 300, 350, 400, 450, 500, 600, 700, 800, 850, 900, 950, 1000 |
| secondary, accent, red, green, yellow | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| grayscale | 00, 50, 100, 150, 200, 250, 300, 400, 450, 500, 600, 700, 750, 800, 850, 870, 900, 950, 1000 |
| grayscale-alpha | 700-16, 700-24, 700-40, 700-64, 700-80 (màu grayscale 700 với độ mờ lưu sẵn trong biến) |

Grayscale cố định: `1000 = #000000`, `870 = #181818`, `850 = #1F1F1F`, `800 = #272727`, `750 = #313131`. Thêm hai giá trị dùng cho tiêu đề hero: `#9B9B9B` và `#666666` (gán vào shade gần nhất hoặc biến lõi riêng).

**Lớp 2, Color System** (`theme.css`): token ngữ nghĩa, **mọi giá trị là `var(--core-…)`, không hex**. Mode Dark theo bảng dưới (G = grayscale, P = primary, A = accent, R = red, Gr = green, Y = yellow). Mode Light lấy shade đối xứng (870 ↔ 00/50, 800 ↔ 100, 750 ↔ 150/200, 700 ↔ 250/300, 600 ↔ 400), riêng nhóm Action giữ shade đủ đậm để chữ trắng đạt 4.5:1.

- **border:** primary G750, primary-disabled G800, primary-light G700, secondary G750, tertiary G600, action-primary P400, action-disabled P600, action-secondary G500, error R400, error-disabled R700, success Gr400, warning Y300, warning-disabled Y700
- **surface:** primary G870, primary-hover G800, primary-selected G700, primary-subtle G850, secondary G800, secondary-hover G700, secondary-selected G700, secondary-subtle G750, tertiary G600, tertiary-hover G450, accent A500, accent-subtle A200, info P400, info-subtle P150, error R500, error-subtle R100, error-darker R700, inverted G00, inverted-hover G250, inverted-disabled G450, warning Y500, warning-subtle Y100, warning-hover Y700, success Gr500, success-subtle Gr100
- **action:** primary P500, primary-hover P700, primary-click P600, primary-disabled P700, secondary G600, secondary-hover G750, secondary-click G700, error R700, error-hover R800, error-disabled R800, error-subtle R150, warning Y500, warning-hover Y700, warning-disabled Y800, warning-subtle Y100
- **text:** primary G50, primary-disabled G750, primary-subtle G500, secondary G200, secondary-disabled G500, tertiary G400, inverted G850, error R500, error-disabled R800, error-inverted R800, error-inverted-disabled R200, success Gr600, success-inverted Gr700, success-inverted-disabled Gr300, info P350, info-inverted P700, info-inverted-disabled P200, warning Y500, warning-disabled Y800, warning-inverted Y800, warning-inverted-disabled Y300
- **icon:** default G50, secondary G200, subtle G500, inverted G850, disabled G750, error R500, error-disabled R800, error-inverted-disabled R200, info P350, info-disabled P200, warning Y500, warning-inverted Y700, warning-disabled Y800, warning-inverted-disabled Y300, success Gr400, success-inverted-disabled Gr300
- **overlay:** xs, sm, md, lg, xlg → grayscale-alpha 700-16, 700-24, 700-40, 700-64, 700-80

Quy tắc:
- Component **chỉ dùng token Color System** (qua `@theme inline` của Tailwind: `bg-surface-primary`, `text-text-secondary`…). `lint:design` báo lỗi nếu component dùng `--core-*` hoặc hex.
- Theme: Sáng, Tối, Theo hệ thống. Chuyển bằng `data-theme` trên `<html>`.
- **Nền phẳng, không gradient nền** (kể cả nút, lớp phủ). Nền tối chỉ dùng: `#000000`, `#181818`, `#1F1F1F`, `#272727`, `#313131`, `#131209`.
- **Ngoại lệ duy nhất:** chữ tiêu đề hero là gradient trái sang phải. Tối: `#FFFFFF` → `#9B9B9B`. Sáng: `#000000` → `#666666`. Hai điểm dừng là biến đổi theo theme.
- **Một màu nhấn** (accent), độ bão hòa < 80%.
- **Viền bao quanh đủ 4 cạnh hoặc không có.** Không viền một cạnh trên thẻ. Phân cách hàng bằng một khối cao 1px tô token `border-*`.
- **Tương phản:** chữ thường ≥ 4.5:1; chữ lớn (≥ 24px, hoặc ≥ 18px đậm), icon, viền ô nhập, focus ring ≥ 3:1. Tiêu đề gradient kiểm tra ở đầu nhạt nhất. `check:contrast` kiểm tra mọi cặp chữ/nền dự kiến ở cả hai mode, build fail nếu không đạt. Màu thương hiệu không đạt với chữ trắng thì dùng shade đậm hơn cho token action.
- Màu tô cú pháp code (Shiki, CodeMirror) cũng lấy từ token `text-*` (ví dụ từ khóa `text-info`, chuỗi `text-success`, số `text-warning`, chú thích `text-tertiary`) và phải đạt 4.5:1.
- **Màu trạng thái trong mô phỏng** (luôn kèm nhãn chữ hoặc icon, không chỉ màu): đang so sánh `surface-accent`, đang đổi chỗ `surface-info`, đã đúng vị trí `surface-success`, chốt (pivot) `surface-warning`, chưa xét `surface-secondary`.

### 3.6 Bố cục

- Khung desktop 1440, nội dung canh giữa rộng 1280 (token `--container-content`). Tiêu đề và mô tả hero tối đa 680 (token `--container-hero`). Không dùng giá trị trong ngoặc vuông kiểu `max-w-[680px]`; khai báo token.
- Kiểm tra ở 1440, 768, 390.
- **Không mặc định ba thẻ bằng nhau một hàng.** Dùng bento, lưới lệch, hai cột zigzag.
- Các thẻ cạnh nhau canh thẳng tiêu đề, danh sách, nút ở cùng một trục dọc.
- **Không eyebrow tag** (nhãn nhỏ phía trên tiêu đề).

### 3.7 Icon

Phosphor, độ dày Regular cho toàn site. Không Material Icons/Symbols. Màu icon lấy token `icon-*`. Icon đứng một mình phải có `aria-label`.

### 3.8 Chuyển động

- Đường cong duy nhất: `cubic-bezier(0.22, 1, 0.36, 1)`. 500ms cho thay đổi bố cục, vị trí. 300ms cho màu, độ mờ (không dưới 200ms). Không dùng `ease`, `linear`, `ease-in-out` mặc định.
- Chỉ animate `transform` và `opacity`.
- Thanh điều hướng: nổi cách mép trên, canh giữa, rộng vừa nội dung, nền mờ trong suốt có blur. Nút menu biến hình giữa hai trạng thái. Menu di động mở toàn chiều cao; các link hiện lần lượt, mỗi link trồi 24px và hiện dần, cách nhau 60ms, tổng không quá 400ms.
- Section xuất hiện khi cuộn: trồi 32px, hiện dần 600 đến 800ms, chỉ một lần, dùng `IntersectionObserver`. Không gắn listener `scroll` không throttle.
- Mô phỏng thuật toán là ngoại lệ có kiểm soát: thời lượng chuyển cảnh = 80% khoảng cách giữa hai bước, vẫn dùng đường cong trên; khi khoảng cách < 200ms thì chuyển tức thời không tween.
- `prefers-reduced-motion`: bỏ chuyển động, chỉ đổi độ mờ; mô phỏng chuyển bước tức thời.

### 3.9 Component và trạng thái

- Thứ gì dùng hơn một lần là component, chữ bên trong truyền qua props.
- **Button:** một component, `type` = primary | secondary | tertiary | error | warning, mỗi loại đủ trạng thái default, hover, pressed (`scale(0.98)`), focus (vòng 2px bên ngoài, tương phản ≥ 3:1), disabled. Có 4 cỡ theo button-lg/md/sm/xsm. Nền lấy `action-*`, viền `border-*`, chữ `text-*`.
- **Input, Textarea, Select:** default, hover, focus, filled, error (kèm thông báo lỗi bên dưới, có icon), disabled.
- **Khối dữ liệu** (danh sách đề, kết quả chấm, kết quả tìm kiếm, tiến độ) đều có: Loading (skeleton giống bố cục thật, không spinner tròn), Empty (màn hình "bắt đầu từ đây" có hướng dẫn và một nút), Error (nói cái gì hỏng và làm gì tiếp).
- Bộ tối thiểu: Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Tabs, Accordion, Dialog, Toast, Tooltip, Badge (cấp độ), Tag (kỳ thi, chủ đề), Card, Callout (Mẹo, Bẫy, Lưu ý, Ví dụ), CodeBlock (nút sao chép), PseudoBlock (đánh số dòng, tô sáng dòng), Breadcrumb, Pagination, Skeleton, EmptyState, ErrorState, ProgressRing, Stepper, ThemeToggle, LevelSwitcher (Tiểu học, THCS, THPT).
- Không link chết. Nút chưa có chức năng thì disabled có chú thích. Trang hiện tại được đánh dấu trên nav (`aria-current="page"`).

### 3.10 Lời văn giao diện

- Viết câu thật, không lorem ipsum, không "Tiêu đề ở đây".
- **Không dùng dấu gạch nối hay gạch ngang trong câu chữ giao diện** (viết "Tiểu học đến THPT", không "Tiểu học–THPT"). Code, giả mã, công thức không tính.
- Tiêu đề và nút viết hoa chữ cái đầu câu (sentence case).
- Tiêu đề hero không có dấu chấm, kể cả giữa hai ý; tách ý bằng xuống dòng.
- Nút: động từ + thứ nhận được ("Bắt đầu lộ trình", "Chạy chương trình", "Chấm thử", "Tải bộ test"), không "Xem thêm", "Gửi".
- Thông báo bình tĩnh, cụ thể, không chấm than: "Đã lưu code nháp cho bài Tổng đoạn con", "Chưa có dữ liệu vào. Nhập dữ liệu vào ô bên trái rồi chạy lại."
- Cấm các cụm sáo rỗng: "cách mạng hóa", "đột phá", "tiên tiến bậc nhất", "dễ dàng tuyệt đối", "nâng tầm", "khai phá sức mạnh", "đẳng cấp thế giới".
- Giọng: như thầy cô hướng dẫn, gần gũi, rõ ràng; với Tiểu học câu ngắn hơn nhưng không trẻ con hóa với THPT.

### 3.11 `scripts/lint-design.mjs` phải bắt được

Giá trị trong ngoặc vuông của Tailwind (`p-[13px]`, `text-[19px]`), `font-size`/`margin`/`padding`/`gap`/`border-radius` bằng số ngoài token trong CSS, mã hex ngoài `tokens.css`, `--core-*` dùng trong component, `italic`, `font-extrabold`, `font-black`, import Material Icons, `ease`/`linear`/`ease-in-out` trong transition, `bg-gradient`/`linear-gradient` trên nền, `border-t`/`border-b`/`border-l`/`border-r` đơn lẻ trên thẻ, `innerHTML`, `window.alert`, `href="#"`. In ra file và dòng vi phạm, thoát mã lỗi khác 0.

### 3.12 Trang `/thiet-ke` (noindex)

Tương đương khung Foundations trong Figma: hiện mọi token Core Colors (mỗi palette một hàng), Color System (Light và Dark cạnh nhau, ghi tên token và token lõi nó trỏ tới), thanh spacing đúng kích thước, ô vuông bo góc, mẫu từng text style, và mọi component ở mọi trạng thái. Mẫu đọc trực tiếp từ biến CSS nên đổi token là trang tự cập nhật.

---

## PHẦN 4. TÍNH NĂNG VÀ NỘI DUNG

### 4.1 Sơ đồ trang

| Đường dẫn | Nội dung | Index |
|---|---|---|
| `/` | Trang chủ (4.2) | có |
| `/hoc`, `/hoc/[cap]`, `/hoc/[cap]/[lop]`, `/hoc/[cap]/[lop]/[bai]` | Lộ trình theo CT GDPT 2018 (4.3) | có |
| `/lap-trinh` | Phòng lập trình Python (4.4) | có |
| `/sql`, `/sql/[db]` | Phòng thực hành SQL (4.5) | có |
| `/mo-phong`, `/mo-phong/[thuat-toan]` | Mô phỏng thuật toán (4.6) | có |
| `/tu-duy`, `/tu-duy/[cau-do]` | Rèn luyện tư duy (4.7) | có |
| `/ky-thi`, `/ky-thi/[ky-thi]` | Hồ sơ từng kỳ thi (4.8) | có |
| `/luyen-de`, `/luyen-de/[bai]` | Kho đề có bộ lọc (4.8) | có |
| `/thi-thu`, `/thi-thu/[de]` | Thi thử có bấm giờ (4.8) | có (trang làm bài noindex) |
| `/bay-thuong-gap`, `/bay-thuong-gap/[bay]` | Thư viện bẫy (4.9) | có |
| `/cam-nang`, `/cam-nang/[bai]` | Cẩm nang (4.10) | có |
| `/tien-do` | Tiến độ cá nhân (4.11) | noindex |
| `/giao-vien` | Hướng dẫn dùng cho giáo viên | có |
| `/gioi-thieu`, `/chinh-sach-bao-mat`, `/dieu-khoan` | Trang phụ, pháp lý | có |
| `/thiet-ke` | Design system (3.12) | noindex |
| `404` | Trang 404 tùy biến, có ô tìm kiếm và link về các khu chính | |

Thanh điều hướng: Học, Mô phỏng, Luyện đề, Tư duy, Cẩm nang, ô tìm kiếm (phím tắt `/`), LevelSwitcher, ThemeToggle. Cấp học đang chọn lọc nội dung toàn site và được nhớ lại.

Mọi trang: `<title>` và meta description tiếng Việt riêng, canonical, Open Graph, `sitemap.xml`, `robots.txt`, breadcrumb, đường quay lại, link bỏ qua tới nội dung chính, HTML ngữ nghĩa (`nav`, `main`, `article`, `aside`, `section`), alt cho mọi ảnh có nghĩa.

### 4.2 Trang chủ (áp dụng `landing-page-design`)

Trước khi code, trình bày theo đúng thứ tự: dàn ý, copy hero, lợi ích, cách hoạt động, FAQ, SEO, loại bố cục. Sau đó dựng từng section, chụp màn hình và sửa sau mỗi section.

Giả định intake (dùng nếu người dùng không nói khác):
- Một hành động chính: **chọn cấp học và bắt đầu lộ trình**. Không có nút cạnh tranh trên màn hình đầu.
- Đối tượng: học sinh và giáo viên bồi dưỡng ở Gia Lai (bao gồm địa bàn Bình Định cũ) và cả nước.
- Đảm bảo giảm rủi ro: miễn phí, không cần tài khoản, không thu thập dữ liệu cá nhân.
- Bố cục: **A. Hero cổ điển + các section**, vì sản phẩm thể hiện tốt nhất qua một mô phỏng chạy thật ngay ở hero.

Thứ tự section:
1. **Hero:** heading-1 gradient, tối đa 680px, ví dụ `Hiểu thuật toán từng bước` / `Tự tin bước vào phòng thi tin học`. Mô tả: "Bài học bám chương trình GDPT 2018, mô phỏng thuật toán chạy ngay trên trình duyệt và kho đề luyện thi học sinh giỏi có lời giải Python đã kiểm chứng." Nút: "Chọn cấp học của bạn". Bằng chứng: **số đếm thật lấy từ nội dung lúc build** ("`{{n}}` bài có lời giải, `{{m}}` thuật toán mô phỏng"), không gõ tay. Hình hero: một mô phỏng sắp xếp nhỏ chạy thật, bấm được.
2. **Chọn lộ trình:** Tiểu học, THCS, THPT trong bố cục lệch (không ba thẻ bằng nhau), mỗi cấp nêu kết quả đạt được và kỳ thi liên quan.
3. **Vấn đề và giải pháp:** "Vì sao bài đúng ý tưởng vẫn mất điểm": sai tên file, đọc dữ liệu chậm, quên trường hợp biên, `round()` của Python… dẫn tới thư viện bẫy.
4. **Lợi ích (bento 4 ô):** xem thuật toán chạy từng bước với dữ liệu của bạn; chạy Python và SQL ngay trên trình duyệt; kho đề theo cấu trúc HSG tỉnh và Tin học trẻ; cẩm nang phòng thi.
5. **Section tagline lớn với hiệu ứng hiện từng chữ** (bắt buộc), ít nhất hai dòng, ví dụ `Mỗi dòng code đều có lý do` / `Hiểu lý do là bước đầu của giải cao`. Chữ bắt đầu ở 25 đến 35% độ đậm màu chữ, từng chữ chuyển sang màu đầy đủ theo thứ tự đọc khi cuộn qua. Giảm chuyển động thì hiện đầy đủ ngay.
6. **Cách hoạt động (3 bước):** chọn cấp học, học và mô phỏng, luyện đề và thi thử.
7. **Bằng chứng trung thực:** "Mọi lời giải đều chạy qua `{{tổng số test}}` test tự động trước khi xuất bản" (số thật từ `verify.json`). Lời chứng thực chỉ hiện khi người dùng cung cấp; chưa có thì ẩn section.
8. **FAQ (8 đến 10 câu, kèm FAQPage JSON-LD):** có miễn phí không; có cần đăng ký không; tiến độ lưu ở đâu; dùng điện thoại được không; đề có phải đề thật không (giải thích ba nhãn nguồn); dùng Python phiên bản nào; chấm thử có giống Themis không; giáo viên dùng trong lớp thế nào; vì sao THCS học Python dù SGK dùng Scratch; báo lỗi nội dung ở đâu.
9. **Lời kêu gọi cuối:** giống hệt nút ở hero.
10. Chân trang: Giới thiệu, Chính sách bảo mật, Điều khoản, Dành cho giáo viên, liên hệ `mailto:EMAIL_LIEN_HE`, giấy phép, `DON_VI`.

### 4.3 Lộ trình theo CT GDPT 2018

Khung định hướng dưới đây phải được **đối chiếu với Chương trình môn Tin học (ban hành kèm Thông tư 32/2018/TT-BGDĐT) và SGK hiện hành** (Kết nối tri thức với cuộc sống, Cánh diều, Chân trời sáng tạo) trước khi viết bài; chỗ nào lệch thì sửa theo văn bản và ghi nguồn vào `docs/SOURCES.md`.

Các mạch nội dung: A. Máy tính và cộng đồng (THPT: Máy tính và xã hội tri thức); B. Mạng máy tính và Internet; C. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin; D. Đạo đức, pháp luật và văn hóa trong môi trường số; E. Ứng dụng tin học; F. Giải quyết vấn đề với sự trợ giúp của máy tính; G. Hướng nghiệp với tin học (THPT). Nền tảng tập trung vào **mạch F**, có bài ngắn cho C, D.

| Cấp | Lớp | Trọng tâm trên nền tảng | Công cụ |
|---|---|---|---|
| Tiểu học | 3 | Thực hiện công việc theo các bước, tư duy tuần tự | Câu đố robot trên lưới |
| | 4, 5 | Lập trình trực quan: tuần tự, lặp, rẽ nhánh (SGK dùng Scratch) | Câu đố khối lệnh, tùy chọn Blockly sinh code Python |
| THCS | 6 | Khái niệm thuật toán, mô tả bằng liệt kê các bước và sơ đồ khối, ba cấu trúc điều khiển | Giả mã, sơ đồ khối, theo dõi từng bước |
| | 7 | Tìm kiếm tuần tự, tìm kiếm nhị phân, sắp xếp chọn, sắp xếp nổi bọt | Mô phỏng |
| | 8 | Lập trình trực quan: biến, biểu thức, cấu trúc điều khiển | Cầu nối từ khối lệnh sang Python |
| | 9 | Giải quyết vấn đề với máy tính, mô phỏng | Bài tập Python mở rộng phục vụ HSG lớp 9 |
| THPT | 10 | Python cơ bản: kiểu dữ liệu, rẽ nhánh, lặp, hàm, list, xâu, kiểm thử và gỡ lỗi | Phòng Python, code tracer |
| | 11 | Cơ sở dữ liệu quan hệ và SQL; định hướng Khoa học máy tính: sắp xếp, tìm kiếm, độ phức tạp thời gian, kiểm thử | Phòng SQL, mô phỏng |
| | 12 | Tạo trang web với HTML, CSS; chủ đề nâng cao định hướng Khoa học máy tính | Phòng HTML/CSS (tùy chọn) |
| Bồi dưỡng HSG | THCS, THPT | Vượt chương trình: CTDL và giải thuật theo cấp độ 1 đến 5 | Kho đề, thi thử |

Ghi chú hiển thị cho học sinh THCS: SGK THCS dùng Scratch, Python là phần **mở rộng để luyện thi HSG**; ngôn ngữ chính thức được phép trong mỗi kỳ thi xem ở hồ sơ kỳ thi.

Mỗi bài học có: yêu cầu cần đạt (đúng lời văn chương trình khi có), lý thuyết ngắn, ví dụ chạy được, mô phỏng liên quan, 3 đến 5 bài tự luyện tăng dần, quiz 5 câu theo 4 mức Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao, link sang đề luyện cùng chủ đề.

### 4.4 Phòng lập trình Python

Bố cục: trình soạn code | ô Dữ liệu vào | ô Kết quả, có tab "Theo dõi từng dòng". Nút: Chạy (Ctrl+Enter), Dừng, Đặt lại, Chia sẻ link, Tải file `.py`, chọn mẫu (Mẫu cơ bản, Mẫu phòng thi đọc ghi file, Mẫu đọc nhanh). Chế độ "Đọc ghi file" nhập tên file `.INP`/`.OUT` để luyện đúng như phòng thi. Code nháp tự lưu theo trang.

### 4.5 Phòng thực hành SQL (lớp 11)

- 3 CSDL mẫu tiếng Việt, dữ liệu hư cấu nhưng hợp lý: **Thư viện trường**, **Quản lý điểm**, **Cửa hàng văn phòng phẩm**. Hiện sơ đồ bảng và khóa.
- Bài tập từ SELECT, WHERE, ORDER BY tới GROUP BY, HAVING, JOIN, truy vấn con, INSERT/UPDATE/DELETE (chạy trên bản sao, có nút khôi phục CSDL).
- Chấm bằng so khớp tập kết quả (có tùy chọn bắt buộc đúng thứ tự).
- Hộp ghi chú "Khác biệt SQLite và MySQL" (SGK thường thực hành với MySQL), ví dụ kiểu dữ liệu, `AUTO_INCREMENT`, so sánh chuỗi.

### 4.6 Mô phỏng thuật toán

**Giao diện mỗi thuật toán:**
- Vùng minh họa lớn; bảng điều khiển: Chạy/Tạm dừng (Space), lùi một bước (←), tới một bước (→), thanh thời gian, tốc độ 0.25× đến 4×, Đặt lại.
- **Thông số tùy chỉnh:** ô nhập dữ liệu dạng chữ có kiểm tra hợp lệ ("5 3 8 1 9"), số phần tử, seed ngẫu nhiên, bộ dữ liệu mẫu (ngẫu nhiên, đã tăng, giảm dần, nhiều phần tử trùng, trường hợp xấu nhất), và tham số riêng (ví dụ giá trị cần tìm, cách chọn pivot, sức chứa túi, đỉnh xuất phát).
- Panel: giả mã tiếng Việt và code Python (tô sáng đồng bộ), bảng biến, bộ đếm (số phép so sánh, gán, đổi chỗ, lời gọi đệ quy), nhật ký diễn giải từng bước bằng lời (`aria-live="polite"`), thẻ độ phức tạp (tốt nhất, trung bình, xấu nhất, bộ nhớ).
- **Chế độ dự đoán:** thỉnh thoảng dừng lại hỏi "Bước tiếp theo sẽ đổi chỗ hai phần tử nào?" rồi mới chạy tiếp.
- **Chế độ so sánh:** hai thuật toán sắp xếp chạy song song trên cùng dữ liệu, so bộ đếm.
- Mỗi trang có: ví dụ chạy tay trên bộ nhỏ, bài tập liên quan trong kho đề, bẫy hay gặp khi cài đặt.

**Danh mục (≥ 30 thuật toán, ghi cấp học và cấp độ):**

| Tầng | Thuật toán |
|---|---|
| Cơ bản (THCS 6, 7; THPT 10) | Tìm max/min, đếm và tính tổng có điều kiện; tìm kiếm tuần tự; tìm kiếm nhị phân (kèm biến thể cận dưới, cận trên); sắp xếp nổi bọt (có cờ dừng sớm), chọn, chèn; Euclid (trừ liên tiếp và chia lấy dư); kiểm tra số nguyên tố đến căn n; sàng Eratosthenes (lưới đến 400); chuyển hệ cơ số 2, 8, 16; xâu đối xứng, đảo xâu, đếm ký tự |
| Vận dụng (THPT 11, HSG THCS) | Sắp xếp đếm phân phối, trộn, nhanh (chọn pivot đầu, cuối, giữa, ngẫu nhiên), vun đống; mảng cộng dồn 1 chiều, 2 chiều, mảng hiệu; hai con trỏ; cửa sổ trượt; chặt nhị phân theo đáp án; đệ quy: giai thừa, Fibonacci (cây đệ quy so với ghi nhớ), Tháp Hà Nội (1 đến 8 đĩa); quay lui: sinh xâu nhị phân, hoán vị, tổ hợp, N quân hậu (4 đến 10); tham lam: đổi tiền với bộ mệnh giá tùy chỉnh (có ví dụ tham lam sai), chọn hoạt động; ngăn xếp: kiểm tra ngoặc, tính biểu thức hậu tố; hàng đợi; lũy thừa nhanh |
| Chuyên sâu (HSG tỉnh THPT, Olympic) | QHĐ: đường đi trên lưới có ô cấm, dãy con tăng dài nhất (O(n²) và O(n log n)), cái túi 0/1, xâu con chung dài nhất, đổi tiền (số cách và số đồng ít nhất); đồ thị (nhập danh sách cạnh hoặc vẽ, có hướng hoặc vô hướng): BFS, DFS, BFS trên lưới mê cung, thành phần liên thông, Dijkstra, Kruskal với DSU, Prim, sắp xếp tô pô, Floyd Warshall (n ≤ 8); CTDL: heap, DSU, Fenwick, segment tree (n ≤ 16), trie; xâu: KMP (bảng tiền tố), băm xâu; duyệt tập con bằng bitmask |

Giới hạn kích thước dữ liệu mỗi thuật toán để hình còn đọc được (ví dụ sắp xếp tối đa 40 phần tử).

### 4.7 Rèn luyện tư duy

- Câu đố **tự biên soạn** (không sao chép đề Bebras hay nguồn có bản quyền), định nghĩa bằng JSON, chạy trên một số "động cơ" dùng chung:
  1. Robot trên lưới (lệnh đi, rẽ, lặp, điều kiện)
  2. Tìm quy luật dãy số, dãy hình
  3. Sắp xếp các bước của thuật toán (kéo thả, có cách thao tác bằng bàn phím)
  4. Đọc giả mã hoặc sơ đồ khối, đoán kết quả in ra
  5. Thẻ nhị phân (biểu diễn số)
  6. Cân đĩa tìm đồng xu giả (trực giác chia đôi)
  7. Suy luận logic dạng bảng
  8. Bản đồ đường đi (tham lam so với tối ưu)
- 4 mức: Khởi động, Vững vàng, Thử thách, Chuyên sâu. Mỗi câu có gợi ý 1, gợi ý 2, lời giải nêu rõ kỹ năng tư duy được rèn (phân rã, nhận dạng mẫu, trừu tượng hóa, thiết kế thuật toán).
- "Thử thách mỗi ngày": chọn câu theo ngày (tất định, không cần máy chủ).

### 4.8 Kỳ thi, kho đề, thi thử

**Hồ sơ kỳ thi** (`/ky-thi/[id]`): đối tượng, vòng thi, hình thức, ngôn ngữ cho phép, phần mềm chấm, quy ước đặt tên file và thư mục bài làm, thang điểm, thời gian, chủ đề hay ra, lộ trình ôn, đề luyện liên quan, bẫy đặc thù. **Mọi thông tin thể lệ phải có nguồn** trong `docs/SOURCES.md`; chưa xác minh thì hiện `{{CẦN XÁC MINH}}` kèm dòng "Thông tin cần đối chiếu với văn bản chính thức năm hiện hành".

Danh sách kỳ thi ban đầu:
- **HSG cấp tỉnh Gia Lai** (THCS lớp 9, THPT). Từ 01/7/2025 tỉnh Bình Định hợp nhất vào tỉnh Gia Lai mới; kỳ thi từ năm học 2025 đến 2026 trở đi gắn nhãn "Gia Lai (mới)". Đề trước thời điểm đó giữ đúng nhãn tỉnh cũ.
- **HSG cấp tỉnh Bình Định**: kho lưu trữ đến năm học 2024 đến 2025.
- **HSG cấp huyện, cấp trường**: theo quy định hiện hành (đã có thay đổi về việc tổ chức thi HSG ở một số khối lớp, phải xác minh).
- **Hội thi Tin học trẻ** (cấp tỉnh và toàn quốc): bảng theo cấp học (Tiểu học, THCS, THPT) ở phần thi lập trình và các bảng sản phẩm sáng tạo. Xác minh thể lệ năm hiện hành: ngôn ngữ, thời gian, hình thức chấm.
- **Tham khảo nâng cao:** Olympic truyền thống 30/4, kỳ thi chọn HSG quốc gia, cho cấp độ 5.

Đặc điểm thường gặp của đề HSG Tin cấp tỉnh (dùng làm khung cho đề luyện, vẫn phải xác minh từng năm): 3 đến 5 bài trong 150 đến 180 phút; chấm tự động bằng Themis theo bộ test; đọc ghi file `.INP`/`.OUT` hoặc vào ra chuẩn theo đề; đặt tên file chương trình theo quy định; giới hạn thời gian thường khoảng 1 giây mỗi test; điểm theo tỉ lệ test đúng, ràng buộc chia nhóm (subtask).

**Ba nhãn nguồn đề (bắt buộc, hiện rõ trên mỗi bài):**

| Nhãn | Khi nào được dùng | Hiển thị |
|---|---|---|
| `official` (Đề chính thức) | Chỉ khi người dùng đặt file đề gốc vào `source-materials/` và nêu nguồn | Trích nguồn đầy đủ (đơn vị ra đề, kỳ thi, năm học, vòng); lời giải do ta viết |
| `adapted` (Phỏng theo) | Có đề gốc nhưng đã đổi câu chữ hoặc số liệu | "Phỏng theo đề … năm …" |
| `original` (Đề luyện biên soạn) | Đề AI hoặc giáo viên tự soạn theo cấu trúc một kỳ thi | "Đề luyện biên soạn theo cấu trúc …" |

**Tuyệt đối không** gắn tên kỳ thi và năm cụ thể cho một đề tự soạn.

**Trang bài tập** (`/luyen-de/[bai]`):
- Đầu trang: tiêu đề, huy hiệu cấp độ (icon + chữ: 1 Làm quen, 2 Cơ bản, 3 Vận dụng, 4 Vận dụng cao, 5 Chuyên sâu), nhãn nguồn, tag kỳ thi, lớp, chủ đề, giới hạn thời gian và bộ nhớ, tên file vào ra.
- Cột trái, các tab: **Đề bài** | **Gợi ý** (mở dần: gợi ý 1, gợi ý 2) | **Phân tích** (ý tưởng theo từng subtask, vì sao cách trâu chậm) | **Giả mã** | **Lời giải Python** (lời giải từng phần nếu có, lời giải 100%, chú thích tiếng Việt) | **Độ phức tạp** | **Bẫy cần tránh**. Lời giải ẩn sau nút "Xem lời giải", nhắc học sinh thử trước.
- Cột phải: trình soạn code (mẫu đọc ghi đúng tên file của bài), Dữ liệu vào, Chạy, **Chấm thử**, kết quả từng test, nút tải bộ test dạng Themis.
- Di động: xếp dọc, chuyển qua lại bằng tab.

**Bộ lọc kho đề:** kỳ thi, cấp học, lớp, chủ đề, cấp độ, nhãn nguồn, trạng thái của tôi (chưa làm, đang làm, đã đạt). Sắp xếp theo cấp độ hoặc mới thêm. Tìm không dấu.

**Thi thử** (`/thi-thu/[de]`):
- Đề thi thử là tệp YAML ghép các bài, mô phỏng một cấu trúc (ví dụ "Đề luyện cấu trúc HSG tỉnh THPT, 4 bài, 180 phút, thang 20 điểm").
- Màn hình làm bài toàn trang: tab từng bài, đồng hồ đếm ngược (vẫn đúng khi tải lại trang), tự lưu code, nộp bất kỳ lúc nào.
- Hết giờ hoặc nộp: chấm tất cả, báo cáo điểm từng bài, từng test, thời gian làm; sau đó mới mở lời giải.
- Lịch sử các lần thi lưu trong localStorage, hiện trên `/tien-do`.

### 4.9 Thư viện bẫy (≥ 45 mục)

Mỗi mục: tên, dấu hiệu nhận biết, mức thiệt hại (mất trắng bài hay mất một phần), **code sai** và **code đúng** chạy được ngay, giải thích, bài tập liên quan. Tối thiểu gồm:

- **Đọc ghi và nộp bài:** sai tên file `.INP`/`.OUT` hoặc tên chương trình, sai chữ hoa thường; đề yêu cầu file nhưng đọc bàn phím; in thêm lời nhắc kiểu "Nhap n:"; dữ liệu nằm trên nhiều dòng hoặc nhiều số một dòng (nên đọc theo token); ký tự `\r` cuối dòng; dòng trống cuối file; quên xóa lệnh in gỡ lỗi; lưu sai thư mục hoặc sai đuôi file; file kết quả rỗng do chương trình dừng giữa chừng.
- **Tốc độ Python:** `input()` chậm khi 10⁵ dòng trở lên (dùng `sys.stdin.buffer`); `print` trong vòng lặp lớn (gom rồi `"\n".join`); cộng chuỗi trong vòng lặp; `list.pop(0)`/`insert(0, x)` là O(n) (dùng `deque`); `x in list` là O(n) (dùng `set`); đệ quy sâu gây RecursionError (tăng giới hạn hoặc khử đệ quy); code ở phạm vi toàn cục chậm hơn trong `main()`; chọn thuật toán O(n²) khi n = 10⁵.
- **Cấu trúc dữ liệu Python:** `[[0]*m]*n` làm các dòng dùng chung tham chiếu; `b = a` không sao chép list; tham số mặc định là list.
- **Số học:** `round()` làm tròn kiểu ngân hàng (`round(2.5) == 2`, `round(3.5) == 4`); định dạng số thực và `-0.00`; `//` và `%` với số âm (`-7 // 2 == -4`, `-7 % 3 == 2`) khác C++ và Pascal; so sánh số thực bằng `==`; `math.sqrt` sai với số lớn (dùng `math.isqrt`); số > 2⁵³ đổi sang float mất chính xác; `/` luôn trả số thực (`6 / 2` in ra `3.0`); quên lấy mod ở từng bước; 1 không phải số nguyên tố.
- **Logic và trường hợp biên:** n = 0, n = 1, mọi phần tử bằng nhau, số âm, giá trị lớn nhất; lệch chỉ số 0 và 1, sai cận của `range`; nhiều test trong một file mà quên khởi tạo lại; sắp xếp số dưới dạng xâu (`"10" < "9"`); "dãy con liên tiếp" khác "dãy con"; "không vượt quá" khác "nhỏ hơn"; khởi tạo max bằng 0 khi có số âm; nhiều đáp án mà đề yêu cầu đáp án nhỏ nhất theo thứ tự từ điển; đồ thị không liên thông, có cạnh lặp, có khuyên; xâu có dấu cách hoặc chữ hoa.
- **Phiên bản Python:** máy chấm có thể dùng Python cũ; tránh `match`, `math.lcm`, `itertools.pairwise`, `list[int]` trong chú thích kiểu, `str.removeprefix`, tham số `key` của `bisect` khi máy thi dưới 3.9 hoặc 3.10.
- **Chiến thuật phòng thi:** không đọc hết đề trước khi làm; sa đà một bài khó; bỏ qua điểm subtask dễ; không viết lời giải trâu để đối chiếu; không tự thử test biên và test lớn; không lưu bài thường xuyên; không kiểm tra phiên bản Python trên máy thi.

Mỗi bẫy cũng xuất hiện dạng Callout "Bẫy" ở các bài liên quan.

### 4.10 Cẩm nang

Mục lục tối thiểu (≥ 12 bài):
1. Lộ trình ôn 12 tuần cho từng cấp (Tiểu học, THCS, THPT), mỗi tuần: chủ đề, mô phỏng, bài luyện.
2. **Bảng chọn thuật toán theo giới hạn n cho Python** (ước lượng thận trọng, khoảng 10⁷ phép tính đơn giản mỗi giây, tùy máy): n ≤ 10 thì O(n!); n ≤ 20 thì O(2ⁿ); n ≤ 200 thì O(n³); n ≤ 3.000 thì O(n²); n ≤ 10⁵ đến 10⁶ thì O(n log n) hoặc O(n); n ≤ 10¹² thì O(√n); n ≤ 10¹⁸ thì O(log n). Có ghi chú vì sao ngưỡng của Python thấp hơn C++.
3. Mẫu code Python phòng thi: đọc ghi file, đọc nhanh, cấu trúc `main()`.
4. Thư viện chuẩn nên thuộc: `sys`, `math` (`gcd`, `isqrt`, `comb`), `collections` (`deque`, `Counter`, `defaultdict`), `heapq`, `bisect`, `itertools`, `functools` (`lru_cache`, `cmp_to_key`), kèm phiên bản tối thiểu.
5. Kiểm thử như người ra đề: viết lời giải trâu, viết bộ sinh test, script đối chiếu tự động (script Python chạy được trên Windows, không dùng bash).
6. Tự chấm ở nhà bằng Themis: hướng dẫn tổng quát, link chính thức `{{link Themis}}`.
7. Mười phút đầu phòng thi, phân bổ thời gian, danh sách kiểm trước khi nộp.
8. Sau kỳ thi: tự chấm, ghi nhật ký, rút kinh nghiệm.
9. **Nhật ký kỳ thi theo năm:** mẫu trang (cấu trúc đề, chủ đề xuất hiện, nhận xét xu hướng, bẫy của năm). **Chỉ điền từ đề thật người dùng cung cấp**, chưa có thì hiện trạng thái trống có hướng dẫn.
10. Mẹo theo cấp: Tiểu học (tư duy, khối lệnh), THCS (từ khối lệnh sang Python), THPT (CTDL và giải thuật).
11. Quy ước giả mã của site và cách đọc sơ đồ khối.
12. Từ điển thuật ngữ Việt Anh.

### 4.11 Tiến độ và động lực

`/tien-do`: số bài đã làm theo chủ đề và cấp độ, chuỗi ngày học, lịch sử thi thử, huy hiệu (ví dụ "Hoàn thành 10 bài cấp độ 3", "Vượt qua 5 bẫy đọc ghi file"), xuất và nhập tiến độ. Không có bảng xếp hạng (cần máy chủ và dữ liệu cá nhân). Trạng thái rỗng là màn hình "bắt đầu từ đây".

### 4.12 Trang phụ

- **Giới thiệu:** mục tiêu, ai biên soạn (`DON_VI`), cách kiểm định lời giải, cách báo lỗi.
- **Chính sách bảo mật:** không tài khoản, không cookie, không thu thập dữ liệu cá nhân; tiến độ chỉ nằm trong trình duyệt của người dùng; cách xóa (nút "Xóa toàn bộ tiến độ" có hộp xác nhận).
- **Điều khoản:** giấy phép code và nội dung, quyền tác giả của đề chính thức thuộc đơn vị ra đề.
- **Dành cho giáo viên:** gửi link bài và đề thi thử, in đề, tải bộ test Themis, gợi ý tổ chức buổi bồi dưỡng.
- Không cần banner cookie vì không dùng cookie; nêu rõ điều này trong Chính sách bảo mật.

---

## PHẦN 5. QUY TRÌNH SẢN XUẤT VÀ KIỂM ĐỊNH NỘI DUNG

### 5.1 Cấu trúc một bài trong kho đề

Frontmatter `index.mdx` (schema zod kiểm tra lúc build):

```yaml
---
id: luyen-thpt-tong-doan-con          # duy nhất, kebab case
title: "Tổng đoạn con lớn nhất"
source:
  kind: original                       # official | adapted | original
  contest: hsg-tinh-gia-lai            # khóa trong collection contests
  level: thpt
  year: null                           # chỉ điền với official hoặc adapted
  round: null
  reference: null                      # nguồn văn bản gốc
  note: "Đề luyện biên soạn theo cấu trúc HSG tỉnh THPT"
grades: [10, 11]
curriculum: ["THPT-10-F", "HSG"]
topics: ["mang-cong-don", "quy-hoach-dong"]
difficulty: 3                          # 1..5
io: { mode: file, input: "DOANCON.INP", output: "DOANCON.OUT", program: "DOANCON.PY" }
limits: { time_ms: 1000, memory_mb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 60, constraint: "n ≤ 1000" }
  - { percent: 40, constraint: "n ≤ 10^5" }
compare: tokens
traps: ["khoi-tao-max-bang-0", "doc-du-lieu-cham"]
related_algorithms: ["kadane", "mang-cong-don"]
---
```

Thân bài, đủ các mục theo thứ tự: Đề bài; Dữ liệu vào; Kết quả; Ràng buộc và subtask; Ví dụ (kèm giải thích ví dụ); Gợi ý 1; Gợi ý 2; Phân tích; Giả mã; Lời giải (nhúng tự động từ file `.py`); Độ phức tạp; Bẫy cần tránh; Mở rộng (biến thể, bài tương tự).

Các file đi kèm:
- `sol.py`: lời giải 100%.
- `sub1.py` (tùy chọn): lời giải từng phần, ghi rõ đạt subtask nào.
- `brute.py`: lời giải trâu cho n nhỏ, viết theo cách khác hẳn `sol.py`.
- `gen.py`: sinh test, nhận `seed` và tham số cỡ.
- `checker.py` (khi bài nhiều đáp án).
- `verify.json`: **chỉ do script ghi**, gồm hash `sol.py`, số test, số vòng đối chiếu, thời gian lớn nhất trên CPython, phiên bản tối thiểu theo vermin, ngày kiểm định.

Bài chỉ hiển thị khi `verify.json` tồn tại và hash khớp `sol.py` hiện tại. Thiếu thì build bỏ qua bài đó và in cảnh báo.

Ký hiệu toán: dùng Unicode và `<sup>` (10⁵, ≤, ≥, √). Không thêm KaTeX nếu không thật cần.

### 5.2 Quy trình kiểm định (`verify_content.py`)

Với mỗi bài:
1. Chạy `sol.py` trên các ví dụ trong đề, phải khớp tuyệt đối.
2. **Đối chiếu ngẫu nhiên:** ≥ 300 bộ test nhỏ từ `gen.py`, so `sol.py` với `brute.py` (hoặc qua `checker.py`). Lệch một bộ là fail, in bộ test gây lệch.
3. Sinh bộ test chính thức: ví dụ của đề, test biên (n nhỏ nhất, giá trị âm, mọi phần tử bằng nhau…), test ngẫu nhiên, test lớn nhất. Đáp án sinh từ `sol.py` **sau khi** bước 2 đã qua. Cân đối tỉ lệ test theo subtask.
4. Đo thời gian `sol.py` trên test lớn nhất bằng CPython. Vượt giới hạn thời gian thì fail, hoặc ghi chú rõ "Python khó đạt 100% bài này" nếu đó là đặc điểm có chủ đích của đề.
5. `ruff check` và `vermin -t=3.8- --no-tips` trên mọi file `.py` của bài.
6. Kiểm tra giả mã: số dòng giả mã khớp nhãn `# [Lx]` trong Python; người biên soạn (AI) tự đọc lại giả mã đối chiếu với `sol.py` và ghi xác nhận vào báo cáo.
7. Ghi `verify.json`, `public/judge/<id>/tests.json`, gói zip Themis.

Không bao giờ tự tính tay đáp án test. Không bao giờ sửa `verify.json` bằng tay.

### 5.3 Quy ước giả mã

- Từ khóa viết hoa tiếng Việt: `NHẬP`, `XUẤT`, `←` (gán), `NẾU … THÌ … NGƯỢC LẠI … HẾT NẾU`, `VỚI i TỪ a ĐẾN b LÀM … HẾT VỚI` (bao gồm cả a và b), `TRONG KHI … LÀM … HẾT KHI`, `HÀM Tên(tham số) … TRẢ VỀ … HẾT HÀM`.
- Thụt lề 4 khoảng trắng, đánh số dòng.
- **Chỉ số mảng bắt đầu từ 0 như Python**, ghi rõ ở đầu mỗi giả mã. Đề bài vẫn dùng chỉ số như đề thi (thường từ 1) và phần Phân tích giải thích cách đổi.
- Lớp 6, 7 có thêm bản "liệt kê các bước" bằng lời và sơ đồ khối khi phù hợp.

Ví dụ:

```
THUẬT TOÁN SắpXếpNổiBọt(A, n)        // chỉ số từ 0
1  VỚI i TỪ 0 ĐẾN n - 2 LÀM
2      VỚI j TỪ 0 ĐẾN n - 2 - i LÀM
3          NẾU A[j] > A[j + 1] THÌ
4              ĐỔI CHỖ A[j] VÀ A[j + 1]
5          HẾT NẾU
6      HẾT VỚI
7  HẾT VỚI
```

### 5.4 Quy ước code Python lời giải

- Chạy được trên Python 3.8 trở lên, chỉ dùng thư viện chuẩn.
- Có hàm `main()`, đọc nhanh bằng `sys.stdin.buffer`, ghi một lần.
- Mẫu đọc ghi file bật bằng một hằng số ở đầu file, đúng tên file của bài:

```python
import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DOANCON.INP", "DOANCON.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))

    # [L1] Kadane: tốt nhất kết thúc tại i
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)   # [L2]
        best = max(best, cur)   # [L3]

    out = str(best)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
```

- Chú thích tiếng Việt ngắn ở các bước then chốt, tên biến có nghĩa, PEP 8.

### 5.5 Chỉ tiêu nội dung bản 1.0 (đạt dần qua các giai đoạn, chất lượng trước số lượng)

| Loại | Chỉ tiêu |
|---|---|
| Bài học | ≥ 60 (Tiểu học 12, THCS 20, THPT 28) |
| Bài trong kho đề | ≥ 150 (THCS 60, THPT 90), phân bổ cấp độ 1 đến 5 khoảng 20%, 25%, 25%, 20%, 10% |
| Câu đố tư duy | ≥ 60 (trọng tâm Tiểu học và THCS) |
| Thuật toán mô phỏng | ≥ 30 |
| Đề thi thử | ≥ 8 (Tin học trẻ mỗi bảng ít nhất 1, HSG THCS 2, HSG THPT 3) |
| Bẫy | ≥ 45 |
| Bài SQL | ≥ 30 trên 3 CSDL |
| Bài cẩm nang | ≥ 12 |

### 5.6 Prompt mẫu: sinh một lô đề mới

```
Tạo lô bài mới cho kho đề theo Phần 5 của docs/SUPER_PROMPT.md.
- Số lượng: {{10}}
- Cấp, lớp: {{THPT lớp 10 và 11}}
- Bám cấu trúc kỳ thi: {{HSG tỉnh Gia Lai, THPT}}
- Chủ đề: {{mảng cộng dồn, hai con trỏ}}
- Cấp độ: {{2 đến 4}}
Yêu cầu: kind = original; mỗi bài đủ index.mdx, sol.py, brute.py, gen.py; chạy npm run verify:content;
chỉ giữ bài đã qua kiểm định; báo cáo danh sách bài đạt, bài bị loại và lý do; cập nhật docs/PROGRESS.md.
```

### 5.7 Prompt mẫu: nhập đề chính thức từ file

```
Tôi đã đặt đề gốc tại source-materials/{{ten-file.pdf}}.
- Nguồn: {{đơn vị ra đề, tên kỳ thi, năm học, vòng thi}}
- Chép nội dung kỹ thuật của đề đúng nguyên bản (ràng buộc, tên file, ví dụ); không sửa số liệu.
- kind = official; viết phân tích, giả mã, lời giải Python, bẫy, bộ sinh test theo Phần 5; chạy kiểm định.
- Chỗ đề mơ hồ: ghi vào mục "Nhận xét của người biên soạn", không tự sửa đề.
- Cập nhật hồ sơ kỳ thi và Nhật ký kỳ thi theo năm bằng dữ kiện có trong đề.
```

---

## PHẦN 6. LỘ TRÌNH THỰC HIỆN THEO GIAI ĐOẠN

Mỗi giai đoạn: làm từng phần nhỏ, sau mỗi phần chạy `npm run check:all` (và `verify:content` khi có nội dung), chụp màn hình 1440px và 390px ở cả Light và Dark, sửa xong mới làm tiếp. Kết thúc giai đoạn: cập nhật `docs/PROGRESS.md`, tạo commit rõ nghĩa, **dừng lại báo cáo** theo mẫu ở Phần 7.

### Giai đoạn 0 (tùy chọn): Thiết kế trong Figma

Chỉ làm khi có Figma MCP và người dùng đưa link file. Tải skill `figma-use`, `figma-generate-design`, `figma-designer` và tuân thủ hoàn toàn: trang Foundations (biến spacing, radius, Core Colors, Color System Light/Dark, text style, khung Foundations có mẫu gắn biến), trang Components (Button 5 loại × 5 trạng thái, Input đủ trạng thái, Badge cấp độ, Tag, Card, Callout, CodeBlock, bộ điều khiển mô phỏng), trang Screens (Trang chủ 1440/768/390, Trang bài tập, Trang mô phỏng, Màn hình thi thử). Tên token trong code phải trùng tên trong Figma. Không có Figma thì bỏ qua và ghi vào báo cáo.

### Giai đoạn 1: Nền móng

- Khởi tạo Astro + React + MDX + sitemap + Tailwind v4 + TypeScript strict + Vitest + Playwright + ESLint/Prettier + ruff.
- Tạo đủ file cấu hình ở 2.2, `vercel.json` ở 2.4, CI ở 2.9, `.gitignore`, `.gitattributes`, `.nvmrc`, `.editorconfig`, `CLAUDE.md`, `docs/PROGRESS.md`, `SECURITY.md`, `README.md` bản nháp.
- `tokens.css`, `theme.css`, `global.css`: toàn bộ token Phần 3, text style, reset spacing/radius/fontSize.
- `lint-design.mjs`, `check-contrast.mjs`, `copy-wasm.mjs`, `run-python.mjs`.
- `BaseLayout` (meta, OG, link bỏ qua, `theme-init.js`), Nav nổi có blur, menu di động toàn chiều cao, Footer, ThemeToggle, LevelSwitcher, trang 404, ba trang pháp lý bản nháp.
- **Nghiệm thu:** `npm ci && npm run check:all` sạch; `lint:design` 0 lỗi; tương phản đạt cả hai mode; 390px không tràn; header bảo mật đúng khi chạy preview; không lỗi console.

### Giai đoạn 2: Thư viện component và trang `/thiet-ke`

- Đủ component ở 3.9, mọi trạng thái, có unit test cho logic và test truy cập bàn phím.
- Trang `/thiet-ke` như 3.12.
- **Nghiệm thu:** mỗi component hiện đủ trạng thái ở cả hai theme; focus ring thấy rõ; không giá trị ngoài token.

### Giai đoạn 3: Trang chủ

- Trình bày dàn ý, copy hero, lợi ích, cách hoạt động, FAQ, SEO, loại bố cục (theo 4.2) trước khi code.
- Dựng lần lượt: Hero → Chọn lộ trình → Vấn đề và giải pháp → Lợi ích → Tagline hiện từng chữ → Cách hoạt động → Bằng chứng → FAQ → Lời kêu gọi cuối. Mô phỏng ở hero dùng tạm bản nhẹ, nối vào động cơ thật ở Giai đoạn 5.
- **Nghiệm thu:** một nút hành động chính trên màn hình đầu; tiêu đề hero không dấu chấm, ≤ 680px, ngắt dòng có nghĩa; tagline hiện từng chữ và tôn trọng giảm chuyển động; Lighthouse di động ≥ 90.

### Giai đoạn 4: Phòng lập trình Python

- Worker Pyodide, client, dịch lỗi tiếng Việt, đọc ghi file ảo, timeout, giới hạn output, code tracer (2.5), trang `/lap-trinh` (4.4).
- **Nghiệm thu (e2e):** `print(1 + 1)` ra `2`; `while True: pass` bị dừng sau 3 giây và trang vẫn dùng được; mẫu đọc nhanh `sys.stdin.buffer` chạy được; sai tên file `.OUT` báo đúng lỗi; tracer hiện biến qua từng bước; không lỗi CSP.

### Giai đoạn 5: Động cơ mô phỏng

- Động cơ, bộ hiển thị, bảng điều khiển, chế độ dự đoán, chế độ so sánh (2.7, 4.6). Làm trước 12 thuật toán tầng Cơ bản, rồi tầng Vận dụng, rồi Chuyên sâu (có thể tách thành 5a, 5b, 5c).
- **Nghiệm thu:** unit test kết quả cuối cho từng thuật toán; tô sáng giả mã và Python đúng dòng; lùi bước đúng trạng thái; điều khiển được hoàn toàn bằng bàn phím; ổn ở 390px.

### Giai đoạn 6: Hệ thống nội dung và lộ trình học

- Schema zod cho mọi collection, trang danh sách và chi tiết bài học, khung lộ trình 4.3 đã đối chiếu nguồn, tìm kiếm không dấu (MiniSearch, chuẩn hóa: NFD, bỏ dấu, `đ` thành `d`).
- Viết lô bài học đầu tiên (mỗi cấp ít nhất 4 bài).
- **Nghiệm thu:** nội dung sai schema làm build fail; gõ "tim kiem nhi phan" ra bài "Tìm kiếm nhị phân"; breadcrumb và quay lại hoạt động.

### Giai đoạn 7: Kho đề, chấm thử, thi thử, hồ sơ kỳ thi, thư viện bẫy

- Script kiểm định 5.2, bộ chấm 2.6, trang bài tập, bộ lọc, thi thử, hồ sơ kỳ thi (có nguồn hoặc `{{CẦN XÁC MINH}}`), thư viện bẫy.
- Lô đề đầu tiên ≥ 30 bài (THCS 12, THPT 18) và ≥ 20 bẫy, ≥ 2 đề thi thử.
- **Nghiệm thu:** mọi bài hiển thị đều có `verify.json` hợp lệ; chấm thử đúng với lời giải mẫu (100%) và với lời giải trâu (đúng subtask nhỏ); gói zip Themis đúng cấu trúc; đồng hồ thi thử đúng sau khi tải lại.

### Giai đoạn 8: Rèn luyện tư duy và lộ trình Tiểu học

- 8 động cơ câu đố, ≥ 30 câu đố đầu tiên, thử thách mỗi ngày, giao diện thân thiện cho Tiểu học (vùng bấm lớn, ít chữ). Tùy chọn: Blockly sinh code Python.
- **Nghiệm thu:** chơi được bằng chuột, cảm ứng và bàn phím; gợi ý mở dần; đạt tương phản.

### Giai đoạn 9: Phòng SQL

- sql.js tự host, 3 CSDL mẫu, ≥ 15 bài đầu tiên, chấm so khớp kết quả, nút khôi phục CSDL, ghi chú SQLite và MySQL.
- **Nghiệm thu (e2e):** truy vấn mẫu trả đúng số dòng; câu lệnh sai báo lỗi tiếng Việt dễ hiểu.

### Giai đoạn 10: Cẩm nang, tiến độ, trang giáo viên

- ≥ 12 bài cẩm nang (4.10), `/tien-do` với huy hiệu, xuất nhập tiến độ, `/giao-vien`, stylesheet in.
- **Nghiệm thu:** chặn localStorage (chế độ ẩn danh) trang vẫn chạy; nhập file JSON hỏng báo lỗi rõ ràng; bản in đề sạch.

### Giai đoạn 11: Kiểm tra tổng thể và tài liệu triển khai

- Chạy toàn bộ checklist Phần 7; Lighthouse các trang chính; kiểm tra bàn phím toàn site; `npm audit`; rà soát `SECURITY.md`; viết `README.md` hoàn chỉnh (Phần 8) và `CONTRIBUTING.md` (cách thêm bài, cách chạy kiểm định).
- **Nghiệm thu:** clone repo sạch về máy mới, `npm ci && npm run build` thành công lần đầu; deploy Vercel không cần cấu hình thêm.

### Giai đoạn 12 trở đi: Sản xuất nội dung theo lô

Lặp lại prompt 5.6 và 5.7 tới khi đạt chỉ tiêu 5.5. Mỗi lô ≤ 10 bài để kiểm soát chất lượng.

---

## PHẦN 7. ĐỊNH NGHĨA HOÀN THÀNH VÀ MẪU BÁO CÁO

### 7.1 Checklist trước khi báo cáo xong một giai đoạn

**Thiết kế**
- [ ] Mọi chữ dùng text style có tên trên thang Tailwind; một kiểu chữ (Manrope), Geist Mono chỉ cho code; không nghiêng, không quá Bold
- [ ] Mọi padding, gap, margin dùng token spacing; mọi bo góc dùng token radius và theo quy tắc lồng nhau
- [ ] Mọi màu nền, chữ, viền, icon dùng token Color System; Light và Dark đều đúng; `check:contrast` đạt
- [ ] Không gradient nền, không viền một cạnh, không eyebrow tag, không ba thẻ bằng nhau mặc định
- [ ] Tiêu đề hero ≤ 680px, không dấu chấm, ngắt dòng có nghĩa; tagline hiện từng chữ có mặt trên trang chủ
- [ ] Icon Phosphor một độ dày; chuyển động dùng đúng đường cong, chỉ transform và opacity, tôn trọng giảm chuyển động
- [ ] Component tương tác đủ trạng thái; khối dữ liệu có Loading, Empty, Error
- [ ] Không chữ giữ chỗ, không cụm sáo rỗng, không dấu gạch trong câu chữ giao diện, không link chết

**Chức năng và nội dung**
- [ ] Mọi bài hiển thị có `verify.json` hợp lệ; nhãn nguồn đúng; không đề tự soạn nào mang tên kỳ thi và năm cụ thể
- [ ] Không dữ kiện bịa; chỗ trống `{{...}}` được liệt kê
- [ ] Thông tin thể lệ có nguồn trong `docs/SOURCES.md` hoặc hiện "cần xác minh"
- [ ] Tìm không dấu hoạt động

**Kỹ thuật và bảo mật**
- [ ] `npm ci && npm run check:all` sạch; CI xanh; `npm audit --audit-level=high` sạch
- [ ] Không lỗi console, không lỗi CSP ở trang chủ, Python, SQL, mô phỏng, thi thử
- [ ] 390px không cuộn ngang; vùng bấm ≥ 44px; dùng được hoàn toàn bằng bàn phím
- [ ] Lighthouse đạt ngưỡng 2.11
- [ ] Không secret, không thu thập dữ liệu cá nhân; header bảo mật đúng

### 7.2 Mẫu báo cáo cuối mỗi giai đoạn

```
## Giai đoạn X: <tên>
Đã làm: …
Bỏ qua và lý do: …
Chưa kiểm chứng: …
Chỗ trống cần người dùng điền: {{…}}
Lệnh tự kiểm tra: npm ci; npm run check:all; npm run preview
Ảnh chụp: <đường dẫn ảnh 1440 và 390, Light và Dark>
Đề xuất giai đoạn tiếp theo: …
```

---

## PHẦN 8. ĐƯA LÊN GITHUB VÀ VERCEL (viết vào `README.md`)

**Chạy trên máy (Windows PowerShell, macOS, Linux):**
1. Cài Node LTS (theo `.nvmrc`) và Python 3.10 trở lên (chỉ cần khi kiểm định nội dung).
2. `npm ci`
3. `npm run dev`, mở `http://localhost:4321`
4. Kiểm định nội dung: `npm run verify:content`

**Đưa lên GitHub:**
1. Tạo repo mới trên GitHub (public hoặc private).
2. `git init`, `git add .`, `git commit -m "Khởi tạo Tư Duy Tin"`, `git branch -M main`, `git remote add origin <url repo>`, `git push -u origin main`.
3. Kiểm tra tab Actions: CI phải xanh.

**Triển khai Vercel:**
1. Vào vercel.com, chọn Add New, Project, Import repo vừa tạo.
2. Framework Preset: **Astro** (tự nhận). Build Command: `npm run build`. Output Directory: `dist`. **Không cần biến môi trường.**
3. Bấm Deploy. Mỗi lần push lên `main` sẽ tự triển khai; mỗi Pull Request có bản Preview riêng.
4. Tùy chọn: gắn tên miền riêng trong Settings, Domains; cập nhật `site` trong `astro.config.mjs` và `TEN_MIEN`.
5. Sau khi deploy: mở vài link sâu, tải lại trang, chạy thử Python, kiểm tra header bằng `curl -I https://<tên miền>`.

**Lỗi thường gặp khi triển khai và cách tránh (đã xử lý sẵn trong cấu hình):**
- Build trên Vercel đòi Python: không được xảy ra, vì `build` chỉ dùng Node (2.3).
- Link sâu 404 hoặc chuyển hướng vòng: đồng bộ `build.format`, `trailingSlash` của Astro với `cleanUrls`, `trailingSlash` của Vercel (2.4).
- Pyodide không tải: sai đường dẫn phiên bản hoặc thiếu `'wasm-unsafe-eval'` trong CSP.
- Test lệch do CRLF trên Windows: `.gitattributes` và bỏ `\r` khi so sánh.
- Phiên bản Node khác nhau giữa máy và Vercel: khai báo `engines` và `.nvmrc`.
