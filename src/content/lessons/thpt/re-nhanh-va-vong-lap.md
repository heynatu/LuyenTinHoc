---
title: 'Python: rẽ nhánh và vòng lặp'
description: if, elif, else để chọn việc theo điều kiện; for với range và while để lặp; break và continue để điều khiển vòng lặp.
level: thpt
grade: 10
strand: F
order: 2
minutes: 50
objectives:
  - Viết được câu lệnh if, elif, else với điều kiện kết hợp and, or, not.
  - Dùng for với range và while đúng cận, đúng điều kiện dừng.
  - Dùng break, continue và biết khi nào nên dùng.
topics: ['re-nhanh', 'vong-lap']
related:
  algorithms: ['euclid-ucln']
  problems: ['dem-so-chan-le', 'tong-chu-so']
  traps: ['lech-chi-so', 'khoi-tao-max-bang-0']
quiz:
  - q: range(1, 5) cho các giá trị nào?
    options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4']
    answer: 1
    explain: range(a, b) gồm a nhưng không gồm b.
    level: nhan-biet
  - q: 'Với x = 15, đoạn if x % 3 == 0 and x % 5 == 0: print("FizzBuzz") elif x % 3 == 0: print("Fizz") in ra?'
    options: ['Fizz', 'FizzBuzz', 'Không in gì']
    answer: 1
    explain: 15 chia hết cho cả 3 và 5 nên điều kiện đầu đúng; các nhánh elif sau không được xét.
    level: van-dung
  - q: Khi nào nên dùng while thay vì for?
    options:
      [
        'Khi biết trước số lần lặp',
        'Khi chỉ biết điều kiện dừng, không biết trước số lần',
        'Không bao giờ',
      ]
    answer: 1
    explain: Ví dụ tách chữ số của n hay thuật toán Euclid lặp tới khi một điều kiện thành sai.
    level: thong-hieu
  - q: 'Đếm số lần lặp: i = 1; while i < 100: i = i * 2'
    options: ['6', '7', '50']
    answer: 1
    explain: 'i lần lượt 1, 2, 4, 8, 16, 32, 64 (đều < 100) thì nhân thêm: 7 lần, sau đó i = 128 dừng.'
    level: van-dung-cao
---

## Rẽ nhánh

```python title="xep_loai.py"
diem = float(input())
if diem >= 8:
    print("Giỏi")
elif diem >= 6.5:
    print("Khá")
elif diem >= 5:
    print("Trung bình")
else:
    print("Chưa đạt")
```

Các nhánh được xét từ trên xuống; gặp nhánh đúng đầu tiên thì làm nhánh đó và bỏ qua các nhánh còn lại. Kết hợp điều kiện bằng `and`, `or`, `not`.

## Vòng lặp for và range

```python title="for.py"
for i in range(5):          # 0 1 2 3 4
    print(i, end=" ")
print()
for i in range(10, 0, -3):  # 10 7 4 1
    print(i, end=" ")
```

> [!BAY] Cận của range
> `range(1, n)` dừng ở n - 1. Muốn chạy tới n phải viết `range(1, n + 1)`. Xem [bẫy lệch chỉ số](/bay-thuong-gap/lech-chi-so).

## Vòng lặp while

Dùng khi chỉ biết điều kiện dừng. Mỗi vòng phải làm điều kiện tiến gần tới sai.

```python title="dem_chu_so.py"
n = int(input())
dem = 0
while n > 0:
    n //= 10
    dem += 1
print(max(dem, 1))  # số 0 vẫn có 1 chữ số
```

## break và continue

`break` thoát hẳn vòng lặp, `continue` bỏ qua phần còn lại và sang vòng sau.

```python title="tim_dau_tien.py"
a = [4, 7, 10, 13]
for x in a:
    if x % 2 == 1:
        print("Số lẻ đầu tiên:", x)
        break
```

> [!MEO] Dùng thanh Theo dõi từng dòng
> Ở [Phòng lập trình](/lap-trinh), bấm **Theo dõi từng dòng** để xem vòng lặp chạy qua từng bước và giá trị biến sau mỗi bước.

## Tự luyện

1. In bảng cửu chương 7.
2. Nhập n, in mọi ước của n theo thứ tự tăng.
3. Làm bài [Đếm số chẵn, số lẻ](/luyen-de/dem-so-chan-le).
