---
timeComplexity: O(M log log M + q), M là b lớn nhất
memoryComplexity: O(M)
---

## Phân tích

**Cách trâu.** Với mỗi câu hỏi, kiểm tra từng số trong đoạn bằng cách chia thử tới √x. Trường hợp xấu nhất 10⁵ câu hỏi, mỗi câu 10⁶ số: không thể kịp.

**Sàng Eratosthenes.** Đánh dấu mọi số từ 0 đến M là nguyên tố, gạch 0 và 1, rồi với mỗi i còn được đánh dấu, gạch các bội i·i, i·i + i, … Sàng tới 10⁶ bằng `bytearray` và gán theo lát cắt chạy dưới 0,1 giây.

**Cộng dồn.** dem[x] là số nguyên tố không vượt quá x. Câu hỏi [a, b] có đáp án dem[b] − dem[a − 1].

**In nhanh.** Gom 10⁵ đáp án vào danh sách rồi in một lần bằng `"\n".join`, đừng gọi `print` 10⁵ lần.

## Giả mã

```pseudo
NHẬP q và các câu hỏi; M ← giá trị b lớn nhất
la_nt[0..M] ← ĐÚNG; la_nt[0] ← SAI; la_nt[1] ← SAI
VỚI i TỪ 2 ĐẾN ⌊√M⌋ LÀM
    NẾU la_nt[i] THÌ
        VỚI j TỪ i·i ĐẾN M BƯỚC i LÀM la_nt[j] ← SAI
    HẾT NẾU
HẾT VỚI
dem[0] ← 0; VỚI x TỪ 1 ĐẾN M LÀM dem[x] ← dem[x - 1] + (1 nếu la_nt[x] ngược lại 0)
VỚI mỗi câu hỏi (a, b) LÀM XUẤT dem[b] - dem[a - 1]
```

## Mở rộng

- Đếm số nguyên tố trong đoạn khi b tới 10¹² nhưng b − a ≤ 10⁶: sàng đoạn (chỉ cần các số nguyên tố tới √b).
