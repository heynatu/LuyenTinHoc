---
timeComplexity: O(m·n)
memoryComplexity: O(n) thêm, ngoài lưới
---

## Phân tích

**Thử mọi đường** chỉ chạy được với lưới rất nhỏ: lưới 500 × 500 không cấm ô nào có C(998, 499) đường, một số khoảng 300 chữ số.

**Quy hoạch động.** f[i][j] là số đường tới ô (i, j). Bước cuối đến từ ô trên hoặc ô trái, nên f[i][j] = f[i − 1][j] + f[i][j − 1] (bỏ số hạng nằm ngoài lưới), ô cấm có f = 0, f[0][0] = 1 nếu ô xuất phát đi được.

**Một dòng là đủ.** Khi tính dòng i từ trái sang phải, f[j] lúc chưa cập nhật chính là giá trị của ô phía trên, f[j − 1] vừa cập nhật là ô bên trái. Lấy dư 10⁹ + 7 ở mỗi phép cộng để số không phình to.

## Giả mã

```pseudo
NHẬP m, n và lưới
f[0..n - 1] ← 0
VỚI i TỪ 0 ĐẾN m - 1 LÀM
    VỚI j TỪ 0 ĐẾN n - 1 LÀM
        NẾU ô (i, j) là '#' THÌ f[j] ← 0
        NGƯỢC LẠI NẾU i = 0 VÀ j = 0 THÌ f[j] ← 1
        NGƯỢC LẠI NẾU j > 0 THÌ f[j] ← (f[j] + f[j - 1]) mod (10⁹ + 7)
        HẾT NẾU
    HẾT VỚI
HẾT VỚI
XUẤT f[n - 1]
```

## Mở rộng

- Mỗi ô có số xu, tìm đường nhặt được nhiều xu nhất: thay phép cộng bằng max.
- Không có ô cấm: đáp án là C(m + n − 2, m − 1), tính bằng giai thừa và nghịch đảo modulo.
