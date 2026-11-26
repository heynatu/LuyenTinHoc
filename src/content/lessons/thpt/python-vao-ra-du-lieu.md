---
title: 'Python: nhập và xuất dữ liệu'
description: Đọc dữ liệu từ bàn phím và từ file, in kết quả đúng định dạng đề thi, đọc nhanh khi dữ liệu lớn.
level: thpt
grade: 10
strand: F
order: 1
minutes: 45
objectives:
  - Dùng input, split, map để đọc số nguyên và số thực.
  - 'In kết quả đúng định dạng: nhiều số trên một dòng, số thực có số chữ số thập phân cố định.'
  - Đọc và ghi file như phòng thi, đọc nhanh bằng sys.stdin.buffer.
topics: ['vao-ra']
related:
  problems: ['tong-chu-so', 'dem-so-chan-le']
  traps: ['doc-theo-token', 'in-loi-nhac', 'sai-ten-file', 'doc-du-lieu-cham', 'dinh-dang-so-thuc']
quiz:
  - q: input() trả về kiểu dữ liệu gì?
    options: ['Số nguyên', 'Xâu ký tự', 'Số thực']
    answer: 1
    explain: input() luôn trả về xâu; muốn số phải đổi bằng int() hoặc float().
    level: nhan-biet
  - q: In ba số a, b, c cách nhau một dấu cách. Lệnh nào đúng?
    options: ['print(a, b, c)', 'print(a + b + c)', 'print([a, b, c])']
    answer: 0
    explain: print với nhiều đối số tự chèn một dấu cách giữa chúng.
    level: thong-hieu
  - q: 'x = 2/3. Lệnh nào in "0.67"?'
    options: ['print(round(x))', 'print(f"{x:.2f}")', 'print(x)']
    answer: 1
    explain: Định dạng .2f in đúng 2 chữ số sau dấu chấm.
    level: van-dung
  - q: Dữ liệu có 10⁶ dòng. Cách đọc nào nhanh nhất?
    options: ['Gọi input() 10⁶ lần', 'sys.stdin.buffer.read().split()', 'Đọc từng ký tự']
    answer: 1
    explain: Đọc toàn bộ một lần rồi tách nhanh hơn nhiều so với gọi input() từng dòng.
    level: van-dung-cao
---

## Nhập từ bàn phím

`input()` đọc một dòng và luôn trả về **xâu**. Đổi sang số bằng `int()` hoặc `float()`.

```python title="nhap.py"
n = int(input())                       # một số trên một dòng
a, b = map(int, input().split())       # hai số trên một dòng
day = list(map(int, input().split()))  # nhiều số trên một dòng
print(n, a + b, sum(day))
```

## In kết quả

```python title="xuat.py"
a = [3, 1, 2]
print(*a)                  # 3 1 2
print(" ".join(map(str, a)))  # cách khác, cũng in 3 1 2
x = 10 / 3
print(f"{x:.2f}")          # 3.33
```

> [!BAY] In thêm chữ hoặc in cả danh sách
> `print("Ket qua:", x)` hay `print(a)` (in ra `[3, 1, 2]`) đều làm bài bị chấm sai. Chỉ in đúng những gì đề yêu cầu.

## Đọc ghi file như phòng thi

Nhiều đề yêu cầu đọc từ file `BAI1.INP`, ghi ra `BAI1.OUT`:

```python title="BAI1.PY"
with open("BAI1.INP") as f:
    data = f.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))

with open("BAI1.OUT", "w") as f:
    f.write(str(max(a)) + "\n")
```

Ở [Phòng lập trình](/lap-trinh), bật **Đọc ghi file như phòng thi** để thử đúng như vậy. Nếu đặt sai tên file, phòng lập trình báo lỗi giống máy chấm.

## Đọc nhanh khi dữ liệu lớn

```python title="doc_nhanh.py"
import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    print(sum(a))

main()
```

> [!MEO] Một mẫu cho mọi bài
> Mẫu trên vừa nhanh vừa không lo dữ liệu xuống dòng ở đâu. Xem thêm mẫu đầy đủ trong [Cẩm nang](/cam-nang).

## Tự luyện

1. Đọc n rồi n số thực, in trung bình cộng với 3 chữ số thập phân.
2. Sửa chương trình đọc file ở trên để in cả số lớn nhất và vị trí đầu tiên của nó.
3. Làm bài [Đếm số chẵn, số lẻ](/luyen-de/dem-so-chan-le) ở chế độ đọc ghi file.
