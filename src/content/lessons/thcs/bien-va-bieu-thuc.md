---
title: Biến và biểu thức
description: Biến là chiếc hộp có tên để lưu giá trị; biểu thức kết hợp biến và phép toán. Chú ý phép chia lấy nguyên và chia lấy dư.
level: thcs
grade: 8
strand: F
order: 1
minutes: 40
objectives:
  - Giải thích được biến, phép gán và giá trị của biến sau mỗi lệnh.
  - Viết được biểu thức số học với các phép + - * / // %.
  - Dùng // và % để tách chữ số, đổi đơn vị.
topics: ['so-hoc', 'vao-ra']
related:
  problems: ['tong-chu-so']
  traps: ['chia-ra-so-thuc', 'chia-nguyen-so-am']
quiz:
  - q: 'Sau các lệnh x = 5; x = x + 3; x = x * 2, x bằng bao nhiêu?'
    options: ['10', '16', '13']
    answer: 1
    explain: x = 5, rồi 8, rồi 16. Phép gán lấy giá trị bên phải, ghi đè giá trị cũ.
    level: thong-hieu
  - q: 17 // 5 và 17 % 5 lần lượt bằng?
    options: ['3 và 2', '3.4 và 2', '2 và 3']
    answer: 0
    explain: 17 = 5 × 3 + 2, thương nguyên 3, dư 2.
    level: nhan-biet
  - q: Đổi 3725 giây ra giờ, phút, giây. Biểu thức nào cho số phút?
    options: ['3725 // 60', '3725 % 3600 // 60', '3725 % 60']
    answer: 1
    explain: Bỏ phần giờ bằng % 3600 (còn 125 giây), rồi // 60 được 2 phút.
    level: van-dung
  - q: Làm thế nào lấy chữ số hàng đơn vị của số n?
    options: ['n // 10', 'n % 10', 'n / 10']
    answer: 1
    explain: Dư khi chia cho 10 chính là chữ số cuối.
    level: van-dung
---

## Biến và phép gán

**Biến** giống một chiếc hộp có tên, chứa một giá trị. Lệnh gán đặt giá trị mới vào hộp, giá trị cũ mất đi.

```python title="bien.py"
x = 5        # x là 5
x = x + 3    # tính bên phải trước: 5 + 3 = 8, rồi ghi vào x
x = x * 2    # 16
print(x)
```

Trong Scratch, khối "đặt x thành 5" và "thay đổi x một lượng 3" làm đúng việc này.

## Biểu thức và các phép toán

| Phép    | Ý nghĩa               | Ví dụ     | Kết quả |
| ------- | --------------------- | --------- | ------- |
| `+ - *` | cộng, trừ, nhân       | `7 * 3`   | `21`    |
| `/`     | chia, luôn ra số thực | `7 / 2`   | `3.5`   |
| `//`    | chia lấy phần nguyên  | `7 // 2`  | `3`     |
| `%`     | chia lấy dư           | `7 % 2`   | `1`     |
| `**`    | lũy thừa              | `2 ** 10` | `1024`  |

## Tách chữ số bằng // và %

Với số n, `n % 10` là chữ số cuối, `n // 10` bỏ đi chữ số cuối. Lặp lại cho tới khi n bằng 0 là đi qua mọi chữ số.

```python title="tong_chu_so.py"
n = int(input())
tong = 0
while n > 0:
    tong += n % 10
    n //= 10
print(tong)
```

> [!BAY] Dùng / khi cần số nguyên
> `6 / 2` ra `3.0`, in ra màn hình là 3.0 chứ không phải 3. Khi cần số nguyên, dùng `//`. Xem [bẫy phép chia ra số thực](/bay-thuong-gap/chia-ra-so-thuc).

> [!LUU-Y] Số âm
> Trong Python, `-7 // 2` bằng `-4` (làm tròn xuống), khác với một số ngôn ngữ khác. Xem [bẫy chia nguyên với số âm](/bay-thuong-gap/chia-nguyen-so-am).

## Tự luyện

1. Viết chương trình đổi số giây ra giờ, phút, giây.
2. Viết chương trình đảo ngược các chữ số của n (ví dụ 1234 thành 4321).
3. Làm bài [Tổng các chữ số](/luyen-de/tong-chu-so).
