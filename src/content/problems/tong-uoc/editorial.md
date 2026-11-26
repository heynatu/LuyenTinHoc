---
timeComplexity: O(√n)
memoryComplexity: O(1)
---

## Phân tích

**Cách trâu** thử mọi i từ 1 đến n: 10¹² phép, không thể chạy kịp.

**Cặp ước.** Nếu i là ước của n thì n / i cũng là ước, và trong hai số này có một số không vượt quá √n. Vậy chỉ cần duyệt i từ 1 đến ⌊√n⌋, mỗi lần gặp ước thì cộng cả i và n / i. Với n = 10¹², số lần lặp là 10⁶, Python chạy khoảng 0,1 giây.

**Hai bẫy.**

- `int(math.sqrt(n))` có thể lệch một đơn vị với số lớn do sai số số thực. Dùng `math.isqrt(n)` (có từ Python 3.8).
- Khi n là số chính phương, ước √n bị cộng hai lần nếu không kiểm tra `j != i`.

## Giả mã

```pseudo
NHẬP n
tong ← 0; dem ← 0
VỚI i TỪ 1 ĐẾN ⌊√n⌋ LÀM
    NẾU n mod i = 0 THÌ
        j ← n div i; tong ← tong + i; dem ← dem + 1
        NẾU j ≠ i THÌ tong ← tong + j; dem ← dem + 1
    HẾT NẾU
HẾT VỚI
XUẤT tong, dem
```

## Mở rộng

- Số hoàn hảo: tổng các ước nhỏ hơn n bằng chính n (6, 28, 496).
- Với q truy vấn n ≤ 10⁶, dùng sàng để tính tổng ước cho mọi số cùng lúc trong O(N log N).
