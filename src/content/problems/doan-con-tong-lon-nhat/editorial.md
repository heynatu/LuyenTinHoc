---
timeComplexity: O(n)
memoryComplexity: O(n) cho dữ liệu, O(1) thêm
---

## Phân tích

**Subtask 1, O(n³).** Thử mọi cặp (l, r), cộng lại từng đoạn.

**Subtask 2, O(n²).** Cố định l, tăng dần r và cộng dồn. Hoặc dùng mảng cộng dồn: tổng đoạn bằng P[r] − P[l − 1].

**Subtask 3, Kadane O(n).** f[i] là tổng lớn nhất của đoạn kết thúc đúng tại i: đoạn đó hoặc chỉ là a[i], hoặc nối vào đoạn tốt nhất kết thúc tại i − 1, nên f[i] = max(a[i], f[i − 1] + a[i]). Đáp án là max f[i]. Chỉ cần giữ f của bước trước trong một biến.

Bẫy kinh điển: khởi tạo đáp án bằng 0 (hoặc "đặt lại về 0 khi tổng âm" rồi lấy max với 0) cho kết quả 0 khi mọi số đều âm, trong khi đề yêu cầu đoạn khác rỗng.

## Giả mã

```pseudo
NHẬP n và dãy A
tot ← A[0]; hien ← A[0]
VỚI i TỪ 1 ĐẾN n - 1 LÀM
    hien ← max(A[i], hien + A[i])
    tot ← max(tot, hien)
HẾT VỚI
XUẤT tot
```

## Mở rộng

- In thêm vị trí l, r của đoạn tốt nhất.
- Dãy vòng tròn (phần tử cuối nối với phần tử đầu): đáp án là max(Kadane, tổng − đoạn con tổng nhỏ nhất).
