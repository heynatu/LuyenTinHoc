---
timeComplexity: O(m·n)
memoryComplexity: O(m·n)
---

## Phân tích

Duyệt mọi ô. Gặp ô đất chưa thăm thì tăng số vùng, rồi **loang** từ ô đó: đánh dấu đã thăm mọi ô đất liền với nó, đồng thời đếm số ô. Mỗi ô được thăm đúng một lần nên tổng thời gian O(m·n).

Viết loang bằng đệ quy rất gọn nhưng một vùng có thể có 250 000 ô, vượt xa giới hạn đệ quy mặc định (khoảng 1000) của Python; tăng giới hạn cũng có thể làm chương trình sập vì tràn ngăn xếp. Dùng **ngăn xếp tự quản** (DFS) hoặc `deque` (BFS): thứ tự thăm khác nhau nhưng kết quả đếm như nhau.

## Giả mã

```pseudo
NHẬP m, n và lưới
dem ← 0; lon_nhat ← 0; da_tham[mọi ô] ← SAI
VỚI mỗi ô s là '#' chưa thăm LÀM
    dem ← dem + 1; da_tham[s] ← ĐÚNG; ngăn xếp K ← [s]; co ← 0
    TRONG KHI K khác rỗng LÀM
        u ← lấy ô trên cùng K; co ← co + 1
        VỚI mỗi ô kề v của u là '#' chưa thăm LÀM
            da_tham[v] ← ĐÚNG; đặt v vào K
        HẾT VỚI
    HẾT KHI
    lon_nhat ← max(lon_nhat, co)
HẾT VỚI
XUẤT dem, lon_nhat
```

## Mở rộng

- Đếm số hồ: vùng nước không chạm biên bản đồ.
- Đồ thị cho bằng danh sách cạnh: cùng cách làm, hoặc dùng cấu trúc hợp nhất các tập rời nhau (DSU) như lời giải đối chiếu.
