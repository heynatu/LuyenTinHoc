---
timeComplexity: O(m·S)
memoryComplexity: O(S)
---

## Phân tích

**Tham lam sai.** Lấy tờ lớn nhất trước đúng với bộ mệnh giá tiền Việt Nam nhưng sai với bộ tùy ý: mệnh giá 1, 3, 4 và S = 6 cho 3 tờ thay vì 2.

**Quy hoạch động.** f[s] là số tờ ít nhất để được s đồng, f[0] = 0. Tờ cuối cùng có mệnh giá c nào đó (c ≤ s), phần còn lại s − c phải được ghép ít tờ nhất, nên f[s] = 1 + min f[s − c]. Khởi tạo f[s] bằng một giá trị "vô cùng" (ví dụ S + 1, vì không bao giờ cần quá S tờ); cuối cùng nếu f[S] vẫn là vô cùng thì in −1.

Với m = 10 và S = 5·10⁴ là 5·10⁵ phép, rất nhanh.

## Giả mã

```pseudo
NHẬP m, S và các mệnh giá c[0..m - 1]
f[0] ← 0; f[1..S] ← vô cùng
VỚI s TỪ 1 ĐẾN S LÀM
    VỚI mỗi mệnh giá c LÀM
        NẾU c ≤ s VÀ f[s - c] + 1 < f[s] THÌ f[s] ← f[s - c] + 1
    HẾT VỚI
HẾT VỚI
NẾU f[S] là vô cùng THÌ XUẤT -1 NGƯỢC LẠI XUẤT f[S]
```

## Mở rộng

- Đếm số cách đổi (không tính thứ tự): duyệt mệnh giá ở vòng ngoài, số tiền ở vòng trong, g[s] += g[s − c].
