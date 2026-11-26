---
timeComplexity: O(L + 26), L là độ dài đoạn văn
memoryComplexity: O(L)
---

## Phân tích

Mảng đếm `dem[0..25]`: với mỗi ký tự là chữ cái, đổi về chữ thường rồi tăng `dem[mã ký tự − mã 'a']`. Cuối cùng duyệt từ 0 đến 25, chỉ in chữ cái có `dem > 0`.

Lỗi hay gặp: chỉ đọc dòng đầu tiên bằng `input()` nên bỏ sót các dòng sau; in cả chữ cái có số lần bằng 0; in chữ hoa thay vì chữ thường.

## Giả mã

```pseudo
NHẬP đoạn văn T
dem ← mảng 26 số 0
VỚI mỗi ký tự c TRONG T LÀM
    NẾU c là chữ cái THÌ dem[vị trí của c trong bảng chữ cái] ← dem[...] + 1
HẾT VỚI
VỚI k TỪ 0 ĐẾN 25 LÀM
    NẾU dem[k] > 0 THÌ XUẤT chữ cái thứ k, dem[k]
HẾT VỚI
```

## Mở rộng

- In các chữ cái theo số lần xuất hiện giảm dần, bằng nhau thì theo thứ tự chữ cái (`sorted` với `key`).
