---
timeComplexity: O((n + m) log m)
memoryComplexity: O(n + m)
---

## Phân tích

Độ dài các đường khác nhau nên BFS không dùng được. Mọi độ dài đều dương nên dùng **Dijkstra**: luôn lấy ra điểm có khoảng cách tạm nhỏ nhất (khoảng cách này đã là ngắn nhất vì mọi đường đi vòng qua điểm khác đều dài hơn), rồi cập nhật các điểm kề.

Cài đặt với `heapq`: thay vì sửa khoảng cách trong heap, cứ đẩy thêm cặp (khoảng cách mới, điểm). Khi lấy ra một cặp có khoảng cách lớn hơn `d[u]` hiện tại thì đó là cặp cũ, bỏ qua.

Lưu ý dữ liệu: đường hai chiều nên thêm cạnh cả hai hướng; cạnh lặp và khuyên không làm sai Dijkstra; điểm n không tới được thì in −1. Với 2·10⁵ cạnh, hãy đọc cả file một lần.

## Giả mã

```pseudo
NHẬP n, m và các con đường (u, v, w)
d[1..n] ← vô cùng; d[1] ← 0; đống H ← [(0, 1)]
TRONG KHI H khác rỗng LÀM
    lấy (du, u) có du nhỏ nhất khỏi H
    NẾU du > d[u] THÌ bỏ qua, xét phần tử tiếp theo
    VỚI mỗi đường (u, v, w) LÀM
        NẾU du + w < d[v] THÌ d[v] ← du + w; thêm (d[v], v) vào H
    HẾT VỚI
HẾT KHI
NẾU d[n] là vô cùng THÌ XUẤT -1 NGƯỢC LẠI XUẤT d[n]
```

## Mở rộng

- Đếm số đường đi ngắn nhất: khi gặp du + w = d[v] thì cộng số cách.
- Có cạnh trọng số âm: Dijkstra sai, cần Bellman Ford.
