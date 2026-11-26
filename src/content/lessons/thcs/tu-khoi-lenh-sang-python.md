---
title: Từ khối lệnh sang Python
description: 'Chuyển những gì đã biết ở Scratch sang Python để luyện thi học sinh giỏi lớp 9: nhập xuất, rẽ nhánh, vòng lặp, danh sách.'
level: thcs
grade: 9
strand: F
order: 1
minutes: 50
objectives:
  - Viết lại được các khối lệnh Scratch quen thuộc bằng Python.
  - Đọc dữ liệu vào và in kết quả theo đúng định dạng đề thi.
  - Dùng danh sách để lưu và xử lý nhiều số.
topics: ['vao-ra', 're-nhanh', 'vong-lap', 'mang']
related:
  problems: ['dem-so-chan-le', 'tong-chu-so']
  traps: ['in-loi-nhac', 'doc-theo-token']
quiz:
  - q: 'Khối Scratch "lặp lại 10 lần" tương ứng với dòng Python nào?'
    options: ['while 10:', 'for i in range(10):', 'repeat(10)']
    answer: 1
    explain: range(10) cho 10 giá trị 0 đến 9, vòng for chạy 10 lần.
    level: nhan-biet
  - q: Dòng nào đọc hai số nguyên trên cùng một dòng?
    options:
      ['a = int(input()); b = int(input())', 'a, b = map(int, input().split())', 'a, b = input()']
    answer: 1
    explain: split() tách dòng thành các phần theo dấu cách, map(int, …) đổi từng phần sang số.
    level: thong-hieu
  - q: Đề yêu cầu in số lượng số chẵn. Lệnh nào đúng định dạng?
    options: ['print("So chan:", dem)', 'print(dem)', 'print("dem")']
    answer: 1
    explain: Chỉ in đúng kết quả; in thêm chữ sẽ bị chấm sai.
    level: van-dung
  - q: 'range(2, 10, 3) cho các giá trị nào?'
    options: ['2, 5, 8', '2, 5, 8, 11', '3, 6, 9']
    answer: 0
    explain: Bắt đầu 2, bước 3, dừng trước 10.
    level: van-dung-cao
---

## Bảng đối chiếu Scratch và Python

| Scratch                   | Python                  |
| ------------------------- | ----------------------- |
| hỏi … và đợi              | `x = input()`           |
| nói …                     | `print(...)`            |
| đặt x thành 0             | `x = 0`                 |
| lặp lại 10 lần            | `for i in range(10):`   |
| lặp lại cho đến khi …     | `while not (...):`      |
| nếu … thì … nếu không thì | `if ...:` … `else:`     |
| danh sách                 | `a = []`, `a.append(x)` |

Khác biệt quan trọng nhất: Python dùng **thụt lề** (4 dấu cách) để biết lệnh nào nằm trong khối.

## Bài mẫu: đếm số chẵn

Đề: dòng đầu là n, dòng sau là n số nguyên. In số lượng số chẵn.

```python title="dem_chan.py"
n = int(input())
a = list(map(int, input().split()))
dem = 0
for x in a:
    if x % 2 == 0:
        dem += 1
print(dem)
```

> [!BAY] In thêm lời nhắc
> Ở Scratch ta hay viết "hỏi Nhập n và đợi". Trong đề thi, `input("Nhap n: ")` in thêm chữ và làm bài bị chấm sai. Xem [bẫy in lời nhắc](/bay-thuong-gap/in-loi-nhac).

> [!MEO] Dữ liệu có thể xuống dòng bất ngờ
> Cách an toàn: đọc hết một lần rồi tách, như mẫu dưới. Mẫu này đúng cả khi n số nằm trên nhiều dòng.

```python title="doc_an_toan.py"
import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
print(sum(1 for x in a if x % 2 == 0))
```

## Tự luyện

1. Viết lại bằng Python một chương trình Scratch bạn đã làm ở lớp 8.
2. Làm bài [Đếm số chẵn, số lẻ](/luyen-de/dem-so-chan-le).
3. Làm bài [Tổng các chữ số](/luyen-de/tong-chu-so) với n tới 18 chữ số.
