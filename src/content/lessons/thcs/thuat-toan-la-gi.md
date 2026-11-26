---
title: Thuật toán là gì
description: Thuật toán là dãy hữu hạn các bước rõ ràng biến dữ liệu vào thành kết quả. Mô tả thuật toán bằng liệt kê các bước và giả mã.
level: thcs
grade: 6
strand: F
order: 1
minutes: 35
objectives:
  - Nêu được khái niệm thuật toán, đầu vào và đầu ra của một thuật toán.
  - Mô tả được thuật toán bằng cách liệt kê các bước.
  - Đọc được giả mã đơn giản theo quy ước của website.
topics: []
related:
  algorithms: ['tim-kiem-tuan-tu', 'euclid-ucln']
quiz:
  - q: Đầu vào của thuật toán "tìm số lớn nhất trong ba số" là gì?
    options: ['Số lớn nhất', 'Ba số cần so sánh', 'Các bước so sánh']
    answer: 1
    explain: Đầu vào là dữ liệu ta đưa cho thuật toán, ở đây là ba số. Số lớn nhất là đầu ra.
    level: nhan-biet
  - q: Dãy bước nào KHÔNG phải là thuật toán?
    options:
      [
        'Các bước giải phương trình bậc nhất',
        'Lặp lại mãi việc cộng 1 mà không bao giờ dừng',
        'Các bước tìm số lớn nhất trong ba số',
      ]
    answer: 1
    explain: Thuật toán phải dừng sau hữu hạn bước. Dãy bước chạy mãi không cho ra kết quả.
    level: thong-hieu
  - q: 'Với giả mã "lớn ← a; NẾU b > lớn THÌ lớn ← b; NẾU c > lớn THÌ lớn ← c", nếu a = 4, b = 9, c = 7 thì lớn bằng bao nhiêu?'
    options: ['4', '7', '9']
    answer: 2
    explain: Ban đầu lớn = 4, gặp b = 9 > 4 nên lớn = 9, gặp c = 7 không lớn hơn 9 nên giữ 9.
    level: van-dung
  - q: Vì sao mỗi bước của thuật toán phải rõ ràng, chỉ hiểu theo một cách?
    options:
      [
        'Để máy tính hoặc người làm theo luôn cho cùng một kết quả',
        'Để thuật toán dài hơn',
        'Để chạy nhanh hơn',
      ]
    answer: 0
    explain: Bước mơ hồ thì mỗi người hiểu một kiểu, kết quả không đoán trước được.
    level: thong-hieu
---

## Thuật toán là gì

**Thuật toán** là một dãy hữu hạn các bước rõ ràng, thực hiện theo thứ tự, biến **dữ liệu vào** (đầu vào) thành **kết quả** (đầu ra).

Một thuật toán tốt cần:

- **Dừng** sau một số hữu hạn bước.
- **Rõ ràng**: mỗi bước chỉ hiểu theo một cách.
- **Đúng**: với mọi dữ liệu vào hợp lệ đều cho kết quả đúng.

## Ví dụ: số lớn nhất trong ba số

Đầu vào: ba số a, b, c. Đầu ra: số lớn nhất.

**Cách 1, liệt kê các bước:**

1. Gán lớn bằng a.
2. Nếu b lớn hơn lớn thì gán lớn bằng b.
3. Nếu c lớn hơn lớn thì gán lớn bằng c.
4. Thông báo lớn là kết quả.

**Cách 2, giả mã.** Website dùng từ khóa viết hoa tiếng Việt và mũi tên ← cho phép gán:

```pseudo title="Số lớn nhất trong ba số"
THUẬT TOÁN LớnNhất(a, b, c)
lớn ← a
NẾU b > lớn THÌ lớn ← b
NẾU c > lớn THÌ lớn ← c
TRẢ VỀ lớn
```

**Cách 3, Python** (sẽ học kỹ ở lớp 10, có thể chạy thử ngay ở [Phòng lập trình](/lap-trinh)):

```python title="lon_nhat.py"
a, b, c = map(int, input().split())
lon = a
if b > lon:
    lon = b
if c > lon:
    lon = c
print(lon)
```

> [!MEO] Chạy tay với một bộ dữ liệu
> Lấy a = 4, b = 9, c = 7 và làm từng bước bằng bút: sau bước 1 lớn = 4, bước 2 lớn = 9, bước 3 giữ 9. Chạy tay là cách tốt nhất để hiểu và kiểm tra thuật toán.

> [!BAY] Quên trường hợp bằng nhau
> Nếu viết "NẾU b > a VÀ b > c THÌ …" cho cả ba trường hợp, khi có hai số bằng nhau và cùng lớn nhất thì không trường hợp nào đúng. Cách giữ biến lớn như trên không bị lỗi này.

## Tự luyện

1. Viết thuật toán tìm số nhỏ nhất trong bốn số bằng liệt kê các bước.
2. Viết giả mã tính tổng 1 + 2 + … + n.
3. Mở mô phỏng [Tìm kiếm tuần tự](/mo-phong/tim-kiem-tuan-tu) và nói rõ đầu vào, đầu ra của thuật toán.
