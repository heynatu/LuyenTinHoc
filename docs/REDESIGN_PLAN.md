# Kế hoạch thiết kế lại giao diện (tham khảo Coddy, Mimo)

Trạng thái: đã làm (màu mới, nút và thẻ nổi, linh vật Bít, dải chủ đề, lộ trình, lịch chuỗi ngày, trang chủ mới, PageHeader dạng khối màu, thẻ cấp học nhiều màu, nút Bắt đầu học trên thanh điều hướng). Component mới có ở /thiet-ke.

## Điểm rút ra từ hai trang tham khảo

- Màu thương hiệu tươi, nút dày có cạnh nổi bên dưới (nhấn thì lún xuống).
- Linh vật vẽ tay đặt ở hero và phần kêu gọi cuối.
- Hero có ô code minh họa, chip kết quả test, chip chuỗi ngày học.
- Dải chủ đề chạy ngang (chip thuật toán).
- Lộ trình dạng nút đánh số nối bằng đường nét đứt.
- Khối nền màu xen kẽ, lưới bento có hình minh họa nhỏ.
- Lịch chuỗi ngày học kiểu lưới ô tròn.

## Việc cần làm (giữ đúng design system trong CLAUDE.md)

1. Màu: đổi `primary.base` trong `src/design/brand.json` sang chàm tím tươi `#5B5CF0` (chữ trắng đạt khoảng 4.96:1), accent `#E8913F` (bão hòa dưới 80%). Thêm token mở rộng `surface/band` = [grayscale-850, primary-50] cho khối nền xen kẽ, ghi lý do trong `extensions`, thêm cặp tương phản trong `scripts/check-contrast.mjs`. Chạy `npm run tokens`, `npm run check:contrast`.
2. Tiện ích CSS trong `src/styles/global.css`: `raised` (box-shadow cạnh dưới bằng token, nhấn thì translateY, chỉ chuyển động transform), dùng cho nút Primary trong `recipes.ts` và thẻ chọn cấp học.
3. Component mới: `src/components/brand/Mascot.astro` (robot SVG tự vẽ, màu theo token), `TopicMarquee.astro` (chip thuật toán lấy từ `ALGORITHMS`, bản sao `aria-hidden`, dừng khi reduced motion), `Roadmap.astro` (5 chặng: Tiểu học, THCS, THPT, Luyện đề, Thi thử), `StreakCard.astro` (lịch 28 ngày từ `loadProgress().days`, chưa có dữ liệu thì hiện trạng thái trống, không bịa số).
4. Trang chủ `src/pages/index.astro`: hero chữ xoay (thuật toán, Python, SQL, tư duy; chữ tĩnh khi reduced motion), cửa sổ code minh họa cạnh linh vật, chip số liệu thật; dải chủ đề; thẻ cấp học nhiều màu (Tiểu học xanh lá, THCS chàm, THPT cam); lộ trình; khối "Học bằng cách làm" chứa Visualizer trong khung cửa sổ; bento có minh họa; khối chuỗi ngày; bẫy; khẩu hiệu; số liệu kiểm định; FAQ; kêu gọi cuối nền action-primary có linh vật.
5. Trang `/hoc`, `/hoc/[cap]`, `/luyen-de`: thẻ theo màu cấp học, nút nổi.
6. Kiểm tra: `npm run check:all`, `npm run test:e2e`, chụp 1440 và 390 ở Light và Dark, rồi commit và push lên `heynatu/LuyenTinHoc`.
