---
title: Chọn thuật toán theo giới hạn n cho Python
description: Bảng ước lượng độ phức tạp chạy kịp trong khoảng 1 giây với Python, và vì sao ngưỡng của Python thấp hơn C++.
order: 2
audience: ['thcs', 'thpt']
---

Đọc ràng buộc trước khi nghĩ thuật toán. Ước lượng thận trọng: Python làm được khoảng **10⁷ phép tính đơn giản mỗi giây** (cộng, so sánh, truy cập list), tùy máy chấm.

| Giới hạn n      | Độ phức tạp nên dùng | Ví dụ                                             |
| --------------- | -------------------- | ------------------------------------------------- |
| n ≤ 10          | O(n!)                | Thử mọi hoán vị                                   |
| n ≤ 20          | O(2ⁿ)                | Thử mọi tập con bằng bitmask                      |
| n ≤ 200         | O(n³)                | Ba vòng lặp lồng nhau, Floyd                      |
| n ≤ 3 000       | O(n²)                | Quy hoạch động hai chiều, hai vòng lặp            |
| n ≤ 10⁵ đến 10⁶ | O(n log n) hoặc O(n) | Sắp xếp, tìm kiếm nhị phân, cộng dồn, hai con trỏ |
| n ≤ 10¹²        | O(√n)                | Duyệt ước tới căn bậc hai                         |
| n ≤ 10¹⁸        | O(log n)             | Lũy thừa nhanh, chặt nhị phân                     |

## Vì sao Python có ngưỡng thấp hơn

Python là ngôn ngữ thông dịch: mỗi phép cộng phải kiểm tra kiểu, tạo đối tượng số. Cùng một thuật toán, Python thường chậm hơn C++ từ 10 đến 50 lần. Bảng chọn thuật toán cho C++ hay viết "n ≤ 10⁴ thì O(n²)"; với Python, ngưỡng an toàn chỉ khoảng 3 000.

> [!BAY] Đúng thuật toán nhưng vẫn quá giờ
> Thuật toán O(n log n) vẫn có thể quá giờ nếu đọc dữ liệu bằng `input()` cho 10⁵ dòng hoặc `print()` trong vòng lặp. Xem [mẫu code phòng thi](/cam-nang/mau-code-phong-thi).

## Mẹo làm nhanh hơn mà không đổi thuật toán

- Đặt code trong hàm `main()`: biến cục bộ truy cập nhanh hơn biến toàn cục.
- Dùng hàm có sẵn viết bằng C: `sum`, `max`, `sorted`, `list.sort`, `str.join`, `collections.Counter`.
- Tránh tạo list mới trong vòng lặp lớn khi không cần.
- `x in set` là O(1), `x in list` là O(n).

> [!LUU-Y] Bảng chỉ là ước lượng
> Hằng số của thuật toán, tốc độ máy chấm và phiên bản Python đều ảnh hưởng. Luôn tự đo bằng test lớn nhất trước khi nộp.
