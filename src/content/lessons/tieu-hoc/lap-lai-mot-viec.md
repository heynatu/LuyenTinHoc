---
title: Lặp lại một việc
description: Dùng khối lặp để viết gọn những việc giống nhau làm nhiều lần, như vẽ hình vuông hay đi qua nhiều ô.
level: tieu-hoc
grade: 4
strand: F
order: 1
minutes: 30
objectives:
  - Nhận ra những bước giống nhau lặp lại trong một dãy lệnh.
  - Viết lại dãy lệnh gọn hơn bằng khối lặp lại.
  - Tính được số lần một lệnh thực hiện khi nằm trong khối lặp.
topics: ['vong-lap']
quiz:
  - q: Dãy lệnh "Tiến, Rẽ phải" lặp lại 4 lần làm robot đi theo hình gì?
    options: ['Hình tam giác', 'Hình vuông', 'Đường thẳng']
    answer: 1
    explain: Bốn cạnh bằng nhau, sau mỗi cạnh quay phải một góc vuông, robot về chỗ cũ theo hình vuông.
    level: thong-hieu
  - q: Trong khối "lặp lại 5 lần" có 2 lệnh. Có bao nhiêu lệnh được thực hiện?
    options: ['5', '7', '10']
    answer: 2
    explain: Mỗi lần lặp làm 2 lệnh, 5 lần là 2 × 5 = 10 lệnh.
    level: van-dung
  - q: Vì sao nên dùng khối lặp thay vì viết lại nhiều lần?
    options: ['Chương trình ngắn hơn, dễ sửa hơn', 'Robot chạy chậm hơn', 'Để có nhiều lệnh hơn']
    answer: 0
    explain: Muốn đổi số lần chỉ cần sửa một con số, không phải chép thêm hay xóa bớt lệnh.
    level: nhan-biet
  - q: Robot cần đi thẳng 6 ô. Cách viết nào đúng?
    options: ['Lặp lại 6 lần: Tiến', 'Lặp lại 6 lần: Rẽ phải', 'Tiến, lặp lại 6 lần']
    answer: 0
    explain: Lệnh cần lặp là Tiến, lặp 6 lần.
    level: van-dung
---

## Khi một việc lặp đi lặp lại

Muốn robot vẽ hình vuông, ta có thể viết 8 lệnh:

```text
Tiến
Rẽ phải
Tiến
Rẽ phải
Tiến
Rẽ phải
Tiến
Rẽ phải
```

Hai lệnh "Tiến, Rẽ phải" lặp lại 4 lần. Trong Scratch có khối **lặp lại** giúp viết gọn:

```text
lặp lại 4 lần
    Tiến
    Rẽ phải
```

Các lệnh nằm trong khối lặp được làm lại đủ số lần ghi trên khối.

> [!MEO] Tìm phần giống nhau
> Viết dãy lệnh dài trước, sau đó khoanh tròn đoạn lặp lại. Đoạn đó đặt vào khối lặp, số lần lặp là số lần đoạn đó xuất hiện.

## Đếm số lệnh được thực hiện

Khối lặp 5 lần chứa 2 lệnh thì robot làm 2 × 5 = 10 lệnh. Đây cũng là cách máy tính làm hàng triệu phép tính chỉ với vài dòng chương trình.

> [!BAY] Đặt lệnh ra ngoài khối lặp
> Nếu đặt lệnh Rẽ phải ở ngoài khối lặp, robot chỉ rẽ một lần sau khi đi hết các bước và không vẽ được hình vuông.

## Tự luyện

1. Viết chương trình cho robot vẽ hình chữ nhật dài 3 ô, rộng 2 ô bằng khối lặp.
2. Một chương trình có khối "lặp lại 3 lần" bên trong có "lặp lại 2 lần: Tiến". Robot tiến bao nhiêu ô?
3. Giải các câu đố robot có khối lặp ở mục [Rèn luyện tư duy](/tu-duy).
