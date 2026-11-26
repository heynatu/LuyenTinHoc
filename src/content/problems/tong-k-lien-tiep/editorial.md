---
timeComplexity: O(n)
memoryComplexity: O(n)
---

## Phân tích

**Cách trâu.** Tính lại tổng từng đoạn: O(n·k), có thể tới 2,5·10⁹ phép khi k = n/2.

**Cửa sổ trượt.** Tổng đoạn bắt đầu ở i + 1 bằng tổng đoạn bắt đầu ở i, cộng phần tử mới vào cửa sổ, trừ phần tử vừa rời khỏi. Mỗi bước O(1).

**Hai bẫy.**

- Khởi tạo `tot = 0` sai khi mọi tổng đều âm. Khởi tạo bằng tổng đoạn đầu tiên.
- Dùng `>=` khi cập nhật sẽ giữ vị trí lớn nhất thay vì nhỏ nhất. Dùng `>`.

Chỉ số trong giả mã bắt đầu từ 0, nên khi in vị trí phải cộng 1.

## Giả mã

```pseudo
NHẬP n, k và dãy A
S ← A[0] + … + A[k - 1]; tot ← S; vt ← 0
VỚI i TỪ k ĐẾN n - 1 LÀM
    S ← S + A[i] - A[i - k]
    NẾU S > tot THÌ tot ← S; vt ← i - k + 1
HẾT VỚI
XUẤT tot, vt + 1
```

## Mở rộng

- Đoạn có độ dài từ L đến R và tổng lớn nhất: cần mảng cộng dồn và hàng đợi hai đầu.
