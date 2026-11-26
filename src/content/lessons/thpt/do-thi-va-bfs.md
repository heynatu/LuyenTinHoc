---
title: Đồ thị, BFS, DFS và Dijkstra
description: Biểu diễn đồ thị bằng danh sách kề; duyệt BFS, DFS; tìm đường đi ngắn nhất không trọng số và có trọng số.
level: thpt
grade: null
track: hsg
strand: F
order: 3
minutes: 80
objectives:
  - Đọc đồ thị từ dữ liệu vào và lưu bằng danh sách kề.
  - Dùng BFS tìm đường ngắn nhất theo số cạnh, kể cả trên lưới.
  - Dùng DFS đếm thành phần liên thông; dùng Dijkstra khi có trọng số không âm.
topics: ['do-thi', 'bfs', 'dfs', 'duong-di-ngan-nhat']
related:
  algorithms: ['bfs', 'bfs-me-cung', 'dfs', 'dijkstra']
  problems: ['me-cung', 'dem-vung', 'giao-hang']
  traps: ['pop-dau-danh-sach', 'de-quy-qua-sau', 'do-thi-khong-lien-thong']
quiz:
  - q: Đồ thị có n = 10⁵ đỉnh, m = 2·10⁵ cạnh. Cách lưu nào hợp lý?
    options: ['Ma trận kề n × n', 'Danh sách kề', 'Lưu mọi cặp đỉnh']
    answer: 1
    explain: Ma trận kề cần 10¹⁰ ô; danh sách kề chỉ O(n + m).
    level: thong-hieu
  - q: BFS cho đường đi ngắn nhất khi nào?
    options:
      [
        'Mọi cạnh có cùng độ dài (tính theo số cạnh)',
        'Cạnh có trọng số bất kỳ',
        'Đồ thị có hướng mới dùng được',
      ]
    answer: 0
    explain: BFS thăm theo từng lớp số cạnh; có trọng số khác nhau thì dùng Dijkstra.
    level: nhan-biet
  - q: Trong Python, hàng đợi cho BFS nên dùng gì?
    options: ['list với pop(0)', 'collections.deque với popleft()', 'set']
    answer: 1
    explain: pop(0) của list là O(n); popleft của deque là O(1).
    level: van-dung
  - q: Dijkstra cho kết quả sai khi nào?
    options: ['Khi đồ thị vô hướng', 'Khi có cạnh trọng số âm', 'Khi có nhiều đỉnh']
    answer: 1
    explain: Dijkstra giả định đỉnh đã chốt không thể có đường ngắn hơn; cạnh âm phá vỡ điều đó.
    level: van-dung-cao
---

## Đọc đồ thị và danh sách kề

Dữ liệu thường cho n, m rồi m dòng u v (hoặc u v w):

```python title="doc_do_thi.py"
import sys

data = sys.stdin.buffer.read().split()
n, m = int(data[0]), int(data[1])
ke = [[] for _ in range(n + 1)]
for k in range(m):
    u, v = int(data[2 + 2 * k]), int(data[3 + 2 * k])
    ke[u].append(v)
    ke[v].append(u)   # bỏ dòng này nếu đồ thị có hướng
```

## BFS: ngắn nhất theo số cạnh

```python title="bfs.py"
from collections import deque

def bfs(ke, s):
    d = [-1] * len(ke)
    d[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in ke[u]:
            if d[v] == -1:
                d[v] = d[u] + 1
                q.append(v)
    return d
```

Trên lưới, mỗi ô là một đỉnh nối với 4 ô kề. Xem [mô phỏng BFS mê cung](/mo-phong/bfs-me-cung).

## DFS: đếm thành phần liên thông

Với đồ thị lớn, viết DFS bằng ngăn xếp tự quản để tránh giới hạn đệ quy:

```python title="dem_vung.py"
def dem_thanh_phan(ke, n):
    da_tham = [False] * (n + 1)
    dem = 0
    for s in range(1, n + 1):
        if da_tham[s]:
            continue
        dem += 1
        da_tham[s] = True
        stack = [s]
        while stack:
            u = stack.pop()
            for v in ke[u]:
                if not da_tham[v]:
                    da_tham[v] = True
                    stack.append(v)
    return dem
```

## Dijkstra: trọng số không âm

Dùng heapq, mỗi lần lấy đỉnh có khoảng cách tạm nhỏ nhất. Xem [mô phỏng Dijkstra](/mo-phong/dijkstra) và code Python trong đó.

> [!BAY] Đồ thị không liên thông
> Đỉnh không đến được có d = -1 (hoặc vô cùng). Đọc kỹ đề cần in gì cho trường hợp này. Xem [bẫy đồ thị không liên thông](/bay-thuong-gap/do-thi-khong-lien-thong).

> [!MEO] Đỉnh đánh số từ 1
> Tạo danh sách kề n + 1 phần tử và bỏ trống ô 0, khỏi phải trừ 1 ở mọi chỗ.

## Tự luyện

1. Làm bài [Mê cung](/luyen-de/me-cung).
2. Làm bài [Đếm vùng](/luyen-de/dem-vung).
3. Làm bài [Giao hàng](/luyen-de/giao-hang).
