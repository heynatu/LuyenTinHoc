---
timeComplexity: O(d), d là số chữ số
memoryComplexity: O(d)
---

## Phân tích

**Subtask 1.** n < 10¹⁸ vừa với số nguyên, có thể lặp `n % 10` rồi `n //= 10`. Đừng đọc bằng `float`: số thực chỉ giữ khoảng 15 đến 17 chữ số có nghĩa nên các chữ số cuối bị sai.

**Subtask 2.** n có tới 100 000 chữ số. Python có số nguyên lớn tùy ý, nhưng các bản Python mới giới hạn việc đổi xâu dài hơn 4300 chữ số sang số (`int(s)` báo `ValueError`). Không cần đổi: coi n là xâu và cộng giá trị từng ký tự.

## Giả mã

```pseudo
NHẬP xâu s là các chữ số của n
tong ← 0
VỚI mỗi ký tự c TRONG s LÀM
    tong ← tong + giá trị chữ số c
HẾT VỚI
XUẤT tong
```

## Mở rộng

- Lặp lại phép lấy tổng chữ số cho tới khi còn một chữ số (chữ số gốc). Kết quả bằng 9 nếu n chia hết cho 9, ngược lại bằng n mod 9; n mod 9 tính được từ tổng chữ số.
