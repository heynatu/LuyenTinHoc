---
title: Kiểm thử như người ra đề
description: Viết lời giải trâu, viết bộ sinh test và một script Python đối chiếu tự động chạy được trên Windows, để tìm ra test làm lời giải sai.
order: 5
audience: ['thcs', 'thpt']
---

Người ra đề không tự tính tay đáp án. Họ có lời giải trâu chắc chắn đúng, sinh hàng trăm test nhỏ và so kết quả. Bạn làm được y như vậy trong 10 phút ở phòng thi.

## Ba file

1. `sol.py`: lời giải bạn định nộp.
2. `brute.py`: lời giải chậm nhưng chắc đúng (thử mọi khả năng), chỉ chạy với dữ liệu nhỏ.
3. `gen.py`: sinh một test ngẫu nhiên nhỏ.

Cả ba đọc ghi cùng định dạng (ví dụ cùng đọc vào chuẩn) để script so sánh được.

## Bộ sinh test

```python title="gen.py"
import random
import sys

seed = int(sys.argv[1])
rng = random.Random(seed)
n = rng.randint(1, 8)
print(n)
print(" ".join(str(rng.randint(-10, 10)) for _ in range(n)))
```

## Script đối chiếu (chạy được trên Windows, không cần bash)

```python title="doi_chieu.py"
import subprocess
import sys


def chay(file, du_lieu):
    kq = subprocess.run([sys.executable, file], input=du_lieu, capture_output=True, text=True)
    return kq.stdout.split()


for seed in range(1, 501):
    test = subprocess.run([sys.executable, "gen.py", str(seed)], capture_output=True, text=True).stdout
    if chay("sol.py", test) != chay("brute.py", test):
        print("Lệch ở seed", seed)
        print(test)
        break
else:
    print("Khớp 500 test")
```

Khi thấy lệch, chép test đó ra, chạy tay để biết lời giải nào sai. Test nhỏ dễ dò hơn test lớn rất nhiều.

> [!MEO] Kiểm tra cả tốc độ
> Sửa `gen.py` để sinh một test lớn nhất (n đúng bằng giới hạn), rồi đo thời gian `sol.py`. Xem [bẫy không thử test lớn](/bay-thuong-gap/khong-thu-test-lon).

> [!LUU-Y] Trang này cũng làm như vậy
> Mọi lời giải trong [kho đề](/luyen-de) đều được đối chiếu với lời giải trâu trên ít nhất 300 bộ test trước khi hiển thị.
