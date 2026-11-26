---
title: Kiểm thử và gỡ lỗi
description: Phân biệt lỗi cú pháp, lỗi khi chạy và lỗi logic; đọc thông báo lỗi; tự tạo test biên và đối chiếu với lời giải trâu như người ra đề.
level: thpt
grade: 10
strand: F
order: 5
minutes: 50
objectives:
  - Phân biệt lỗi cú pháp, lỗi khi chạy, lỗi logic và đọc được dòng lỗi.
  - Tự thiết kế bộ test gồm test thường, test biên, test lớn.
  - Đối chiếu lời giải với lời giải trâu trên test ngẫu nhiên.
topics: []
related:
  traps: ['truong-hop-bien', 'in-debug', 'khong-doi-chieu-trau', 'khong-thu-test-lon']
quiz:
  - q: Chương trình chạy không báo lỗi nhưng in sai kết quả. Đó là lỗi gì?
    options: ['Lỗi cú pháp', 'Lỗi khi chạy', 'Lỗi logic']
    answer: 2
    explain: 'Lỗi logic: chương trình chạy được nhưng làm sai việc. Khó tìm nhất.'
    level: nhan-biet
  - q: Test nào là test biên cho bài "tìm số lớn nhất của dãy n số, 1 ≤ n ≤ 10⁵, |aᵢ| ≤ 10⁹"?
    options: ['n = 5, các số dương nhỏ', 'n = 1, a₁ = -10⁹', 'n = 100, số ngẫu nhiên']
    answer: 1
    explain: n nhỏ nhất và giá trị âm nhỏ nhất dễ làm lộ lỗi khởi tạo sai.
    level: thong-hieu
  - q: Lời giải trâu (brute force) dùng để làm gì?
    options:
      [
        'Nộp thay lời giải chính',
        'Đối chiếu kết quả với lời giải tối ưu trên test nhỏ',
        'Làm chương trình chạy nhanh hơn',
      ]
    answer: 1
    explain: Trâu chậm nhưng dễ đúng; hai lời giải khác nhau ở test nào thì test đó làm lộ lỗi.
    level: thong-hieu
  - q: In thông tin gỡ lỗi ra đâu để không ảnh hưởng chấm bài?
    options: ['print bình thường', 'sys.stderr', 'File BAI1.OUT']
    answer: 1
    explain: Máy chấm chỉ đọc stdout hoặc file kết quả, không đọc stderr.
    level: van-dung
---

## Ba loại lỗi

| Loại         | Dấu hiệu                     | Ví dụ                             |
| ------------ | ---------------------------- | --------------------------------- |
| Lỗi cú pháp  | Chưa chạy đã báo SyntaxError | quên dấu hai chấm sau if          |
| Lỗi khi chạy | Đang chạy thì dừng, báo lỗi  | chia cho 0, chỉ số vượt danh sách |
| Lỗi logic    | Chạy xong nhưng kết quả sai  | khởi tạo max = 0 khi có số âm     |

Ở [Phòng lập trình](/lap-trinh), mỗi lỗi được giải thích bằng tiếng Việt kèm số dòng và cách sửa.

## Tự thiết kế bộ test

Người ra đề luôn có ba nhóm test. Bạn cũng nên tự thử cả ba:

1. **Test thường:** dữ liệu trung bình, tính tay được.
2. **Test biên:** n nhỏ nhất, n lớn nhất, mọi phần tử bằng nhau, toàn số âm, kết quả bằng 0, không có đáp án.
3. **Test lớn:** n bằng giới hạn để đo thời gian.

## Đối chiếu với lời giải trâu

Viết thêm một lời giải chậm nhưng chắc đúng, rồi so sánh trên hàng trăm test nhỏ ngẫu nhiên. Mẫu chạy được trên Windows:

```python title="doi_chieu.py"
import random


def toi_uu(a):          # lời giải cần kiểm tra
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best


def trau(a):            # thử mọi đoạn con
    return max(sum(a[i:j + 1]) for i in range(len(a)) for j in range(i, len(a)))


for lan in range(500):
    a = [random.randint(-10, 10) for _ in range(random.randint(1, 8))]
    if toi_uu(a) != trau(a):
        print("Khác nhau ở test:", a)
        break
else:
    print("500 test đều khớp")
```

> [!MEO] Gỡ lỗi mà không làm hỏng output
> In thông tin trung gian ra `sys.stderr`: `print("i =", i, file=sys.stderr)`. Máy chấm không đọc phần này. Nhớ tắt trước khi nộp. Xem [bẫy quên xóa lệnh in](/bay-thuong-gap/in-debug).

## Tự luyện

1. Viết bộ 5 test (có test biên) cho bài "đếm số nguyên tố không vượt quá n".
2. Sửa hàm toi_uu ở trên thành phiên bản sai (khởi tạo best = 0) và xem chương trình đối chiếu tìm ra test nào.
3. Đọc mục kiểm thử trong [Cẩm nang](/cam-nang).
