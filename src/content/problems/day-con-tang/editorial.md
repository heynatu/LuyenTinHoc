---
timeComplexity: O(n log n)
memoryComplexity: O(n)
partial:
  - { file: sub1.py, label: 'Quy hoạch động O(n²), đạt subtask 1' }
---

## Phân tích

**O(n²).** f[i] là độ dài dãy con tăng dài nhất kết thúc tại vị trí i: f[i] = 1 + max{ f[j] : j < i, a[j] < a[i] } (bằng 1 nếu không có j nào). Đáp án là max f[i]. Với n = 1000 là 10⁶ phép, đạt subtask 1.

**O(n log n).** Giữ danh sách C: C[k] là giá trị cuối **nhỏ nhất** của một dãy con tăng dài k + 1 đã gặp. C luôn tăng dần. Với mỗi x:

- Tìm vị trí k đầu tiên có C[k] ≥ x (`bisect_left`).
- Nếu k bằng độ dài C, x nối dài được dãy dài nhất: thêm x vào cuối.
- Ngược lại thay C[k] bằng x: dãy dài k + 1 nay kết thúc bằng số nhỏ hơn, dễ nối tiếp hơn.

Độ dài C là đáp án. Lưu ý C không nhất thiết là một dãy con thật của a; chỉ độ dài là đúng. Tăng **ngặt** nên dùng `bisect_left`; nếu đề cho phép bằng nhau (không giảm) thì dùng `bisect_right`.

## Giả mã

```pseudo
NHẬP n và dãy A
C ← danh sách rỗng
VỚI mỗi x TRONG A LÀM
    k ← vị trí đầu tiên trong C có C[k] ≥ x (tìm kiếm nhị phân)
    NẾU k = độ dài C THÌ thêm x vào cuối C
    NGƯỢC LẠI C[k] ← x
    HẾT NẾU
HẾT VỚI
XUẤT độ dài C
```

## Mở rộng

- In một dãy con tăng dài nhất: lưu thêm vị trí trước đó của mỗi phần tử.
- Số dãy con tăng dài nhất: cần cây Fenwick, mức chuyên sâu.
