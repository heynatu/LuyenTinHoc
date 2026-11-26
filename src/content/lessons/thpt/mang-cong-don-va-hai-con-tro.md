---
title: Mảng cộng dồn, hai con trỏ, cửa sổ trượt
description: Ba kỹ thuật biến lời giải O(n²) thành O(n) cho các bài về đoạn con, tổng đoạn, cặp số, xuất hiện dày đặc trong đề học sinh giỏi.
level: thpt
grade: null
track: hsg
strand: F
order: 1
minutes: 70
objectives:
  - Dùng mảng cộng dồn để tính tổng đoạn trong O(1).
  - Dùng hai con trỏ trên dãy đã sắp xếp hoặc dãy số dương.
  - Dùng cửa sổ trượt cho đoạn có độ dài cố định.
topics: ['mang-cong-don', 'hai-con-tro', 'cua-so-truot']
related:
  algorithms: ['mang-cong-don', 'hai-con-tro', 'cua-so-truot']
  problems: ['doanh-thu-ca-phe', 'dem-cap-tong', 'tong-k-lien-tiep']
  traps: ['lech-chi-so', 'doc-du-lieu-cham']
quiz:
  - q: P[i] là tổng i phần tử đầu (P[0] = 0). Tổng A[l..r] (chỉ số từ 0) bằng?
    options: ['P[r] - P[l]', 'P[r + 1] - P[l]', 'P[r + 1] - P[l - 1]']
    answer: 1
    explain: P[r + 1] là tổng A[0..r], trừ đi P[l] là tổng A[0..l - 1].
    level: thong-hieu
  - q: Dãy tăng dần, đếm cặp i < j có A[i] + A[j] ≤ X. Hai con trỏ đặt ở đâu ban đầu?
    options: ['Cả hai ở đầu', 'i ở đầu, j ở cuối', 'Cả hai ở giữa']
    answer: 1
    explain: "Nếu A[i] + A[j] ≤ X thì mọi j' từ i + 1 tới j đều được: cộng j - i cặp rồi tăng i; ngược lại giảm j."
    level: van-dung
  - q: Cửa sổ độ dài k trượt sang phải một ô. Tổng mới tính thế nào?
    options: ['Cộng lại k số', 'Tổng cũ cộng số mới trừ số rời khỏi cửa sổ', 'Nhân đôi tổng cũ']
    answer: 1
    explain: Chỉ hai số thay đổi nên cập nhật O(1).
    level: nhan-biet
  - q: Có 10⁶ truy vấn tổng đoạn trên dãy 10⁶ số. Độ phức tạp với mảng cộng dồn?
    options: ['O(n·q)', 'O(n + q)', 'O(q log n)']
    answer: 1
    explain: Tính P mất O(n), mỗi truy vấn O(1).
    level: van-dung-cao
---

## Mảng cộng dồn

```python title="cong_don.py"
a = [5, 3, -2, 8, 4]
p = [0] * (len(a) + 1)
for i, x in enumerate(a):
    p[i + 1] = p[i] + x
# tổng a[1..3] (chỉ số từ 0)
print(p[4] - p[1])  # 3 + (-2) + 8 = 9
```

Nếu đề đánh số từ 1 (A[1..n]) thì tổng A[l..r] = P[r] - P[l - 1]. Chọn một quy ước và giữ nguyên. Xem [mô phỏng mảng cộng dồn](/mo-phong/mang-cong-don).

> [!MEO] Dùng itertools.accumulate
> `from itertools import accumulate; p = [0] + list(accumulate(a))` gọn và nhanh hơn vòng for.

## Hai con trỏ

Trên dãy đã sắp xếp, hai con trỏ đi từ hai đầu vào giữa, mỗi bước loại được một phần tử.

```python title="dem_cap.py"
def dem_cap(a, x):
    a = sorted(a)
    i, j = 0, len(a) - 1
    dem = 0
    while i < j:
        if a[i] + a[j] <= x:
            dem += j - i   # a[i] ghép được với mọi a[i+1..j]
            i += 1
        else:
            j -= 1
    return dem


print(dem_cap([1, 5, 3, 7], 8))  # (1,3) (1,5) (1,7) (3,5): 4
```

## Cửa sổ trượt

Đoạn có độ dài cố định k: cộng phần tử mới, trừ phần tử rời đi. Xem [mô phỏng cửa sổ trượt](/mo-phong/cua-so-truot).

> [!BAY] Lệch chỉ số ở cận
> Lỗi hay gặp nhất là P[r] - P[l] thay vì P[r + 1] - P[l]. Luôn chạy tay một đoạn có l = r để kiểm tra. Xem [bẫy lệch chỉ số](/bay-thuong-gap/lech-chi-so).

## Tự luyện

1. Làm bài [Doanh thu quán cà phê](/luyen-de/doanh-thu-ca-phe).
2. Làm bài [Đếm cặp có tổng không vượt quá X](/luyen-de/dem-cap-tong).
3. Làm bài [Tổng k số liên tiếp lớn nhất](/luyen-de/tong-k-lien-tiep).
