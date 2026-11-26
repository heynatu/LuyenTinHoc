# Bảo mật

## Mô hình

Website tĩnh hoàn toàn: không máy chủ ứng dụng, không API, không cơ sở dữ liệu, không tài khoản, không cookie, không biểu mẫu gửi dữ liệu, không analytics. Không có bí mật nào cần giấu: repo không cần file `.env`. Bề mặt tấn công còn lại là nội dung chạy trong trình duyệt, được kiểm soát bằng các lớp dưới đây.

## Content Security Policy: hai lớp

1. **Header** trong `vercel.json`, áp cho mọi đường dẫn:
   `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'; upgrade-insecure-requests`
2. **Thẻ meta** do Astro sinh lúc build (`security.csp` trong `astro.config.mjs`): `script-src 'self'` kèm hash SHA-256 của từng script nội tuyến; `style-src-elem 'self'` kèm hash của từng thẻ `<style>`; `style-src-attr 'unsafe-inline'`.

Trình duyệt áp **cả hai** chính sách: một tài nguyên chỉ chạy khi cả hai cho phép. Vì vậy script nội tuyến chỉ chạy khi khớp hash, dù header có `'unsafe-inline'`. Header giữ `'unsafe-inline'` vì nếu bỏ, header sẽ chặn luôn các script nội tuyến đã có hash hợp lệ của Astro. Lớp meta mới là lớp quyết định.

`style-src-attr 'unsafe-inline'` cho phép thuộc tính `style=""` (biến CSS cho hiệu ứng, kích thước động của mô phỏng). Thuộc tính style không chạy được script.

Lớp meta có thêm `'wasm-unsafe-eval'` (trong `security.csp.scriptDirective.resources`) để Pyodide và sql.js biên dịch được WebAssembly. Chỉ thị này không cho phép `eval` của JavaScript.

## Header khác (vercel.json)

| Header                     | Giá trị                                               | Mục đích                                                       |
| -------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| X-Content-Type-Options     | nosniff                                               | Chặn đoán kiểu nội dung                                        |
| Referrer-Policy            | strict-origin-when-cross-origin                       | Không lộ đường dẫn đầy đủ khi sang trang khác                  |
| Permissions-Policy         | camera, microphone, geolocation, payment, usb đều tắt | Website không cần các quyền này                                |
| X-Frame-Options            | DENY                                                  | Chống nhúng trang để lừa bấm (cùng với frame-ancestors 'none') |
| Cross-Origin-Opener-Policy | same-origin                                           | Cô lập cửa sổ                                                  |
| Strict-Transport-Security  | max-age=63072000; includeSubDomains                   | Luôn dùng HTTPS                                                |

Kiểm tra sau mỗi lần deploy: `curl -I https://<tên miền>` phải thấy đủ các header trên.

## Quy tắc code

- Không `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `set:html`, `dangerouslySetInnerHTML` với dữ liệu không đến từ repo (`npm run lint:design` chặn).
- Output chương trình của học sinh luôn hiển thị bằng `textContent`.
- Code học sinh chạy trong Web Worker có timeout; `connect-src 'self'` chặn gửi dữ liệu ra ngoài.
- Code chia sẻ qua đường dẫn không bao giờ tự chạy.
- Đọc ghi localStorage luôn qua `src/lib/storage.ts` (có try/catch). Nhập file tiến độ: giới hạn kích thước, parse JSON, kiểm tra schema, không bao giờ eval.
- Phòng HTML/CSS (nếu có): iframe `srcdoc` với `sandbox` không có `allow-scripts` và `allow-same-origin`.
- Link ngoài: `rel="noopener noreferrer"`.
- SQL của học sinh chạy trong worker riêng (`src/lib/sql/worker.ts`) trên bản sao cơ sở dữ liệu trong bộ nhớ, quá 3 giây thì worker bị dừng và tạo lại. Kết quả truy vấn hiển thị bằng `textContent`.
- Bộ chấm thử chỉ tải bộ test cùng nguồn (`/judge/<id>/tests.json`), kiểm tra cấu trúc JSON trước khi dùng; code của học sinh vẫn chạy trong worker Python có timeout.
- Ngoại lệ duy nhất của quy tắc `set:html`: khối JSON-LD FAQ ở trang chủ, dựng từ dữ liệu trong repo, đã thoát ký tự `<` (ghi `design-lint-ignore` trên đúng dòng đó).
- Tìm kiếm chạy hoàn toàn trên trình duyệt với chỉ mục tĩnh `/search-index.json`; từ khóa không gửi đi đâu và không ghi vào đường dẫn.

## Phụ thuộc

- Mọi phiên bản ghim chính xác, `package-lock.json` được commit, CI dùng `npm ci`.
- CI chạy `npm audit --audit-level=high --omit=dev`. Dependabot cập nhật npm, pip, GitHub Actions hằng tuần.
- GitHub Actions ghim theo commit SHA; workflow chỉ có quyền `contents: read`.
- `scripts/ensure-native.mjs` chỉ chạy trên Windows. Nó cài bản WebAssembly của đúng gói, đúng phiên bản đang bị App Control chặn, lấy từ npm registry, bằng `--no-save --ignore-scripts`. Script không đổi chính sách bảo mật của máy.

## Báo lỗi bảo mật

Gửi thư tới `anthuuyennguyen@gmail.com`, không đăng công khai trước khi lỗi được sửa.
