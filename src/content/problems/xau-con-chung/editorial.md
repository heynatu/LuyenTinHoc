---
timeComplexity: O(|A|·|B|)
memoryComplexity: O(|B|)
---

## Phân tích

**Subtask 1.** Liệt kê mọi xâu con của xâu ngắn hơn (2¹⁵ cách) và kiểm tra có là xâu con của xâu kia không.

**Quy hoạch động.** f[i][j] là độ dài xâu con chung dài nhất của i ký tự đầu của A và j ký tự đầu của B.

- Nếu ký tự thứ i của A bằng ký tự thứ j của B: ghép ký tự đó vào sau, f[i][j] = f[i − 1][j − 1] + 1.
- Ngược lại một trong hai ký tự không được dùng: f[i][j] = max(f[i − 1][j], f[i][j − 1]).

**Hai dòng là đủ.** Dòng i chỉ cần dòng i − 1, nên giữ hai danh sách `truoc` và `hien`. Với hai xâu dài 1000 là 10⁶ ô; Python tính trong khoảng nửa giây nếu dùng biến cục bộ trong hàm. Vì vậy đề cho giới hạn 2 giây.

Đừng nhầm với **xâu con liên tiếp** chung dài nhất: công thức khác (không lấy max khi hai ký tự khác nhau mà đặt về 0).

## Giả mã

```pseudo
NHẬP xâu A, B
truoc[0..|B|] ← 0
VỚI mỗi ký tự x TRONG A LÀM
    hien[0] ← 0
    VỚI j TỪ 0 ĐẾN |B| - 1 LÀM
        NẾU x = B[j] THÌ hien[j + 1] ← truoc[j] + 1
        NGƯỢC LẠI hien[j + 1] ← max(hien[j], truoc[j + 1])
    HẾT VỚI
    truoc ← hien
HẾT VỚI
XUẤT truoc[|B|]
```

## Mở rộng

- In một xâu con chung dài nhất: giữ cả bảng f rồi truy vết từ ô cuối.
- Số phép sửa ít nhất (thêm, xóa, thay ký tự) để biến A thành B: khoảng cách sửa xâu, công thức tương tự.
