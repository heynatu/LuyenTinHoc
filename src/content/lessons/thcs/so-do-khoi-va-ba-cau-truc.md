---
title: Sơ đồ khối và ba cấu trúc điều khiển
description: Mọi thuật toán đều ghép từ ba cấu trúc tuần tự, rẽ nhánh và lặp. Biểu diễn chúng bằng sơ đồ khối và giả mã.
level: thcs
grade: 6
strand: F
order: 2
minutes: 40
objectives:
  - Nhận biết các hình cơ bản của sơ đồ khối.
  - Phân biệt cấu trúc tuần tự, rẽ nhánh và lặp.
  - Đọc và viết được sơ đồ khối cho thuật toán đơn giản.
topics: ['re-nhanh', 'vong-lap']
quiz:
  - q: Trong sơ đồ khối, hình nào dùng cho một điều kiện (câu hỏi đúng sai)?
    options: ['Hình chữ nhật', 'Hình thoi', 'Hình bầu dục']
    answer: 1
    explain: Hình thoi chứa điều kiện, có hai mũi tên đi ra cho trường hợp đúng và sai.
    level: nhan-biet
  - q: Thuật toán tính tổng 1 + 2 + … + n cần cấu trúc nào?
    options: ['Chỉ tuần tự', 'Lặp', 'Chỉ rẽ nhánh']
    answer: 1
    explain: Phép cộng được làm lại n lần nên cần cấu trúc lặp.
    level: thong-hieu
  - q: 'Đoạn giả mã: s ← 0; VỚI i TỪ 1 ĐẾN 4 LÀM s ← s + i. Sau khi chạy, s bằng bao nhiêu?'
    options: ['4', '10', '24']
    answer: 1
    explain: s = 1 + 2 + 3 + 4 = 10.
    level: van-dung
  - q: 'Với TRONG KHI n > 0 LÀM n ← n - 2, bắt đầu n = 7. Vòng lặp chạy mấy lần?'
    options: ['3 lần', '4 lần', 'Chạy mãi']
    answer: 1
    explain: 'n lần lượt là 7, 5, 3, 1 (đều > 0) rồi thành -1 thì dừng: 4 lần.'
    level: van-dung-cao
---

## Các hình của sơ đồ khối

| Hình           | Ý nghĩa                         |
| -------------- | ------------------------------- |
| Hình bầu dục   | Bắt đầu, kết thúc               |
| Hình bình hành | Nhập dữ liệu, xuất kết quả      |
| Hình chữ nhật  | Một bước xử lý, tính toán       |
| Hình thoi      | Điều kiện, có nhánh Đúng và Sai |
| Mũi tên        | Thứ tự thực hiện                |

## Ba cấu trúc điều khiển

**Tuần tự:** các bước làm lần lượt từ trên xuống.

**Rẽ nhánh:** kiểm tra điều kiện rồi chọn một trong hai nhánh.

```pseudo title="Chẵn hay lẻ"
NHẬP n
NẾU n mod 2 = 0 THÌ
    XUẤT "chẵn"
NGƯỢC LẠI
    XUẤT "lẻ"
HẾT NẾU
```

**Lặp:** làm lại một nhóm bước. Có hai kiểu: lặp với số lần biết trước (VỚI … TỪ … ĐẾN) và lặp khi điều kiện còn đúng (TRONG KHI).

```pseudo title="Tổng từ 1 đến n"
NHẬP n
s ← 0
VỚI i TỪ 1 ĐẾN n LÀM
    s ← s + i
HẾT VỚI
XUẤT s
```

Trong sơ đồ khối, vòng lặp là một hình thoi có mũi tên quay ngược lên phía trên.

> [!LUU-Y] Mọi thuật toán đều ghép từ ba cấu trúc này
> Dù phức tạp tới đâu, thuật toán cũng chỉ là tuần tự, rẽ nhánh và lặp lồng vào nhau. Khi đọc một thuật toán lạ, hãy tìm xem đâu là vòng lặp, đâu là điều kiện.

> [!BAY] Vòng lặp không bao giờ dừng
> Với TRONG KHI, phải chắc chắn có bước làm điều kiện dần trở thành sai. Quên bước n ← n - 1 thì vòng lặp chạy mãi.

## Tự luyện

1. Vẽ sơ đồ khối cho thuật toán kiểm tra một năm có phải năm nhuận (chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100).
2. Viết giả mã đếm số chữ số của số nguyên dương n bằng TRONG KHI.
3. Viết lại giả mã "Tổng từ 1 đến n" bằng Python và chạy ở [Phòng lập trình](/lap-trinh).
