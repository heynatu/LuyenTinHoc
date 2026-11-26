---
title: Mẫu code Python phòng thi
description: Khung chương trình đọc ghi file đúng tên, đọc dữ liệu nhanh, ghi kết quả một lần, đặt code trong hàm main để chạy nhanh hơn.
order: 3
audience: ['thcs', 'thpt']
---

## Khung chuẩn

Chép tên file từ đề vào hằng số. Muốn thử bằng bàn phím thì đổi `DOC_GHI_FILE = False`, nhưng nhớ đổi lại trước khi nộp.

```python title="BAI1.PY"
import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "BAI1.INP", "BAI1.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))

    ket_qua = sum(a)

    out = str(ket_qua)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
```

## Vì sao viết như vậy

- **Đọc cả file rồi tách theo khoảng trắng** (`read().split()`): không phụ thuộc số nằm trên một hay nhiều dòng, bỏ qua `\r` của file Windows, nhanh hơn gọi `input()` nhiều lần.
- **Ghi một lần**: gom kết quả vào list rồi `"\n".join(...)`. Gọi `print` 10⁵ lần chậm hơn nhiều.
- **Hàm `main()`**: biến cục bộ nhanh hơn biến toàn cục.

## Đọc từng dòng khi cần

Khi dòng có chứa dấu cách có nghĩa (ví dụ một câu văn), đọc theo dòng:

```python title="doc_theo_dong.py"
import sys

dong = sys.stdin.buffer.read().decode().split("\n")
cau = dong[0].rstrip("\r")  # bỏ \r của file soạn trên Windows
```

## In nhiều kết quả

```python title="in_nhieu_dong.py"
ket_qua = [str(x * x) for x in range(1, 6)]
print("\n".join(ket_qua))
```

> [!BAY] Quên đổi lại DOC_GHI_FILE
> Thử bằng bàn phím xong quên đặt lại `True` thì máy chấm không thấy file kết quả, mất cả bài. Hãy đọc lại hằng số này trong [danh sách kiểm trước khi nộp](/cam-nang/muoi-phut-dau-phong-thi).

> [!MEO] Thử ngay
> Mở [Phòng lập trình](/lap-trinh), chọn "Mẫu phòng thi đọc ghi file" và bật chế độ đọc ghi file.
