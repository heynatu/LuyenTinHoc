# Tư Duy Tin

Website miễn phí giúp học sinh Tiểu học, THCS, THPT học tin học theo chương trình GDPT 2018, xem thuật toán chạy từng bước, chạy Python và SQL ngay trên trình duyệt, và luyện đề thi học sinh giỏi, Tin học trẻ với lời giải Python đã kiểm chứng.

Repo GitHub: `LuyenTinHoc`. Địa chỉ web trên Vercel: `https://luyentinhoc.vercel.app`.

Trạng thái: **bản đầy đủ tính năng, nội dung đang bổ sung dần.** Xem `docs/PROGRESS.md`.

## Có gì trong website

| Khu vực      | Đường dẫn         | Nội dung                                                                             |
| ------------ | ----------------- | ------------------------------------------------------------------------------------ |
| Lộ trình học | `/hoc`            | 23 bài học Tiểu học, THCS, THPT theo CT GDPT 2018, có trắc nghiệm                    |
| Mô phỏng     | `/mo-phong`       | 27 thuật toán chạy từng bước, giả mã và Python tô sáng đồng bộ                       |
| Phòng Python | `/lap-trinh`      | Pyodide trong Web Worker, đọc ghi file như phòng thi, theo dõi từng dòng             |
| Phòng SQL    | `/sql`            | 3 cơ sở dữ liệu mẫu, 18 bài chấm tự động (sql.js)                                    |
| Luyện đề     | `/luyen-de`       | 23 bài có lời giải đã kiểm định, chấm thử trên trình duyệt, tải bộ test Themis       |
| Thi thử      | `/thi-thu`        | 6 đề có đồng hồ đếm ngược, chấm khi nộp                                              |
| Kỳ thi       | `/ky-thi`         | Hồ sơ HSG tỉnh Gia Lai, lưu trữ Bình Định, Tin học trẻ (thể lệ chưa xác minh ghi rõ) |
| Bẫy          | `/bay-thuong-gap` | 47 lỗi làm mất điểm, code sai và code đúng chạy thử được                             |
| Tư duy       | `/tu-duy`         | 27 câu đố tự biên soạn, 4 động cơ, thử thách mỗi ngày                                |
| Cẩm nang     | `/cam-nang`       | 12 bài: lộ trình 12 tuần, chọn thuật toán theo n, mẫu code phòng thi…                |
| Tiến độ      | `/tien-do`        | Huy hiệu, xuất nhập tiến độ (chỉ lưu trong trình duyệt)                              |
| Giáo viên    | `/giao-vien`      | Giao bài bằng link, in đề, tổ chức buổi bồi dưỡng                                    |

Tìm kiếm không dấu toàn trang: nút kính lúp trên thanh điều hướng hoặc phím `/`.

## Chạy trên máy

Cần Node.js LTS bản 22.23 trở lên (khuyên dùng bản 24, theo `.nvmrc`). Python 3.10 trở lên chỉ cần khi kiểm định nội dung.

```powershell
npm ci
```

```powershell
npm run dev
```

Mở `http://localhost:4321`.

| Lệnh                     | Việc làm                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| `npm run dev`            | Chạy bản phát triển                                                               |
| `npm run build`          | Build bản tĩnh vào `dist/` (không cần Python)                                     |
| `npm run preview`        | Xem bản build                                                                     |
| `npm run check:all`      | Lint, kiểm tra kiểu, kiểm tra design system, tương phản, test, build              |
| `npm run test:e2e`       | Test trên trình duyệt thật (chạy `npx playwright install chromium` một lần trước) |
| `npm run tokens`         | Sinh lại token màu sau khi sửa `src/design/*.json`                                |
| `npm run verify:content` | Kiểm định lời giải trong kho đề (cần Python 3.10 trở lên)                         |
| `npm run check:links`    | Kiểm tra link nội bộ và neo trong `dist/` sau khi build                           |
| `npm run preview:vercel` | Xem bản build với đúng header bảo mật của `vercel.json`                           |

### Nếu Windows báo "An Application Control policy has blocked this file"

Một số máy Windows bật App Control (Smart App Control) chặn file native của các gói vừa phát hành. `npm run dev` và `npm run build` đã tự xử lý: script `scripts/ensure-native.mjs` cài bản WebAssembly dự phòng của đúng gói đó, không đổi `package.json`. Lần đầu cần mạng. Dòng cảnh báo "WASI is an experimental feature" trên máy đó là bình thường.

## Đưa lên GitHub

> **Không tải lên bằng cách kéo thả trên trang web GitHub.** Trang web chỉ nhận tối đa 100 file mỗi lần (dự án có khoảng 470 file) và dễ sót thư mục con. Vercel sẽ báo lỗi kiểu `Cannot find module '/vercel/path0/scripts/...'`. Hãy dùng một trong hai cách dưới đây; cả hai đều đẩy đủ mọi file.

Thư mục này đã là một repo git (nhánh `main`, đã commit đủ file). Kiểm tra nhanh:

```powershell
git status
```

Phải thấy `nothing to commit, working tree clean`.

### Cách 1: GitHub Desktop (dễ nhất, không cần gõ lệnh)

1. Cài GitHub Desktop từ desktop.github.com và đăng nhập.
2. File, Add local repository, chọn thư mục `LuyenTinHoc` này.
3. Bấm **Publish repository**, đặt tên `LuyenTinHoc`, chọn Public hoặc Private, bấm Publish.

### Cách 2: dòng lệnh

1. Tạo repo mới tên `LuyenTinHoc` trên GitHub, **để trống** (không thêm README, .gitignore hay license).
2. Trong thư mục dự án:

```powershell
git remote add origin https://github.com/<tài khoản>/LuyenTinHoc.git
```

```powershell
git push -u origin main
```

Nếu repo trên GitHub đã có file từ lần tải lên trước (bị thiếu), cách gọn nhất là xóa repo đó (Settings, Danger Zone, Delete this repository), tạo repo trống mới rồi đẩy lại.

3. Mở tab Actions trên GitHub: workflow `ci` phải xanh.

Nếu repo mới tạo bằng `git init` ở máy khác: chạy `git add -A` rồi `git commit -m "Khởi tạo Tư Duy Tin"` trước khi đẩy. File `.gitignore` đã loại `node_modules`, `dist` và các thư mục tạm.

## Triển khai Vercel

1. Vào vercel.com, chọn **Add New**, **Project**, **Import** repo `LuyenTinHoc` vừa tạo. Project Name để `luyentinhoc` (Vercel chỉ nhận chữ thường nên tự đổi `LuyenTinHoc` thành `luyentinhoc`); địa chỉ web sẽ là `https://luyentinhoc.vercel.app`.
2. Framework Preset: **Astro** (tự nhận). Build Command: `npm run build`. Output Directory: `dist`. **Root Directory để trống** (file `package.json` nằm ngay gốc repo). **Không cần biến môi trường.**
3. Bấm **Deploy**. Từ đó mỗi lần push lên `main` sẽ tự triển khai; mỗi Pull Request có bản Preview riêng.
4. Nếu Vercel cấp địa chỉ khác `luyentinhoc.vercel.app` (tên đã có người dùng), hoặc bạn gắn tên miền riêng trong Settings, Domains: sửa `SITE_URL` trong `astro.config.mjs`, `url` trong `src/site.config.ts`, dòng Sitemap trong `public/robots.txt`.
5. Sau khi deploy: mở vài trang, tải lại, mở một đường dẫn sai để thấy trang 404, và kiểm tra header bảo mật:

```powershell
curl.exe -I https://luyentinhoc.vercel.app
```

## Cần điền trước khi công bố

Các chỗ trống hiển thị nguyên dạng `{{...}}` trên web cho tới khi được điền, trong `src/site.config.ts`:

- Đã điền: người biên soạn (Nguyễn An Thu Uyên) và email liên hệ (anthuuyennguyen@gmail.com).
- Giấy phép nội dung: CC BY-NC-SA 4.0 (đã điền).

Chủ sở hữu mã nguồn trong `LICENSE` đã điền.

## Cấu trúc

```
src/content/       lessons/ (bài học), problems/<id>/ (đề, lời giải, kiểm định), handbook/ (cẩm nang)
src/data/          taxonomy, traps (bẫy), contests (kỳ thi), mock-exams, puzzles, sql
src/design/        brand.json (màu lõi), color-system.json (token Light/Dark)
src/lib/           python/ (worker Pyodide), sql/ (worker sql.js), judge/ (chấm thử), viz/ (mô phỏng),
                   puzzles/, lab/, search.ts, progress.ts, storage.ts
src/components/    layout/, ui/, lab/, viz/, judge/, learn/
src/pages/         các trang; search-index.json.ts sinh chỉ mục tìm kiếm
public/judge/<id>/ bộ test JSON và gói zip Themis (do verify:content sinh)
scripts/           verify_content.py, build-tokens, lint-design, check-contrast, check-links, copy-wasm,
                   ensure-native, serve-dist, run-python
source-materials/  đề gốc (không lên web)
tests/unit, tests/e2e
docs/              SUPER_PROMPT.md (đặc tả), PROGRESS.md (tiến độ), SOURCES.md (nguồn đã tra)
```

Thêm nội dung: `CONTRIBUTING.md`. Quy tắc làm việc với dự án: `CLAUDE.md`. Bảo mật: `SECURITY.md`.

## Giấy phép

Mã nguồn: MIT (`LICENSE`). Nội dung: xem `CONTENT_LICENSE.md`.
