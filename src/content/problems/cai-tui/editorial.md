---
timeComplexity: O(n·W)
memoryComplexity: O(W)
---

## Phân tích

**Subtask 1.** Thử mọi tập con bằng bitmask: 2ⁿ cách, mỗi cách cộng O(n).

**Quy hoạch động.** f[i][c] là giá trị lớn nhất khi chỉ dùng i món đầu với sức chứa c. Món thứ i hoặc không lấy (f[i − 1][c]), hoặc lấy nếu c ≥ wᵢ (f[i − 1][c − wᵢ] + vᵢ).

**Tiết kiệm bộ nhớ.** Chỉ cần một mảng f[0..W]. Với mỗi món, duyệt c **giảm dần** từ W về wᵢ: khi tính f[c], ô f[c − wᵢ] vẫn còn là giá trị của bước trước (chưa dùng món này). Nếu duyệt tăng dần, một món có thể bị lấy nhiều lần: đó là bài cái túi không giới hạn.

Với n = 100, W = 10⁴ là 10⁶ phép cập nhật, Python chạy khoảng nửa giây.

## Giả mã

```pseudo
NHẬP n, W và các món (w[i], v[i])
f[0..W] ← 0
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    VỚI c TỪ W ĐẾN w[i] (giảm dần) LÀM
        f[c] ← max(f[c], f[c - w[i]] + v[i])
    HẾT VỚI
HẾT VỚI
XUẤT f[W]
```

## Mở rộng

- In danh sách món được chọn: dùng bảng hai chiều f[i][c] rồi truy vết ngược.
- Sức chứa tới 10⁹ nhưng tổng giá trị nhỏ: đổi vai, g[v] là khối lượng nhỏ nhất để đạt giá trị v.
