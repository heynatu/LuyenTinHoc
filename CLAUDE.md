# CLAUDE.md: quy tắc dự án Tư Duy Tin

Đầu mỗi phiên: đọc file này, rồi `docs/PROGRESS.md` (đang ở giai đoạn nào, còn gì chưa làm), rồi phần liên quan trong `docs/SUPER_PROMPT.md` (đặc tả đầy đủ). Cuối mỗi giai đoạn: cập nhật `docs/PROGRESS.md` và báo cáo theo mẫu ở mục 7.2 của SUPER_PROMPT.

## Sản phẩm

Website tĩnh, miễn phí, không tài khoản, giúp học sinh Tiểu học, THCS, THPT học tin học theo CT GDPT 2018, xem thuật toán chạy từng bước, chạy Python và SQL trên trình duyệt, luyện đề HSG và Tin học trẻ với lời giải Python đã kiểm chứng. Triển khai Vercel từ GitHub.

## Mười nguyên tắc bất biến

1. Không bịa dữ kiện (đề thật, năm thi, số liệu, lời chứng thực, lịch thi, thể lệ). Thiếu thì dùng chỗ trống `{{...}}` hoặc ghi "cần xác minh".
2. Lời giải phải qua `npm run verify:content` trước khi hiển thị.
3. Tĩnh 100%: không backend, không API route, không tài khoản, không cookie, không thu thập dữ liệu cá nhân. Tiến độ chỉ ở localStorage (qua `src/lib/storage.ts`, luôn có try/catch).
4. Code học sinh chỉ chạy trong Web Worker, có timeout, dừng bằng `terminate()`.
5. Design system là luật (dưới đây). `npm run lint:design` và `npm run check:contrast` phải sạch.
6. Tiếng Việt chuẩn có dấu, thuật ngữ khớp SGK.
7. Làm từng giai đoạn, từng phần; sau mỗi phần: `npm run check:all`, `npm run test:e2e`, chụp màn hình 1440px và 390px ở Light và Dark.
8. Không thêm thư viện khi chưa cần; ghim phiên bản chính xác; commit `package-lock.json`.
9. WCAG 2.2 AA: dùng được bằng bàn phím, focus ring, `lang="vi"`, không truyền trạng thái chỉ bằng màu, vùng bấm ≥ 44px.
10. Báo cáo trung thực: đã làm, bỏ qua và lý do, chưa kiểm chứng.

## Design system (tóm lược; chi tiết ở Phần 3 của SUPER_PROMPT)

- **Màu:** sửa `src/design/brand.json` (Core Colors) hoặc `src/design/color-system.json` (token ngữ nghĩa, mỗi token là `[Dark, Light]`), rồi `npm run tokens`. Không sửa tay `src/styles/tokens.css`, `src/styles/theme.css`. Component chỉ dùng lớp token ngữ nghĩa: `bg-surface-primary`, `text-text-secondary`, `border-border-primary`, `bg-action-primary`, `text-icon-info`… Không hex, không `--core-*`.
- **Token mở rộng** (ngoài danh sách gốc của skill): `text/on-action`, `text/on-warning`, `text/hero-start`, `text/hero-end`, `icon/info-inverted`. Lý do ghi trong `color-system.json`. Ba token Dark đã đổi shade để đạt tương phản, ghi ở mục `deviations`.
- **Chữ:** chỉ dùng text style có tên (`heading-1…6`, `title-1…5`, `body-1…6`, `button-lg/md/sm/xsm`, `caption-1…5`). Lớp `text-sm`, `font-semibold`… đã bị gỡ khỏi Tailwind. Font Manrope, code dùng Geist Mono. Không nghiêng, không quá Bold.
- **Khoảng cách:** `p-200` = 16px theo token `spacing-0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900`. Kích thước vùng bấm: `min-h-touch` (44px). Không có `p-5`, `m-4`.
- **Bo góc:** `rounded-0, 2, 4, 6, 8, 12, 16, 24, full`. Lồng nhau: bo trong = bo ngoài − khoảng cách (khi khoảng cách < 32 và kết quả > 2).
- **Bố cục:** `max-w-content` (1280), `max-w-reading` (880, cột đọc có code), `max-w-hero` (680), `max-w-narrow` (480). Chiều cao ô code: `h-editor` (420), `h-editor-sm` (220). Không dùng giá trị trong ngoặc vuông.
- **Nền phẳng.** Gradient chỉ cho chữ hero: `<h1><span class="text-hero-gradient">…</span></h1>`.
- **Viền đủ 4 cạnh hoặc không có.** Phân cách bằng `<div class="h-px bg-border-primary">`.
- **Chuyển động:** `ease-base` (cubic-bezier 0.22, 1, 0.36, 1), `duration-300` cho màu, 500ms cho bố cục; chỉ transform và opacity; tôn trọng `prefers-reduced-motion`.
- **Icon:** Phosphor, nhập từ `@phosphor-icons/react/ssr`, dùng tên có đuôi `Icon` (`CaretDownIcon`).
- **Mục nav trang hiện tại:** biến thể `current:` (ứng với `aria-current="page"`).
- **Lời văn:** không dấu gạch trong câu chữ giao diện, sentence case, nút là động từ + thứ nhận được, thông báo bình tĩnh không chấm than, tiêu đề hero không dấu chấm.
- **Bỏ qua lint có chủ đích:** thêm `design-lint-ignore: <lý do>` trên đúng dòng đó.

## Component (Giai đoạn 2)

- Xem mọi component và trạng thái ở `/thiet-ke`. Dùng component có sẵn trong `src/components/ui/` trước khi viết mới.
- Class của Button, IconButton, ô nhập, Badge, Tag, Card nằm trong `src/components/ui/recipes.ts`; đảo React dùng lại các hàm này, không chép class.
- Viết class trạng thái nguyên văn (Tailwind không thấy class ghép chuỗi lúc chạy).
- Nét vẽ UI cần 3:1 (viền, vòng, chấm) dùng `border-action-primary`; `action-primary` chỉ dùng làm nền tô.
- Chữ trên nền subtle có màu dùng `text-*-inverted` (hoặc `text-on-warning` cho accent): mọi cặp đã có trong `check-contrast`.
- Code và giả mã: `<CodeBlock code lang title highlight />`, `<PseudoBlock code title highlight />`; tô màu lúc build, không chèn HTML thô.
- Toast: `import { showToast } from '../lib/toast'`, thông báo bình tĩnh, cụ thể, không chấm than.
- Hộp thoại: `<Dialog id>` + nút `data-dialog-open="<id>"`; nút đóng `data-dialog-close`.
- Thêm component hoặc trạng thái mới thì thêm vào `/thiet-ke` và test e2e trong `tests/e2e/components.spec.ts`.

## Bảo mật (tóm lược; đầy đủ ở SECURITY.md)

- CSP hai lớp: header trong `vercel.json` (mọi chỉ thị) và thẻ meta Astro sinh lúc build (hash cho script và thẻ style). Script chạy được khi qua cả hai lớp, nên script nội tuyến chỉ chạy khi khớp hash.
- Không `innerHTML`, `set:html`, `dangerouslySetInnerHTML` với dữ liệu không đến từ repo. Output chương trình dùng `textContent`.
- Script khởi tạo theme nằm ở `public/theme-init.js`, nạp bằng `<script src>`.
- Pyodide và sql.js tự host dưới `/pyodide/v<phiên bản>/`, `/sqljs/v<phiên bản>/` (`scripts/copy-wasm.mjs`). Khi thêm Pyodide (Giai đoạn 4) phải thêm `'wasm-unsafe-eval'` vào `security.csp.scriptDirective.resources` trong `astro.config.mjs`.

## Lưu ý môi trường

- `npm run build` không cần Python. Python chỉ dùng cho `verify:content` (máy dev và CI).
- Trên Windows có App Control, `scripts/ensure-native.mjs` (chạy trước dev, build, typecheck, test) tự cài bản WebAssembly dự phòng cho gói native bị chặn, không đổi `package.json` hay `package-lock.json`. Cảnh báo "WASI is an experimental feature" trên máy đó là bình thường.
- Markdown dùng bộ xử lý `unified` (thuần JavaScript) và tô màu code bằng Prism (hợp CSP).

## Nội dung (Giai đoạn 6 trở đi)

- Cách thêm bài học, bài kho đề, câu đố, bài SQL, cẩm nang, đề thi thử: `CONTRIBUTING.md`.
- Bài kho đề chỉ hiện khi `verify.json` khớp băm của `sol.py` (`src/lib/problems.ts`). Sửa `sol.py` hoặc `gen.py` thì chạy lại `npm run verify:content -- <id>` và commit cả `verify.json`, `public/judge/<id>/`.
- Ví dụ của đề nằm ở `vi-du/*.inp|out`; dòng `io`, `limits`, `compare` trong frontmatter viết đúng dạng một dòng.
- YAML: giá trị có `: ` phải đặt trong nháy đơn.
- Tham chiếu chéo (bài học tới đề, bẫy, thuật toán) được kiểm tra lúc build bằng `assertRefs`; link nội bộ bằng `npm run check:links`.
- Thể lệ kỳ thi chưa có văn bản: `CAN_XAC_MINH` trong `src/data/contests.ts`; unit test chặn ghi thể lệ chưa xác minh như sự thật.
- Route động không dùng dấu gạch trong tên tham số (Astro chỉ nhận chữ, số, `_`, `$`): ví dụ `[cauDo].astro`.
