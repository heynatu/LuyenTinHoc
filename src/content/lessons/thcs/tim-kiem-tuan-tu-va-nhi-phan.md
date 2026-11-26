---
title: Tìm kiếm tuần tự và tìm kiếm nhị phân
description: Hai cách tìm một giá trị trong dãy. Tìm nhị phân nhanh hơn rất nhiều nhưng cần dãy đã sắp xếp.
level: thcs
grade: 7
strand: F
order: 1
minutes: 45
objectives:
  - Mô tả và thực hiện được thuật toán tìm kiếm tuần tự.
  - Mô tả và thực hiện được thuật toán tìm kiếm nhị phân trên dãy đã sắp xếp.
  - So sánh được số bước của hai thuật toán khi dãy dài.
topics: ['tim-kiem', 'tim-kiem-nhi-phan']
related:
  algorithms: ['tim-kiem-tuan-tu', 'tim-kiem-nhi-phan']
  problems: ['dem-so-nho-hon']
quiz:
  - q: Điều kiện bắt buộc để dùng tìm kiếm nhị phân là gì?
    options: ['Dãy có số chẵn phần tử', 'Dãy đã được sắp xếp', 'Dãy không có số âm']
    answer: 1
    explain: Tìm nhị phân dựa vào thứ tự để biết nên bỏ nửa nào.
    level: nhan-biet
  - q: Dãy có 1000 phần tử, giá trị cần tìm không có trong dãy. Tìm tuần tự phải so sánh bao nhiêu lần?
    options: ['1 lần', 'Khoảng 10 lần', '1000 lần']
    answer: 2
    explain: Phải xét hết 1000 phần tử mới biết là không có.
    level: thong-hieu
  - q: Dãy tăng dần có 1000 phần tử. Tìm nhị phân cần nhiều nhất khoảng bao nhiêu lần so sánh?
    options: ['10', '100', '500']
    answer: 0
    explain: Mỗi lần so sánh bỏ đi một nửa; 2¹⁰ = 1024 nên khoảng 10 lần.
    level: van-dung
  - q: 'Tìm x = 30 trong dãy 5 12 18 30 41 57 63. Phần tử giữa đầu tiên là?'
    options: ['18', '30', '41']
    answer: 1
    explain: Bảy phần tử, chỉ số 0 đến 6, giữa là chỉ số 3 có giá trị 30.
    level: van-dung
---

## Tìm kiếm tuần tự

Xét lần lượt từng phần tử từ đầu dãy. Gặp giá trị cần tìm thì dừng; hết dãy mà chưa gặp thì kết luận không có.

```pseudo title="Tìm tuần tự"
VỚI i TỪ 0 ĐẾN n - 1 LÀM
    NẾU A[i] = x THÌ TRẢ VỀ i
HẾT VỚI
TRẢ VỀ -1
```

Không cần dãy sắp xếp. Trường hợp xấu nhất phải xét cả n phần tử. Xem từng bước trong [mô phỏng tìm kiếm tuần tự](/mo-phong/tim-kiem-tuan-tu).

## Tìm kiếm nhị phân

Khi dãy **đã sắp xếp tăng dần**, so sánh x với phần tử ở giữa:

- Bằng nhau: tìm thấy.
- x nhỏ hơn: chỉ cần tìm tiếp ở nửa trái.
- x lớn hơn: chỉ cần tìm tiếp ở nửa phải.

Mỗi lần so sánh bỏ đi một nửa phạm vi tìm. Với 1 000 000 phần tử chỉ cần khoảng 20 lần so sánh, trong khi tìm tuần tự có thể cần 1 000 000 lần.

```python title="tim_nhi_phan.py"
def tim_nhi_phan(a, x):
    trai, phai = 0, len(a) - 1
    while trai <= phai:
        giua = (trai + phai) // 2
        if a[giua] == x:
            return giua
        if a[giua] < x:
            trai = giua + 1
        else:
            phai = giua - 1
    return -1


print(tim_nhi_phan([5, 12, 18, 30, 41, 57, 63], 41))  # 4
```

> [!MEO] Chơi trò đoán số
> Bạn A nghĩ một số từ 1 đến 100, bạn B đoán và được trả lời "lớn hơn" hoặc "nhỏ hơn". Đoán số ở giữa mỗi lần thì không quá 7 lần là ra. Đó chính là tìm kiếm nhị phân.

> [!BAY] Tìm nhị phân trên dãy chưa sắp xếp
> Thuật toán vẫn chạy nhưng cho kết quả sai, vì bỏ nhầm nửa có chứa x. Hãy sắp xếp trước.

## Tự luyện

1. Chạy tay tìm x = 20 trong dãy 3 8 12 17 21 26 30: ghi lại trái, phải, giữa sau mỗi bước.
2. Sửa thuật toán tìm tuần tự để đếm số lần x xuất hiện trong dãy.
3. Làm bài [Đếm số không vượt quá](/luyen-de/dem-so-nho-hon) trong kho đề.
