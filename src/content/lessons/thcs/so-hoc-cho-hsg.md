---
title: Số học cho học sinh giỏi
description: 'ƯCLN và BCNN bằng Euclid, kiểm tra số nguyên tố tới căn n, sàng Eratosthenes, tổng ước: những công cụ có mặt trong hầu hết đề thi.'
level: thcs
grade: null
track: hsg
strand: F
order: 1
minutes: 60
objectives:
  - Tính ƯCLN, BCNN bằng thuật toán Euclid.
  - Kiểm tra số nguyên tố chỉ với các ước tới căn bậc hai của n.
  - Dùng sàng Eratosthenes để có mọi số nguyên tố tới 10⁶.
topics: ['so-hoc', 'so-nguyen-to']
related:
  algorithms: ['euclid-ucln', 'sang-eratosthenes', 'luy-thua-nhanh']
  problems: ['ucln-cua-day', 'so-nguyen-to-trong-doan', 'tong-uoc']
  traps: ['so-1-khong-nguyen-to', 'sqrt-so-lon', 'quen-lay-du']
quiz:
  - q: ƯCLN(84, 36) bằng?
    options: ['6', '12', '18']
    answer: 1
    explain: 84 mod 36 = 12, 36 mod 12 = 0 nên ƯCLN là 12.
    level: van-dung
  - q: Để kiểm tra n có phải số nguyên tố, chỉ cần thử chia cho các số tới đâu?
    options: ['n - 1', 'n / 2', '√n']
    answer: 2
    explain: Nếu n = a × b với a ≤ b thì a ≤ √n, nên có ước thì có ước không vượt quá √n.
    level: thong-hieu
  - q: BCNN(a, b) viết thế nào để tránh số trung gian quá lớn?
    options: ['a * b // gcd(a, b)', 'a // gcd(a, b) * b', 'a * b']
    answer: 1
    explain: Chia trước rồi nhân cho số nhỏ hơn; trong Python không tràn số nhưng vẫn nhanh hơn.
    level: van-dung
  - q: Cần biết mọi số nguyên tố tới 10⁶ để trả lời 10⁵ câu hỏi. Cách nào hợp lý?
    options:
      [
        'Mỗi câu hỏi thử chia tới √n',
        'Sàng Eratosthenes một lần rồi tra cứu',
        'Thử chia tới n cho mỗi số',
      ]
    answer: 1
    explain: Sàng một lần O(N log log N), sau đó mỗi câu hỏi tra cứu O(1).
    level: van-dung-cao
---

## ƯCLN và BCNN

Thuật toán Euclid: ƯCLN(a, b) = ƯCLN(b, a mod b), dừng khi b = 0. Python có sẵn `math.gcd`.

```python title="ucln.py"
from math import gcd

def bcnn(a, b):
    return a // gcd(a, b) * b

print(gcd(84, 36), bcnn(4, 6))  # 12 12
```

Xem [mô phỏng thuật toán Euclid](/mo-phong/euclid-ucln).

> [!BAY] math.lcm cần Python 3.9
> Máy chấm có thể dùng Python cũ hơn. Tự viết hàm bcnn như trên. Xem [bẫy phiên bản Python](/bay-thuong-gap/python-cu-tren-may-cham).

## Kiểm tra số nguyên tố

```python title="la_nguyen_to.py"
def la_nt(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True
```

Dùng `d * d <= n` thay cho `d <= math.sqrt(n)` để tránh sai số số thực.

## Sàng Eratosthenes

Khi cần nhiều số nguyên tố, sàng một lần:

```python title="sang.py"
def sang(n):
    la_nt = bytearray([1]) * (n + 1)
    la_nt[0] = la_nt[1] = 0
    p = 2
    while p * p <= n:
        if la_nt[p]:
            la_nt[p * p::p] = bytearray(len(range(p * p, n + 1, p)))
        p += 1
    return la_nt
```

Phép gán lát cắt `la_nt[p * p::p] = ...` gạch mọi bội của p trong một lệnh, nhanh hơn nhiều so với vòng for trong Python. Xem [mô phỏng sàng](/mo-phong/sang-eratosthenes).

> [!MEO] Tổng ước chỉ cần đi tới căn n
> Mỗi ước d ≤ √n đi kèm ước n // d. Cộng cả hai, chú ý khi d * d = n chỉ cộng một lần. Làm bài [Tổng các ước](/luyen-de/tong-uoc).

## Tự luyện

1. Làm bài [ƯCLN của dãy số](/luyen-de/ucln-cua-day).
2. Làm bài [Số nguyên tố trong đoạn](/luyen-de/so-nguyen-to-trong-doan).
3. Viết hàm đếm số ước của n trong O(√n).
