---
timeComplexity: O((n + q) log n)
memoryComplexity: O(n)
---

## Phân tích

Sắp xếp dãy **một lần** (đừng sắp xếp lại trong mỗi câu hỏi). Trên dãy tăng dần, các số ≤ x nằm liền nhau ở đầu dãy, nên câu trả lời là vị trí đầu tiên có giá trị lớn hơn x. Tìm vị trí đó bằng tìm kiếm nhị phân, hoặc dùng `bisect_right` có sẵn.

"Không vượt quá" nghĩa là ≤. Nếu đề hỏi "nhỏ hơn" thì dùng `bisect_left`. Nhầm hai hàm này làm sai đúng những test có phần tử bằng x.

Chỉ số trong giả mã bắt đầu từ 0.

## Giả mã

```pseudo
NHẬP n, q và dãy A
Sắp xếp A tăng dần
VỚI mỗi câu hỏi x LÀM
    lo ← 0; hi ← n
    TRONG KHI lo < hi LÀM
        giua ← (lo + hi) div 2
        NẾU A[giua] ≤ x THÌ lo ← giua + 1 NGƯỢC LẠI hi ← giua
    HẾT KHI
    XUẤT lo
HẾT VỚI
```

## Mở rộng

- Đếm số phần tử trong đoạn giá trị [L, R]: bisect_right(R) − bisect_left(L).
