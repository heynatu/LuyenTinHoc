---
title: Độ phức tạp thời gian
description: Ước lượng số phép tính theo kích thước dữ liệu bằng ký hiệu O lớn, từ đó chọn được thuật toán đủ nhanh trước khi viết code.
level: thpt
grade: 11
strand: F
order: 2
minutes: 50
objectives:
  - Đếm số phép tính của vòng lặp đơn, vòng lặp lồng nhau và biểu diễn bằng O lớn.
  - So sánh O(n), O(n log n), O(n²) khi n lớn.
  - Dùng ràng buộc của đề để chọn độ phức tạp phù hợp với Python.
topics: ['sap-xep', 'tim-kiem-nhi-phan']
related:
  algorithms: ['sap-xep-noi-bot', 'sap-xep-tron', 'tim-kiem-nhi-phan']
  traps: ['chon-sai-do-phuc-tap', 'sap-xep-lap-lai']
quiz:
  - q: Hai vòng lặp lồng nhau, mỗi vòng chạy n lần. Độ phức tạp là?
    options: ['O(n)', 'O(2n)', 'O(n²)']
    answer: 2
    explain: 'Vòng trong chạy n lần cho mỗi lần của vòng ngoài: n × n phép.'
    level: nhan-biet
  - q: Python làm khoảng 10⁷ phép đơn giản mỗi giây. Với n = 10⁵, thuật toán O(n²) mất khoảng bao lâu?
    options: ['0,01 giây', '1 giây', 'Khoảng 1000 giây']
    answer: 2
    explain: 10¹⁰ phép chia 10⁷ phép mỗi giây được 1000 giây.
    level: van-dung
  - q: 'Vòng lặp i = 1; while i < n: i *= 2 có độ phức tạp?'
    options: ['O(n)', 'O(log n)', 'O(1)']
    answer: 1
    explain: i tăng gấp đôi mỗi lần nên số lần lặp khoảng log₂ n.
    level: thong-hieu
  - q: Đề cho n ≤ 2000. Thuật toán nào an toàn với Python trong 1 giây?
    options: ['O(n³)', 'O(n²)', 'O(2ⁿ)']
    answer: 1
    explain: n² = 4·10⁶ phép, kịp; n³ = 8·10⁹ phép thì không.
    level: van-dung-cao
---

## Đếm số phép tính

Ta không đo bằng giây (máy nhanh chậm khác nhau) mà đếm số phép tính theo kích thước dữ liệu n, rồi giữ phần lớn nhất:

| Code                               | Số phép | Ký hiệu    |
| ---------------------------------- | ------- | ---------- |
| một vòng `for i in range(n)`       | n       | O(n)       |
| hai vòng lồng nhau, mỗi vòng n lần | n²      | O(n²)      |
| `while n > 1: n //= 2`             | log₂ n  | O(log n)   |
| `sorted(a)`                        | n log n | O(n log n) |

## Chọn thuật toán theo ràng buộc

Với Python, ước lượng thận trọng khoảng **10⁷ phép tính đơn giản mỗi giây**:

| n tối đa    | Độ phức tạp nên dùng  |
| ----------- | --------------------- |
| 10          | O(n!) thử mọi hoán vị |
| 20          | O(2ⁿ) thử mọi tập con |
| 200         | O(n³)                 |
| 3 000       | O(n²)                 |
| 10⁵ đến 10⁶ | O(n log n) hoặc O(n)  |
| 10¹²        | O(√n)                 |
| 10¹⁸        | O(log n)              |

> [!MEO] Đọc ràng buộc trước khi nghĩ thuật toán
> Ràng buộc gợi ý thuật toán. n ≤ 10⁵ gần như chắc chắn cần O(n log n): sắp xếp, tìm kiếm nhị phân, mảng cộng dồn.

> [!BAY] Python chậm hơn C++
> Cùng một thuật toán, Python có thể chậm hơn C++ từ 10 đến 50 lần. Thuật toán O(n²) với n = 10⁴ chạy kịp bằng C++ nhưng có thể quá giờ bằng Python. Xem [bẫy chọn sai độ phức tạp](/bay-thuong-gap/chon-sai-do-phuc-tap).

## So sánh trực quan

Mở [sắp xếp nổi bọt](/mo-phong/sap-xep-noi-bot) và [sắp xếp trộn](/mo-phong/sap-xep-tron) với cùng dãy 30 số giảm dần, so sánh bộ đếm số lần so sánh ở bước cuối.

## Tự luyện

1. Tính độ phức tạp của đoạn code tìm cặp có tổng bằng S bằng hai vòng lặp, và bằng sắp xếp cộng hai con trỏ.
2. Một đề có n ≤ 10⁶ và q ≤ 10⁶ truy vấn tổng đoạn. Đề xuất cách giải và tính độ phức tạp.
3. Đọc bảng chọn thuật toán đầy đủ trong [Cẩm nang](/cam-nang).
