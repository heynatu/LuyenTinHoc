---
title: Sắp xếp chọn và sắp xếp nổi bọt
description: 'Hai thuật toán sắp xếp cơ bản: mỗi lượt chọn số nhỏ nhất đưa lên đầu, hoặc đổi chỗ các cặp kề nhau sai thứ tự.'
level: thcs
grade: 7
strand: F
order: 2
minutes: 45
objectives:
  - Thực hiện được sắp xếp chọn và sắp xếp nổi bọt bằng tay trên dãy nhỏ.
  - Đếm được số lần so sánh và đổi chỗ trong một lượt.
  - Giải thích vì sao sau mỗi lượt có thêm một phần tử đúng chỗ.
topics: ['sap-xep']
related:
  algorithms: ['sap-xep-noi-bot', 'sap-xep-chon', 'sap-xep-chen']
  problems: ['xep-hang-thi-dau']
quiz:
  - q: Sau lượt đầu tiên của sắp xếp nổi bọt (tăng dần), phần tử nào chắc chắn đúng chỗ?
    options: ['Số nhỏ nhất, ở đầu dãy', 'Số lớn nhất, ở cuối dãy', 'Không phần tử nào']
    answer: 1
    explain: Số lớn nhất được đổi chỗ dần về cuối như bọt nổi lên.
    level: thong-hieu
  - q: Sắp xếp chọn dãy 7 3 5 1. Sau lượt đầu, dãy là?
    options: ['1 3 5 7', '1 7 5 3', '3 7 5 1']
    answer: 0
    explain: Số nhỏ nhất là 1 ở vị trí 3, đổi chỗ với 7 ở vị trí 0 được 1 3 5 7.
    level: van-dung
  - q: Dãy n phần tử, sắp xếp nổi bọt cần nhiều nhất bao nhiêu lượt?
    options: ['n - 1 lượt', 'n² lượt', '1 lượt']
    answer: 0
    explain: Mỗi lượt đưa một phần tử về đúng chỗ; sau n - 1 lượt phần tử còn lại cũng đúng chỗ.
    level: thong-hieu
  - q: Vì sao sắp xếp nổi bọt có thể dừng sớm khi một lượt không đổi chỗ lần nào?
    options:
      [
        'Vì đã hết thời gian',
        'Vì mọi cặp kề nhau đều đúng thứ tự nên dãy đã sắp xếp',
        'Vì dãy rỗng',
      ]
    answer: 1
    explain: Không có cặp kề nhau nào sai thứ tự thì cả dãy đã tăng dần.
    level: van-dung-cao
---

## Sắp xếp chọn

Ở lượt thứ i, tìm số nhỏ nhất trong phần chưa sắp xếp rồi đổi chỗ nó lên vị trí i.

| Lượt    | Dãy         | Ghi chú                     |
| ------- | ----------- | --------------------------- |
| Ban đầu | 7 3 5 1     |                             |
| 1       | **1** 3 5 7 | số nhỏ nhất 1 đổi chỗ với 7 |
| 2       | 1 **3** 5 7 | 3 đã đúng chỗ               |
| 3       | 1 3 **5** 7 | xong                        |

## Sắp xếp nổi bọt

Duyệt dãy, so sánh hai phần tử kề nhau, sai thứ tự thì đổi chỗ. Sau mỗi lượt, số lớn nhất còn lại "nổi" về cuối.

```pseudo title="Sắp xếp nổi bọt"
VỚI i TỪ 0 ĐẾN n - 2 LÀM
    VỚI j TỪ 0 ĐẾN n - 2 - i LÀM
        NẾU A[j] > A[j + 1] THÌ
            ĐỔI CHỖ A[j] VÀ A[j + 1]
        HẾT NẾU
    HẾT VỚI
HẾT VỚI
```

Mở [mô phỏng sắp xếp nổi bọt](/mo-phong/sap-xep-noi-bot), bật **Chế độ dự đoán** để tự đoán từng lần đổi chỗ.

> [!MEO] Trong Python dùng sorted
> Khi làm bài thi, dùng sorted(a) hoặc a.sort(): nhanh hơn nhiều so với tự viết nổi bọt. Học nổi bọt để hiểu cách sắp xếp hoạt động, không phải để dùng khi n lớn.

> [!BAY] Chỉ số vượt ra ngoài dãy
> Vòng trong so sánh A[j] với A[j + 1], nên j chỉ được chạy tới n - 2. Cho j chạy tới n - 1 sẽ đọc A[n], không tồn tại.

## Tự luyện

1. Chạy tay sắp xếp nổi bọt dãy 5 1 4 2 8, ghi dãy sau mỗi lượt và số lần đổi chỗ.
2. Sửa thuật toán để sắp xếp giảm dần.
3. Làm bài [Xếp hạng thi đấu](/luyen-de/xep-hang-thi-dau).
