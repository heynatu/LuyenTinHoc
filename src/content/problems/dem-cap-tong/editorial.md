---
timeComplexity: O(n log n)
memoryComplexity: O(n)
---

## Phân tích

**Cách trâu.** Hai vòng lặp thử mọi cặp: n(n − 1)/2 ≈ 5·10⁹ phép khi n = 10⁵. Chỉ đạt subtask 1.

**Sắp xếp và hai con trỏ.** Số cặp không phụ thuộc thứ tự nên sắp xếp tăng dần. Đặt i ở đầu, j ở cuối:

- Nếu a[i] + a[j] ≤ X: vì dãy tăng, a[i] ghép với mọi a[i + 1], …, a[j] đều thỏa mãn, cộng j − i cặp rồi tăng i.
- Ngược lại a[j] quá lớn để ghép với bất kỳ số nào còn lại, giảm j.

Mỗi bước loại một phần tử nên vòng lặp chạy O(n). Đáp án có thể tới khoảng 5·10⁹, Python không bị tràn số.

## Giả mã

```pseudo
NHẬP n, X và dãy A; sắp xếp A tăng dần
i ← 0; j ← n - 1; dem ← 0
TRONG KHI i < j LÀM
    NẾU A[i] + A[j] ≤ X THÌ
        dem ← dem + (j - i); i ← i + 1
    NGƯỢC LẠI
        j ← j - 1
    HẾT NẾU
HẾT KHI
XUẤT dem
```

## Mở rộng

- Đếm cặp có tổng đúng bằng X: hai con trỏ cẩn thận với các giá trị trùng nhau, hoặc dùng `Counter`.
- Đếm cặp có hiệu không vượt quá D: hai con trỏ cùng chiều.
