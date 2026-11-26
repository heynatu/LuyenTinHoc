---
timeComplexity: O(n log max aᵢ)
memoryComplexity: O(n)
---

## Phân tích

**Câu 1.** UCLN có tính kết hợp: UCLN(a, b, c) = UCLN(UCLN(a, b), c). Gộp dần từ trái sang phải, bắt đầu từ 0 vì UCLN(0, x) = x.

**Câu 2, cách trâu.** Thử xóa từng phần tử rồi tính lại UCLN của n − 1 số: O(n²), chỉ đạt subtask 1.

**Tiền tố và hậu tố.** Gọi T[i] là UCLN của i phần tử đầu, P[i] là UCLN từ phần tử i tới hết (chỉ số từ 0). Xóa phần tử i thì UCLN phần còn lại là UCLN(T[i], P[i + 1]). Tính T và P mất O(n), mỗi lần thử xóa O(1) phép UCLN. Đây cùng ý tưởng với mảng cộng dồn, chỉ thay phép cộng bằng phép UCLN.

## Giả mã

```pseudo
NHẬP n và dãy A
T[0] ← 0; VỚI i TỪ 0 ĐẾN n - 1 LÀM T[i + 1] ← UCLN(T[i], A[i])
P[n] ← 0; VỚI i TỪ n - 1 ĐẾN 0 (giảm dần) LÀM P[i] ← UCLN(P[i + 1], A[i])
tot ← 0
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    tot ← max(tot, UCLN(T[i], P[i + 1]))
HẾT VỚI
XUẤT T[n], tot
```

## Mở rộng

- Thay "xóa một phần tử" bằng "đổi một phần tử thành số bất kỳ": đáp án vẫn là UCLN(T[i], P[i + 1]) lớn nhất.
