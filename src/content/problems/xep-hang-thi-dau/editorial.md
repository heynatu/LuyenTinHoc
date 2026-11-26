---
timeComplexity: O(n log n)
memoryComplexity: O(n)
---

## Phân tích

**Sắp xếp theo nhiều tiêu chí.** Python so sánh tuple lần lượt từng phần, nên `key = (−điểm, thời gian, tên)` cho đúng thứ tự cần tìm. Đổi dấu điểm để điểm cao đứng trước. Nhớ đổi điểm và thời gian sang số: so sánh xâu `"90" > "250"` cho kết quả sai.

**Đồng hạng.** Sau khi sắp xếp, người thứ i (đếm từ 1) có hạng i, trừ khi bằng cả điểm và thời gian với người ngay trước thì lấy hạng của người đó. Vì danh sách đã sắp xếp, số người tốt hơn hẳn đúng bằng vị trí của người đầu tiên trong nhóm bằng nhau.

Chỉ số trong giả mã bắt đầu từ 0.

## Giả mã

```pseudo
NHẬP n thí sinh (tên, điểm, thời gian)
khóa của mỗi thí sinh ← (−điểm, thời gian, tên)
Sắp xếp các thí sinh tăng dần theo khóa
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    NẾU i = 0 HOẶC (điểm, thời gian) khác người thứ i - 1 THÌ
        hang ← i + 1
    HẾT NẾU
    XUẤT hang, tên, điểm, thời gian
HẾT VỚI
```

## Mở rộng

- Kiểu xếp hạng "1 2 2 3" (hạng liền nhau): chỉ tăng hạng thêm 1 khi gặp nhóm mới.
