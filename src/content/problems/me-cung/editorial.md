---
timeComplexity: O(m·n)
memoryComplexity: O(m·n)
---

## Phân tích

Coi mỗi ô là đỉnh của đồ thị, hai ô chung cạnh và không phải tường thì có cạnh nối. Mọi cạnh dài 1 bước, nên **tìm kiếm theo chiều rộng** (BFS) từ S cho khoảng cách ngắn nhất tới mọi ô: BFS thăm hết các ô cách 1 bước, rồi các ô cách 2 bước, và cứ thế.

Cài đặt cho nhanh: đánh số ô (i, j) thành i·n + j để dùng một mảng `d` một chiều, hàng đợi là `collections.deque`. `list.pop(0)` mất O(độ dài danh sách) mỗi lần, với 250 000 ô sẽ quá chậm.

Ô T không tới được thì `d[T]` vẫn là −1, in luôn giá trị đó.

## Giả mã

```pseudo
NHẬP m, n và lưới; tìm ô S và ô T
d[mọi ô] ← -1; d[S] ← 0; hàng đợi Q ← [S]
TRONG KHI Q khác rỗng LÀM
    u ← lấy ô đầu Q
    VỚI mỗi ô kề v của u (lên, xuống, trái, phải) LÀM
        NẾU v nằm trong lưới VÀ v không phải '#' VÀ d[v] = -1 THÌ
            d[v] ← d[u] + 1; thêm v vào cuối Q
        HẾT NẾU
    HẾT VỚI
HẾT KHI
XUẤT d[T]
```

## Mở rộng

- In đường đi: lưu ô trước của mỗi ô rồi đi ngược từ T.
- Được phá tối đa một bức tường: BFS trên trạng thái (ô, đã phá hay chưa).
