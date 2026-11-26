---
title: Quy ước giả mã và sơ đồ khối
description: Cách đọc giả mã tiếng Việt dùng trên trang (từ khóa viết hoa, chỉ số từ 0) và các hình cơ bản của sơ đồ khối.
order: 11
audience: ['thcs', 'thpt']
---

## Giả mã

Giả mã trên trang dùng từ khóa tiếng Việt viết hoa và **chỉ số mảng bắt đầu từ 0 như Python**. Đề bài vẫn đánh số như đề thi (thường từ 1); phần Phân tích của mỗi bài giải thích cách đổi.

| Giả mã                            | Python                      | Ý nghĩa                 |
| --------------------------------- | --------------------------- | ----------------------- |
| `NHẬP n`                          | `n = int(...)`              | Đọc dữ liệu             |
| `XUẤT x`                          | `print(x)`                  | In kết quả              |
| `x ← 5`                           | `x = 5`                     | Gán                     |
| `NẾU … THÌ … NGƯỢC LẠI … HẾT NẾU` | `if … : … else: …`          | Rẽ nhánh                |
| `VỚI i TỪ a ĐẾN b LÀM … HẾT VỚI`  | `for i in range(a, b + 1):` | Lặp, gồm cả a và b      |
| `TRONG KHI … LÀM … HẾT KHI`       | `while …:`                  | Lặp khi điều kiện đúng  |
| `HÀM Ten(x) … TRẢ VỀ … HẾT HÀM`   | `def ten(x): … return …`    | Hàm                     |
| `a div b`, `a mod b`              | `a // b`, `a % b`           | Chia lấy nguyên, lấy dư |

```pseudo title="Ví dụ: tổng các số chẵn từ 1 đến n"
NHẬP n
tong ← 0
VỚI i TỪ 1 ĐẾN n LÀM
    NẾU i mod 2 = 0 THÌ tong ← tong + i
HẾT VỚI
XUẤT tong
```

> [!BAY] Cận của range
> `VỚI i TỪ 1 ĐẾN n` gồm cả n, nhưng `range(1, n)` trong Python dừng ở n − 1. Phải viết `range(1, n + 1)`.

## Sơ đồ khối

| Hình           | Ý nghĩa                             |
| -------------- | ----------------------------------- |
| Hình bầu dục   | Bắt đầu, kết thúc                   |
| Hình bình hành | Nhập, xuất dữ liệu                  |
| Hình chữ nhật  | Một bước xử lý (gán, tính)          |
| Hình thoi      | Điều kiện, có hai nhánh Đúng và Sai |
| Mũi tên        | Thứ tự thực hiện                    |

Xem thêm bài [Sơ đồ khối và ba cấu trúc](/hoc/thcs/so-do-khoi-va-ba-cau-truc).

Mỗi lời giải trong kho đề có nhãn `# [L3]` trong code Python, nghĩa là dòng đó ứng với dòng 3 của giả mã.
