---
title: 'Python: list và xâu'
description: Lưu nhiều giá trị bằng list, cắt lát, list comprehension; xử lý xâu với các phương thức thường dùng trong đề thi.
level: thpt
grade: 10
strand: F
order: 4
minutes: 55
objectives:
  - Tạo, truy cập, sửa, thêm, xóa phần tử của list; dùng cắt lát.
  - Viết list comprehension; dùng sorted, sum, max, min, len.
  - Xử lý xâu với split, join, strip, lower, upper, count, đảo xâu bằng cắt lát.
topics: ['mang', 'xau']
related:
  problems: ['xau-doi-xung', 'thong-ke-chu-cai', 'dem-so-chan-le']
  traps: ['mang-hai-chieu-dung-chung', 'gan-khong-sao-chep', 'xau-bat-bien', 'sap-xep-xau-so']
quiz:
  - q: a = [10, 20, 30, 40]. a[-1] và a[1:3] là?
    options: ['40 và [20, 30]', '10 và [20, 30, 40]', '40 và [10, 20, 30]']
    answer: 0
    explain: Chỉ số -1 là phần tử cuối; cắt lát [1:3] lấy chỉ số 1, 2.
    level: nhan-biet
  - q: Đảo ngược xâu s bằng cách nào?
    options: ['s.reverse()', 's[::-1]', 'reversed(s) là xong']
    answer: 1
    explain: Xâu không có phương thức reverse; s[::-1] tạo xâu đảo.
    level: thong-hieu
  - q: '[x * x for x in range(5) if x % 2 == 0] cho kết quả?'
    options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]']
    answer: 0
    explain: x chạy 0, 2, 4 (chẵn), bình phương được 0, 4, 16.
    level: van-dung
  - q: Tạo bảng 3 dòng 4 cột toàn số 0 đúng cách?
    options: ['[[0] * 4] * 3', '[[0] * 4 for _ in range(3)]', '[0] * 12']
    answer: 1
    explain: Cách đầu tạo 3 tham chiếu tới cùng một dòng; sửa một ô cả cột đổi theo.
    level: van-dung-cao
---

## List

```python title="list.py"
a = [5, 3, 8]
a.append(1)          # [5, 3, 8, 1]
a[0] = 7             # [7, 3, 8, 1]
print(a[-1], a[1:3]) # 1 [3, 8]
print(sorted(a), sum(a), max(a), len(a))
b = [x * 2 for x in a if x > 2]  # [14, 6, 16]
print(b)
```

> [!BAY] b = a không sao chép
> Sau `b = a`, sửa b là sửa a. Dùng `b = a[:]`. Xem [bẫy gán không sao chép](/bay-thuong-gap/gan-khong-sao-chep).

## Mảng hai chiều

```python title="bang.py"
m, n = 3, 4
bang = [[0] * n for _ in range(m)]
bang[1][2] = 5
for dong in bang:
    print(*dong)
```

## Xâu

```python title="xau.py"
s = "  Gia Lai, Quy Nhon  "
t = s.strip()                 # bỏ khoảng trắng hai đầu
print(t.lower(), t.upper())
print(t.split(", "))          # ['Gia Lai', 'Quy Nhon']
print("-".join(["a", "b"]))   # a-b
print(t.count("a"), t[::-1])
```

> [!MEO] Kiểm tra xâu đối xứng
> `s == s[::-1]` là đủ. Nếu đề bỏ qua dấu cách và chữ hoa thì chuẩn hóa trước: `t = "".join(ch.lower() for ch in s if ch.isalnum())`.

> [!BAY] Xâu không sửa được tại chỗ
> `s[0] = "G"` báo lỗi. Chuyển sang list ký tự hoặc tạo xâu mới. Xem [bẫy xâu bất biến](/bay-thuong-gap/xau-bat-bien).

## Tự luyện

1. Đếm số từ trong một câu (các từ cách nhau bởi một hay nhiều dấu cách).
2. Làm bài [Xâu đối xứng](/luyen-de/xau-doi-xung).
3. Làm bài [Thống kê chữ cái](/luyen-de/thong-ke-chu-cai).
