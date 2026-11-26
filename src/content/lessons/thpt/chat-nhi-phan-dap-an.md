---
title: Chặt nhị phân theo đáp án
description: Khi kiểm tra "đáp án x có làm được không" dễ hơn tìm đáp án, và tính chất đó đơn điệu, hãy tìm kiếm nhị phân trên chính đáp án.
level: thpt
grade: null
track: hsg
strand: F
order: 4
minutes: 60
objectives:
  - Nhận ra bài toán có tính đơn điệu "x được thì mọi x lớn hơn cũng được".
  - Viết hàm kiểm tra kiem_tra(x) và tìm kiếm nhị phân x nhỏ nhất thỏa mãn.
  - Dùng bisect để tìm vị trí trong dãy đã sắp xếp.
topics: ['chat-nhi-phan', 'tim-kiem-nhi-phan']
related:
  algorithms: ['tim-kiem-nhi-phan']
  problems: ['chia-day', 'dem-so-nho-hon']
  traps: ['lech-chi-so']
quiz:
  - q: Điều kiện để chặt nhị phân theo đáp án là gì?
    options:
      [
        'Dãy phải có số chẵn phần tử',
        'Hàm kiểm tra đơn điệu: x được thì x + 1 cũng được',
        'Đáp án là số nguyên tố',
      ]
    answer: 1
    explain: Nhờ đơn điệu ta biết khi kiem_tra(giữa) đúng thì đáp án nằm ở nửa bên trái (gồm giữa).
    level: nhan-biet
  - q: Đáp án nằm trong [1, 10¹⁸], mỗi lần kiểm tra O(n). Tổng độ phức tạp?
    options: ['O(n · 10¹⁸)', 'O(n · 60)', 'O(n²)']
    answer: 1
    explain: log₂(10¹⁸) ≈ 60 lần kiểm tra.
    level: van-dung
  - q: bisect_right(a, x) trên dãy tăng dần cho biết gì?
    options: ['Số phần tử nhỏ hơn x', 'Số phần tử không vượt quá x', 'Vị trí của x']
    answer: 1
    explain: bisect_right trả về chỗ chèn x bên phải mọi phần tử bằng x, bằng số phần tử ≤ x.
    level: thong-hieu
  - q: 'Vòng lặp while lo < hi: mid = (lo + hi) // 2; nếu kiem_tra(mid) thì hi = mid, ngược lại lo = mid + 1. Kết thúc lo là gì?'
    options: ['x lớn nhất không thỏa', 'x nhỏ nhất thỏa kiem_tra', 'Luôn bằng hi ban đầu']
    answer: 1
    explain: Mẫu này giữ bất biến "đáp án trong [lo, hi]" và thu hẹp tới khi lo = hi.
    level: van-dung-cao
---

## Ý tưởng

Bài "chia dãy thành k đoạn liên tiếp sao cho tổng lớn nhất của các đoạn là nhỏ nhất" khó tìm trực tiếp. Nhưng câu hỏi ngược lại dễ: **với giới hạn x, có chia được thành không quá k đoạn, mỗi đoạn tổng ≤ x không?** Chỉ cần đi từ trái sang, đoạn nào sắp vượt x thì mở đoạn mới.

Nếu x làm được thì mọi x lớn hơn cũng làm được: tính chất **đơn điệu**. Vậy tìm x nhỏ nhất bằng tìm kiếm nhị phân.

```python title="chia_day.py"
def kiem_tra(a, k, x):
    so_doan, tong = 1, 0
    for v in a:
        if v > x:
            return False
        if tong + v > x:
            so_doan += 1
            tong = v
        else:
            tong += v
    return so_doan <= k


def chia_day(a, k):
    lo, hi = max(a), sum(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if kiem_tra(a, k, mid):
            hi = mid
        else:
            lo = mid + 1
    return lo


print(chia_day([7, 2, 5, 10, 8], 2))  # 18: [7, 2, 5] và [10, 8]
```

> [!MEO] Mẫu tìm x nhỏ nhất thỏa mãn
> Giữ bất biến "đáp án nằm trong [lo, hi]". Khi kiem_tra(mid) đúng thì hi = mid (mid có thể là đáp án), sai thì lo = mid + 1. Dừng khi lo = hi.

## bisect trong thư viện chuẩn

Trên dãy đã sắp xếp:

```python title="bisect_vi_du.py"
from bisect import bisect_left, bisect_right

a = [1, 3, 3, 5, 8]
print(bisect_left(a, 3), bisect_right(a, 3))  # 1 3
print(bisect_right(a, 4))  # 3 số không vượt quá 4
```

> [!BAY] Vòng lặp không dừng
> Viết `lo = mid` thay vì `lo = mid + 1` có thể lặp mãi khi hi = lo + 1. Chạy tay với hai giá trị cuối để kiểm tra.

## Tự luyện

1. Làm bài [Chia dãy](/luyen-de/chia-day).
2. Làm bài [Đếm số không vượt quá](/luyen-de/dem-so-nho-hon) bằng bisect.
3. Tìm căn bậc ba nguyên của n ≤ 10¹⁸ bằng chặt nhị phân.
