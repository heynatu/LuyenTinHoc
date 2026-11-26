---
timeComplexity: O(n + q)
memoryComplexity: O(n)
---

## Phân tích

Cộng lại từng đoạn: O(n) mỗi câu hỏi, tổng O(n·q) = 10¹⁰ phép với giới hạn lớn nhất.

**Mảng cộng dồn.** P[i] là tổng i phần tử đầu, P[0] = 0. Đề đánh số ngày từ 1 nên tổng ngày l đến r là P[r] − P[l − 1]. Trong Python, dãy a được lưu với chỉ số từ 0 (a[0] là ngày 1), nên P[i + 1] = P[i] + a[i].

Với 10⁵ câu hỏi, đọc bằng `sys.stdin.buffer` (hoặc đọc cả file một lần) và ghi một lần. Gọi `input()` 10⁵ lần có thể làm chậm cả chương trình.

## Giả mã

```pseudo
NHẬP n, q và dãy A[0..n - 1]
P[0] ← 0
VỚI i TỪ 0 ĐẾN n - 1 LÀM P[i + 1] ← P[i] + A[i]
VỚI mỗi câu hỏi (l, r) đánh số từ 1 LÀM
    XUẤT P[r] - P[l - 1]
HẾT VỚI
```

## Mở rộng

- Có thêm thao tác "cộng x cho mọi ngày từ l đến r": dùng mảng hiệu.
- Bảng hai chiều: P[i][j] là tổng hình chữ nhật từ góc trên trái tới ô (i, j).
