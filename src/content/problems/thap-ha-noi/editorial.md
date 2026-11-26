---
timeComplexity: O(2ⁿ)
memoryComplexity: O(2ⁿ) cho danh sách bước cần in
---

## Phân tích

Để đĩa n sang được C, n − 1 đĩa phía trên phải nằm ở B. Vậy:

1. Chuyển n − 1 đĩa từ A sang B (dùng C làm trung gian).
2. Chuyển đĩa n từ A sang C.
3. Chuyển n − 1 đĩa từ B sang C (dùng A làm trung gian).

Gọi S(n) là số bước: S(n) = 2·S(n − 1) + 1, S(0) = 0, nên S(n) = 2ⁿ − 1. Với n = 16 có 65 535 bước: phải gom các dòng vào danh sách rồi ghi một lần. Độ sâu đệ quy chỉ là n nên không gặp giới hạn đệ quy.

## Giả mã

```pseudo
HÀM Chuyen(k, tu, sang, qua)
    NẾU k = 0 THÌ TRẢ VỀ
    Chuyen(k - 1, tu, qua, sang)
    XUẤT k, tu, sang
    Chuyen(k - 1, qua, sang, tu)
HẾT HÀM
NHẬP n; XUẤT 2ⁿ - 1; Chuyen(n, A, C, B)
```

## Mở rộng

- Không cần đệ quy: ở bước thứ m (đếm từ 1), đĩa được chuyển là 1 + số chữ số 0 ở cuối biểu diễn nhị phân của m. Lời giải trâu của bài dùng cách này để đối chiếu.
