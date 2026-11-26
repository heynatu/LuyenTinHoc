---
title: Thư viện chuẩn nên thuộc
description: Các mô đun có sẵn trong Python giúp viết lời giải ngắn và nhanh, kèm phiên bản Python tối thiểu để tránh lỗi trên máy chấm cũ.
order: 4
audience: ['thpt']
---

Máy chấm chỉ có thư viện chuẩn (không có numpy). Cột cuối là phiên bản Python tối thiểu; nếu không biết máy chấm dùng bản nào, hãy chọn hàm có từ 3.8 trở xuống.

| Mô đun        | Hàm hay dùng                                            | Dùng khi                       | Từ Python                                |
| ------------- | ------------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| `sys`         | `stdin.buffer.read`, `setrecursionlimit`                | Đọc nhanh, đệ quy sâu hơn      | 3.0                                      |
| `math`        | `gcd`, `isqrt`, `comb`, `prod`                          | UCLN, căn nguyên, tổ hợp       | gcd 3.5; isqrt, comb, prod 3.8           |
| `math`        | `lcm`                                                   | BCNN                           | **3.9** (bản cũ hơn: a // gcd(a, b) * b) |
| `collections` | `deque`                                                 | Hàng đợi cho BFS               | 3.0                                      |
| `collections` | `Counter`, `defaultdict`                                | Đếm tần suất, nhóm             | 3.0                                      |
| `heapq`       | `heappush`, `heappop`                                   | Dijkstra, lấy phần tử nhỏ nhất | 3.0                                      |
| `bisect`      | `bisect_left`, `bisect_right`                           | Tìm vị trí trong dãy tăng      | 3.0; tham số `key` từ **3.10**           |
| `itertools`   | `accumulate`, `combinations`, `permutations`, `product` | Cộng dồn, sinh tổ hợp          | 3.0; `accumulate(initial=)` 3.8          |
| `itertools`   | `pairwise`                                              | Duyệt từng cặp kề nhau         | **3.10**                                 |
| `functools`   | `lru_cache`                                             | Đệ quy có nhớ                  | 3.2; `cache` từ **3.9**                  |
| `functools`   | `cmp_to_key`                                            | Sắp xếp bằng hàm so sánh       | 3.2                                      |

## Ví dụ ngắn

```python title="vi_du_thu_vien.py"
from bisect import bisect_right
from collections import Counter, deque
from itertools import accumulate
from math import gcd, isqrt

a = [3, 1, 4, 1, 5, 9, 2, 6]
print(Counter(a).most_common(1))   # [(1, 2)]: số 1 xuất hiện 2 lần
print(list(accumulate(a)))         # mảng cộng dồn
b = sorted(a)
print(bisect_right(b, 4))          # 5 số không vượt quá 4
print(gcd(12, 18), isqrt(10**12))  # 6 1000000
q = deque([1, 2])
q.append(3)
print(q.popleft())                 # 1
```

> [!BAY] Hàm mới trên máy chấm cũ
> `math.lcm`, `itertools.pairwise`, `bisect(..., key=)` và lệnh `match` báo lỗi trên Python cũ. Xem [bẫy phiên bản Python](/bay-thuong-gap/python-cu-tren-may-cham).
