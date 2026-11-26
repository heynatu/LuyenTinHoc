---
timeComplexity: O(n log(Σaᵢ))
memoryComplexity: O(n)
---

## Phân tích

**Subtask 1.** Quy hoạch động f[i][j]: chia i phần tử đầu thành j đoạn, thử vị trí bắt đầu của đoạn cuối. O(n²·k).

**Đổi câu hỏi.** Hàm `chia_duoc(x)`: đi từ trái sang, cộng dần vào đoạn hiện tại, khi cộng thêm sẽ vượt x thì mở đoạn mới. Cách tham lam này cho số đoạn ít nhất với giới hạn x. Nếu số đoạn ≤ k thì x làm được (đoạn nào dài có thể tách thêm cho đủ k, tổng không tăng).

**Đơn điệu.** x làm được thì x + 1 cũng làm được. Đáp án là x nhỏ nhất làm được, nằm trong [max aᵢ, Σaᵢ]. Tìm kiếm nhị phân cần khoảng log₂(10¹⁴) ≈ 47 lần kiểm tra, mỗi lần O(n).

Mẫu tìm x nhỏ nhất: giữ bất biến "đáp án nằm trong [lo, hi]"; `chia_duoc(giua)` đúng thì `hi = giua`, sai thì `lo = giua + 1`. Viết `lo = giua` sẽ lặp mãi khi hi = lo + 1.

## Giả mã

```pseudo
NHẬP n, k và dãy A
lo ← max(A); hi ← tổng A
TRONG KHI lo < hi LÀM
    giua ← (lo + hi) div 2
    NẾU ChiaDuoc(giua) THÌ hi ← giua NGƯỢC LẠI lo ← giua + 1
HẾT KHI
XUẤT lo
HÀM ChiaDuoc(x): đi từ trái sang, mở đoạn mới khi tổng sắp vượt x; TRẢ VỀ số đoạn ≤ k
```

## Mở rộng

- Đề cùng dạng: chia sách cho k người chép, xếp hàng lên k xe tải theo thứ tự, đặt k trạm sao cho khoảng cách xa nhất nhỏ nhất.
