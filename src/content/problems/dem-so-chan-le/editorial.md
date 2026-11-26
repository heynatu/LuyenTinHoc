---
timeComplexity: O(n)
memoryComplexity: O(n)
---

## Phân tích

Duyệt từng số một lần. Hai điều dễ mất điểm:

1. **Đọc theo dòng.** Nếu đọc dòng thứ hai rồi tách số, test có số nằm trên nhiều dòng sẽ thiếu dữ liệu. Đọc toàn bộ rồi `split()` là cách an toàn.
2. **Số âm.** Trong Python `-5 % 2 == 1` nên điều kiện `x % 2 == 0` đúng với mọi số. Trong C++ thì `-5 % 2 == -1`, ai quen viết `x % 2 == 1` để kiểm tra số lẻ sẽ sai khi chuyển sang ngôn ngữ đó.

## Giả mã

```pseudo
NHẬP n và dãy A
chan ← 0; le ← 0; tong ← 0
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    NẾU A[i] mod 2 = 0 THÌ
        chan ← chan + 1; tong ← tong + A[i]
    NGƯỢC LẠI
        le ← le + 1
    HẾT NẾU
HẾT VỚI
XUẤT chan, le, tong
```

## Mở rộng

- Đếm số phần tử chia hết cho k, hoặc có chữ số tận cùng bằng d.
