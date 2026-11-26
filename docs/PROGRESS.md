# Tiến độ

## Giai đoạn hiện tại

**Giai đoạn 3 đến 11 (hoàn thiện ứng dụng): xong ngày 24/11/2026.** Tiếp theo: Giai đoạn 12, sản xuất nội dung theo lô (thêm bài học, đề, câu đố, bài SQL tới chỉ tiêu bản 1.0) và nhập đề chính thức khi có file gốc.

## Giai đoạn 3 đến 11: đã làm

- **Trang chủ** theo landing-page-design: hero có mô phỏng sắp xếp chạy thật, chọn lộ trình (bố cục lệch), vì sao mất điểm, lợi ích dạng bento, khẩu hiệu sáng dần từng chữ, ba bước, số liệu kiểm định lấy từ `verify.json` lúc build, FAQ 10 câu kèm JSON-LD, lời kêu gọi cuối giống hero. Không có lời chứng thực (chưa có dữ liệu thật).
- **Bài học:** 23 bài (Tiểu học 3, THCS 7, THPT 13 gồm 4 bài bồi dưỡng HSG), mỗi bài 4 câu trắc nghiệm đủ bốn mức.
- **Kho đề 23 bài** (độ khó 1 đến 4; 4 bài Tin học trẻ vào ra chuẩn, 19 bài HSG đọc ghi file), tất cả nhãn "Đề luyện biên soạn".
- **Kiểm định** (`scripts/content/verify_content.py`): chạy ví dụ, đối chiếu với lời giải trâu trên 300 bộ test cộng test biên, sinh test, đo thời gian, kiểm tra cú pháp Python 3.8 và nhãn giả mã, ghi `verify.json`, `public/judge/<id>/tests.json` (≤ 2 MB) và zip Themis. Chế độ `--ci` báo lỗi nếu file đã commit không khớp. Bài chỉ hiện khi băm `sol.py` khớp.
- **Bộ chấm thử** trên trình duyệt (`src/lib/judge/`, `JudgePanel.astro`): Đúng, Sai kết quả, Quá thời gian, Lỗi khi chạy, Không tìm thấy file kết quả (icon và chữ), hệ số thời gian 1, 3, 5 lần, điểm theo tỉ lệ test.
- **Trang:** `/luyen-de` (lọc 6 tiêu chí, tìm không dấu, trạng thái của tôi), `/luyen-de/[bai]` (4 tab, lời giải mở bằng nút, In đề), `/thi-thu` (6 đề, đồng hồ giữ khi tải lại, chấm khi nộp, lịch sử), `/ky-thi` (6 hồ sơ, thể lệ chưa xác minh ghi `{{CẦN XÁC MINH}}`), `/bay-thuong-gap` (47 bẫy, chạy thử code sai), `/tu-duy` (27 câu đố, 4 động cơ: robot, thẻ nhị phân, sắp xếp bước, chọn đáp án; thử thách mỗi ngày), `/sql` (3 cơ sở dữ liệu, 18 bài chấm theo tập kết quả, khôi phục dữ liệu), `/cam-nang` (12 bài), `/tien-do` (huy hiệu, theo cấp độ, chủ đề, lịch sử thi thử, xuất nhập, xóa có xác nhận), `/giao-vien`.
- **Tìm kiếm toàn trang:** MiniSearch, không dấu, `/search-index.json` sinh lúc build, nút trên thanh điều hướng và phím `/`, mũi tên và Enter; trang 404 có nút tìm kiếm.
- **Thanh điều hướng** bật đủ 5 mục; chân trang thêm nhóm Thực hành.
- **Test:** 173 unit test (thêm bộ chấm, SQL chạy mọi lời giải bằng sql.js, câu đố giải được, tìm kiếm, bộ test đã sinh, hồ sơ kỳ thi không ghi thể lệ chưa xác minh như sự thật); 67 e2e đạt, 13 bỏ qua có chủ đích (Python nặng chỉ chạy desktop; kiểm tra riêng di động chỉ chạy mobile). E2E mới: lọc kho đề, lời giải ẩn, chấm thử thật 100%, đọc sai nguồn dữ liệu, SQL, câu đố, tìm kiếm, tiến độ, thi thử. Không có vi phạm CSP.
- **Kiểm tra:** `npm run check:all` đạt (lint, Prettier, kiểu, design lint 0 vi phạm, 216 cặp tương phản, test, build 196 trang, 8142 link nội bộ hợp lệ). Màn hình 1440px và 390px, sáng và tối: không cuộn ngang.

## Hoàn thiện trước khi triển khai (26/11/2026)

- Giao diện học tập theo mẫu các web học lập trình: mục lục lộ trình cạnh bài học (bài đang xem, dấu tích bài đã học, thanh tiến độ), thẻ "Xong bài này?" với nút Học bài tiếp theo, thanh tiến độ và nút Học tiếp ở trang cấp học, ô Tiếp tục học trên trang chủ (chỉ hiện khi đã có tiến độ), tổng kết bài đã đạt theo cấp độ ở kho đề.
- Giấy phép nội dung CC BY-NC-SA 4.0. Thể lệ chưa xác minh hiện nhãn "Cần xác minh" thay vì chỗ trống thô.
- `verify_content.py --ci` chạy với ruff 0.17.6 và vermin 1.9.2 thật: 23/23 bài đạt, file kiểm định đã commit khớp.
- Clone sạch, `npm ci`, `npm run build` thành công (196 trang, 8644 link hợp lệ): giống quy trình build trên Vercel.
- Test: 173 unit, 71 e2e đạt.

## Sửa trong lúc kiểm tra

- Frontmatter YAML có `: ` không đặt nháy làm build lỗi: đã đặt nháy, ghi quy tắc vào CONTRIBUTING.
- Ngân sách 2 MB của tests.json chưa tính ký tự thoát của JSON: đo lại sau khi mã hóa.
- Prettier định dạng lại tests.json: thêm `public/judge/` và `verify.json` vào `.prettierignore`.
- 10 lỗi kiểu từ các giai đoạn trước (kiểu plugin Markdown, kiểu icon Phosphor, BigInt): đã sửa, `astro check` sạch.
- Smoke test CSP chưa tính `'wasm-unsafe-eval'`; link tiêu đề bẫy ở trang chủ cao 24px trên di động: đã sửa.

## Sai khác so với SUPER_PROMPT (giai đoạn này)

- Ví dụ của đề ở `vi-du/*.inp|out` thay vì trong frontmatter (script Python không cần thư viện YAML).
- Trang bài 4 tab (Đề bài, Gợi ý, Lời giải, Bẫy) thay vì 7 tab; Phân tích, Giả mã, Python, Độ phức tạp nằm trong tab Lời giải.
- Đề thi thử khai báo bằng TypeScript (`src/data/mock-exams.ts`) thay vì YAML.
- Chấm theo `per-test` cho mọi bài; chưa có bài `subtask` hay `checker`.
- Câu đố có 4 trong 8 động cơ (robot, thẻ nhị phân, sắp xếp bước, chọn đáp án). Quy luật dãy, đọc giả mã, cân đồng xu, suy luận, bản đồ đường đi đang chạy trên động cơ chọn đáp án.
- Chưa có chế độ dự đoán và chế độ so sánh của mô phỏng (mục 4.6).
- Máy dev chưa cài `ruff`, `vermin`: kiểm định dùng kiểm tra dự phòng; CI cài và bắt buộc.

## Nội dung so với chỉ tiêu bản 1.0 (mục 5.5)

| Loại                | Hiện có | Chỉ tiêu |
| ------------------- | ------- | -------- |
| Bài học             | 23      | 60       |
| Bài kho đề          | 23      | 150      |
| Câu đố              | 27      | 60       |
| Thuật toán mô phỏng | 27      | 30       |
| Đề thi thử          | 6       | 8        |
| Bẫy                 | 47      | 45       |
| Bài SQL             | 18      | 30       |
| Bài cẩm nang        | 12      | 12       |

**Giai đoạn 2 (thư viện component và `/thiet-ke`): xong ngày 23/11/2026.** Tiếp theo: Giai đoạn 3 (trang chủ đầy đủ theo landing-page-design).

## Giai đoạn 2: đã làm

- **Recipe class dùng chung** `src/components/ui/recipes.ts`: mỗi trạng thái viết đủ class nguyên văn (Tailwind chỉ sinh CSS cho class có trong mã nguồn). `interactive` cho dùng thật; `default`, `hover`, `pressed`, `focus`, `disabled` để trưng bày. Đảo React ở Giai đoạn 4 dùng lại recipe này.
- **Component (Astro, `src/components/ui/`):**
  - Form: Button (5 loại × 5 trạng thái × 4 cỡ), IconButton (3 loại × 5 trạng thái), Input, Textarea, Select (Default, Hover, Focus, Filled, Error, Disabled; lỗi có icon, aria-invalid, aria-describedby), Choice (Checkbox, Radio, Switch trên input gốc), ChoiceGroup (fieldset, legend).
  - Hiển thị: Badge (6 tông), LevelBadge (thước 5 vạch + chữ), SourceBadge (3 nhãn nguồn đề), Tag, Card (mặc định, link, hover, focus, đang chọn), Callout (Mẹo, Bẫy, Lưu ý, Ví dụ), Skeleton, StateView (Trống, Lỗi), ProgressRing, Stepper, Breadcrumb, Pagination.
  - Code: CodeBlock (Python, SQL, văn bản), PseudoBlock (giả mã tiếng Việt), chung khung CodeFrame: tô màu lúc build, số dòng, tô sáng dòng có dấu ▶, `data-line` cho Giai đoạn 5, nút sao chép.
  - Tương tác: Tabs + TabPanel (mẫu ARIA), Accordion (`<details>`), Dialog (`<dialog>` gốc), Tooltip (Escape ẩn), ToastRegion + `src/lib/toast.ts`.
- **Logic thuần có test:** `src/lib/highlight.ts` (Prism → dòng, không chèn HTML thô), `src/lib/pseudocode.ts`, `src/lib/ui-logic.ts` (phân trang, phím Tabs, hình học vòng tiến độ, nhãn cấp độ và nguồn).
- **Trang `/thiet-ke`** (noindex, không có trong sitemap): Core Colors, Color System (cột Sáng và Tối mỗi cột đặt mode riêng), khoảng cách, bo góc, text style, mọi component ở mọi trạng thái. Mẫu đọc thẳng biến CSS nên tự cập nhật khi đổi token.
- **Test:** 21 test đơn vị (thêm 11), 45 test e2e (thêm 20: Tabs bằng phím, Accordion, Dialog trả focus, Toast, Tooltip, sao chép code, Switch và Radio bằng phím, aria của ô lỗi, vòng tiến độ, trang thiết kế không lỗi và không lọt sitemap).
- **Tương phản:** 212 cặp đạt ở cả hai mode (thêm cặp cho núm công tắc, dấu tích, dòng code tô sáng, tooltip).

## Giai đoạn 2: sửa sau khi chụp màn hình

- Khối code bị giãn dòng do `<pre>` giữ khoảng trắng của template: `<pre>` dùng khoảng trắng thường, chỉ từng đoạn code giữ `whitespace-pre`.
- Nút vô hiệu ở mode tối trùng màu hover (cả hai là primary 700 theo bảng token gốc): chữ của trạng thái vô hiệu đổi sang `text-primary-disabled`.
- Nét vẽ UI (vòng tiến độ, viền ô đã tích, chấm radio, viền công tắc bật, bước đã xong) dùng `border-action-primary`: `action-primary` chỉ đạt 2.64 đến 2.91:1 trên nền thẻ ở mode tối.
- Checkbox lỗi chỉ báo bằng màu viền: thêm thông báo có icon.

## Giai đoạn 1: đã làm (tóm tắt)

- Astro 7.4.13 tĩnh, React 19, Tailwind 4.3, TypeScript 6 strict, sitemap; Markdown `unified` + Prism.
- Token màu sinh từ JSON (116 màu lõi, 100 token ngữ nghĩa), Tailwind chỉ còn token.
- Script `build-tokens`, `lint-design` (13 luật), `check-contrast`, `copy-wasm`, `ensure-native`, `run-python`, khung `verify_content.py`.
- Layout, thanh điều hướng, menu di động, footer, ThemeToggle, LevelSwitcher; trang chủ tạm, 404, ba trang phụ.
- `vercel.json` header bảo mật, CSP hai lớp; CI, Dependabot; ảnh chia sẻ, favicon, robots.txt.

## Quyết định và sai khác so với SUPER_PROMPT

- **Bỏ `@astrojs/mdx` tạm thời.** Nội dung Giai đoạn 6 dùng Markdown thường hoặc thêm lại MDX khi cần.
- **Markdown dùng `unified` thay Sätteri.** Trên máy có App Control cần bản WASM (`ensure-native`).
- **Prism thay Shiki**, gọi trực tiếp `prismjs` lúc build để tự dựng từng dòng.
- **CSP hai lớp** thay vì chỉ header.
- **Token mở rộng:** `text/on-action`, `text/on-warning`, `text/hero-start`, `text/hero-end`, `icon/info-inverted`.
- **Ba token Dark đổi shade** để đạt 4.5:1: `text/error`, `text/success`, `text/primary-subtle`.
- **Tiêu đề hero** "Hiểu thuật toán / Tự tin vào phòng thi" (bản cũ vượt khung 680px).
- **Component là Astro, chưa có bản React.** Bản React làm khi đảo đầu tiên cần (Giai đoạn 4), dùng chung `recipes.ts`.
- **Nền subtle có màu ở mode tối** (Callout, Badge) là màu sáng theo bảng token gốc của skill (ví dụ surface/error-subtle = red 100). Giữ nguyên; nếu muốn tối hơn thì đổi trong `color-system.json`.

## Chỗ trống cần người sở hữu điền

- Đã điền: người biên soạn, email, giấy phép nội dung (CC BY-NC-SA 4.0).
- Tên miền (mặc định `luyentinhoc.vercel.app`, repo và project Vercel tên `LuyenTinHoc`) nếu Vercel cấp địa chỉ khác

## Đổi tên

- Tên hiển thị, repo và project Vercel: LuyenTinHoc (trước đây Tư Duy Tin). Ảnh chia sẻ `public/og-default.png` đã vẽ lại với tên mới. Khóa localStorage giữ tiền tố `tdt:v1:` để không mất tiến độ.

## Thiết kế lại giao diện (tham khảo Coddy, Mimo)

- Xem `docs/REDESIGN_PLAN.md`. Màu chính `#5B5CF0`, accent `#E8913F`, token mới `surface/band`. 256 cặp tương phản đạt. Component mới trong `src/components/brand/`.

## Chưa kiểm chứng

- Header bảo mật trên Vercel thật (chỉ kiểm chứng được sau khi deploy: `curl -I`). Đã kiểm bằng `scripts/serve-dist.mjs` dùng đúng `vercel.json`.
- CI trên GitHub (chưa có repo). Đã chạy thử trên bản clone sạch: `check:all`, e2e (71 đạt, 13 bỏ qua), `verify_content.py --ci` với ruff 0.17.6 và vermin 1.9.2 (23/23 bài đạt).
- Lời giải trên Python 3.8 thật: mới kiểm cú pháp và danh sách hàm mới; chưa chạy bằng trình thông dịch 3.8.
- Thời gian chấm thử trên máy yếu và điện thoại (chỉ đo trên máy dev).
- Lighthouse; trình đọc màn hình thật (NVDA, VoiceOver).
- Thể lệ mọi kỳ thi và số hiệu văn bản hợp nhất tỉnh (xem `docs/SOURCES.md`).

## Các giai đoạn tiếp theo

12. Sản xuất nội dung theo lô tới chỉ tiêu bản 1.0 (prompt mẫu ở mục 5.6, 5.7 của SUPER_PROMPT), nhập đề chính thức khi có file gốc.
13. Chế độ dự đoán, so sánh của mô phỏng; thêm động cơ câu đố; bài `subtask` và `checker`.
