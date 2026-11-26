---
title: Quy hoạch động nhập môn
description: Chia bài toán thành bài toán con chồng lấn, lưu kết quả để không tính lại; công thức truy hồi, thứ tự tính, khởi tạo.
level: thpt
grade: null
track: hsg
strand: F
order: 2
minutes: 80
objectives:
  - Xác định trạng thái, công thức truy hồi và cơ sở của một bài quy hoạch động.
  - Cài đặt quy hoạch động bằng bảng tính từ nhỏ đến lớn.
  - 'Giải được các dạng kinh điển: đoạn con tổng lớn nhất, dãy con tăng, cái túi, đổi tiền, đường đi trên lưới.'
topics: ['quy-hoach-dong']
related:
  algorithms:
    [
      'kadane',
      'day-con-tang-dai-nhat',
      'cai-tui-0-1',
      'doi-tien-it-dong-nhat',
      'dem-duong-di-tren-luoi',
      'xau-con-chung-dai-nhat',
    ]
  problems:
    [
      'doan-con-tong-lon-nhat',
      'day-con-tang',
      'cai-tui',
      'doi-tien',
      'duong-di-luoi',
      'xau-con-chung',
    ]
  traps: ['quen-lay-du', 'mang-hai-chieu-dung-chung']
quiz:
  - q: Fibonacci đệ quy f(n) = f(n - 1) + f(n - 2) chạy rất chậm vì sao?
    options: ['Vì cộng số lớn', 'Vì tính lại cùng một f(k) rất nhiều lần', 'Vì Python chậm']
    answer: 1
    explain: Cây đệ quy có số nút tăng theo hàm mũ; lưu kết quả lại thì chỉ cần O(n).
    level: thong-hieu
  - q: Ba thành phần cần xác định của một bài quy hoạch động?
    options:
      [
        'Trạng thái, công thức truy hồi, cơ sở',
        'Input, output, giới hạn',
        'Vòng for, vòng while, if',
      ]
    answer: 0
    explain: Trạng thái là f[...] nghĩa là gì, truy hồi tính nó từ trạng thái nhỏ hơn, cơ sở là giá trị khởi đầu.
    level: nhan-biet
  - q: 'Mệnh giá 1, 3, 4, số tiền 6. Tham lam lấy tờ lớn nhất cho 3 tờ (4+1+1). Quy hoạch động cho?'
    options: ['3 tờ', '2 tờ', '1 tờ']
    answer: 1
    explain: 3 + 3 = 6, chỉ 2 tờ. Tham lam không phải lúc nào cũng tối ưu.
    level: van-dung
  - q: Lưới 3 × 3 không có ô cấm, chỉ đi sang phải hoặc xuống. Có bao nhiêu đường từ góc trên trái tới góc dưới phải?
    options: ['4', '6', '9']
    answer: 1
    explain: Cần 2 bước phải và 2 bước xuống, số cách là C(4, 2) = 6.
    level: van-dung-cao
---

## Ý tưởng

Nhiều bài toán lớn được ghép từ các bài toán con **lặp lại nhiều lần**. Quy hoạch động tính mỗi bài toán con đúng một lần, lưu vào bảng, rồi dùng lại.

Ba câu hỏi cho mọi bài quy hoạch động:

1. **Trạng thái:** f[i] (hoặc f[i][j]) nghĩa là gì?
2. **Truy hồi:** tính f[i] từ các trạng thái nhỏ hơn thế nào?
3. **Cơ sở:** giá trị đầu tiên biết sẵn là gì?

## Ví dụ: đường đi trên lưới

f[i][j] là số đường đi tới ô (i, j). Bước cuối đến từ ô trên hoặc ô trái, nên f[i][j] = f[i - 1][j] + f[i][j - 1]; ô cấm có f = 0; cơ sở f[0][0] = 1.

```python title="duong_di.py"
MOD = 10**9 + 7
luoi = ["...", ".#.", "..."]
m, n = len(luoi), len(luoi[0])
f = [[0] * n for _ in range(m)]
f[0][0] = 1
for i in range(m):
    for j in range(n):
        if luoi[i][j] == "#":
            f[i][j] = 0
        elif (i, j) != (0, 0):
            f[i][j] = ((f[i - 1][j] if i else 0) + (f[i][j - 1] if j else 0)) % MOD
print(f[m - 1][n - 1])  # 2
```

Xem [mô phỏng đếm đường đi](/mo-phong/dem-duong-di-tren-luoi).

## Các dạng kinh điển

| Bài                    | Trạng thái                                      | Truy hồi                         |
| ---------------------- | ----------------------------------------------- | -------------------------------- |
| Đoạn con tổng lớn nhất | f[i]: tổng lớn nhất của đoạn kết thúc tại i     | f[i] = max(a[i], f[i-1] + a[i])  |
| Dãy con tăng dài nhất  | f[i]: độ dài dãy tăng kết thúc tại i            | 1 + max f[j], j < i, a[j] < a[i] |
| Cái túi 0/1            | f[i][c]: giá trị lớn nhất với i vật, sức chứa c | max(f[i-1][c], f[i-1][c-w]+v)    |
| Đổi tiền ít tờ nhất    | f[s]: số tờ ít nhất cho s đồng                  | 1 + min f[s - c]                 |

Mỗi dạng có mô phỏng chạy từng bước ở mục [Mô phỏng](/mo-phong).

> [!MEO] Tham lam hay quy hoạch động?
> Thử tìm một phản ví dụ nhỏ cho cách tham lam. Có phản ví dụ thì dùng quy hoạch động. Xem [mô phỏng đổi tiền](/mo-phong/doi-tien-it-dong-nhat) với mệnh giá 1, 3, 4.

> [!BAY] Tạo bảng hai chiều sai cách
> `[[0] * n] * m` làm mọi dòng là một. Xem [bẫy mảng hai chiều](/bay-thuong-gap/mang-hai-chieu-dung-chung).

## Tự luyện

1. Làm bài [Đoạn con tổng lớn nhất](/luyen-de/doan-con-tong-lon-nhat).
2. Làm bài [Đường đi trên lưới](/luyen-de/duong-di-luoi).
3. Làm bài [Cái túi](/luyen-de/cai-tui), [Đổi tiền](/luyen-de/doi-tien), [Dãy con tăng](/luyen-de/day-con-tang), [Xâu con chung](/luyen-de/xau-con-chung).
