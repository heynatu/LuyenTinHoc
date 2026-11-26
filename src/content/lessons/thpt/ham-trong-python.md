---
title: 'Python: hàm và đệ quy'
description: Đóng gói một việc thành hàm có tham số và giá trị trả về; hiểu phạm vi biến và đệ quy với điều kiện dừng.
level: thpt
grade: 10
strand: F
order: 3
minutes: 50
objectives:
  - Định nghĩa và gọi hàm có tham số, có return.
  - Phân biệt biến cục bộ và biến toàn cục.
  - Viết hàm đệ quy có điều kiện dừng và biết giới hạn độ sâu đệ quy.
topics: ['de-quy']
related:
  algorithms: ['thap-ha-noi', 'n-quan-hau']
  problems: ['thap-ha-noi']
  traps: ['tham-so-mac-dinh-la-list', 'de-quy-qua-sau', 'code-toan-cuc-cham']
quiz:
  - q: Hàm không có lệnh return thì trả về gì?
    options: ['0', 'None', 'Báo lỗi']
    answer: 1
    explain: Python trả về None khi hàm kết thúc mà không gặp return.
    level: nhan-biet
  - q: 'def f(n): return 1 if n == 0 else n * f(n - 1). f(4) bằng?'
    options: ['10', '24', '4']
    answer: 1
    explain: f(4) = 4 × 3 × 2 × 1 × f(0) = 24.
    level: van-dung
  - q: Đệ quy thiếu điều kiện dừng thì sao?
    options: ['Chạy mãi, cuối cùng báo RecursionError', 'Trả về 0', 'Tự dừng sau 10 lần']
    answer: 0
    explain: Hàm gọi chính nó mãi cho tới khi vượt giới hạn độ sâu.
    level: thong-hieu
  - q: Vì sao đặt code xử lý trong def main() thường chạy nhanh hơn?
    options:
      [
        'Vì biến cục bộ được truy cập nhanh hơn biến toàn cục',
        'Vì main là từ khóa đặc biệt',
        'Không nhanh hơn',
      ]
    answer: 0
    explain: CPython truy cập biến cục bộ nhanh hơn, có ích với vòng lặp lớn.
    level: van-dung-cao
---

## Định nghĩa và gọi hàm

```python title="ham.py"
def tong_chu_so(n):
    s = 0
    while n > 0:
        s += n % 10
        n //= 10
    return s


print(tong_chu_so(2026))  # 10
```

Hàm giúp chương trình ngắn, dễ đọc, dễ kiểm thử từng phần.

## Phạm vi biến

Biến gán trong hàm là **biến cục bộ**, chỉ tồn tại trong hàm. Muốn đưa dữ liệu vào hàm, dùng tham số; muốn lấy kết quả ra, dùng return.

> [!BAY] Tham số mặc định là list
> `def them(x, ds=[])` dùng chung một list cho mọi lần gọi. Xem [bẫy tham số mặc định](/bay-thuong-gap/tham-so-mac-dinh-la-list).

## Đệ quy

Hàm đệ quy gọi lại chính nó với bài toán nhỏ hơn. Luôn cần **điều kiện dừng**.

```python title="giai_thua.py"
def giai_thua(n):
    if n == 0:          # điều kiện dừng
        return 1
    return n * giai_thua(n - 1)


print(giai_thua(10))  # 3628800
```

Bài toán [Tháp Hà Nội](/mo-phong/thap-ha-noi) là ví dụ đẹp: chuyển n đĩa quy về hai lần chuyển n - 1 đĩa.

> [!BAY] Đệ quy quá sâu
> Python mặc định chỉ cho khoảng 1000 tầng gọi lồng nhau. Với dữ liệu lớn, chuyển sang vòng lặp. Xem [bẫy đệ quy quá sâu](/bay-thuong-gap/de-quy-qua-sau).

## Tự luyện

1. Viết hàm la_doi_xung(s) trả về True nếu xâu s đọc xuôi ngược như nhau.
2. Viết hàm đệ quy tính tổng các chữ số của n.
3. Làm bài [Tháp Hà Nội](/luyen-de/thap-ha-noi) (cần lũy thừa nhanh khi n lớn).
