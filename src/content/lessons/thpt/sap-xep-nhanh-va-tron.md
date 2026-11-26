---
title: Sắp xếp nhanh, sắp xếp trộn và sorted với key
description: Hai thuật toán sắp xếp O(n log n) theo kiểu chia để trị, và cách dùng sorted với key để sắp xếp theo nhiều tiêu chí trong đề thi.
level: thpt
grade: 11
strand: F
order: 3
minutes: 55
objectives:
  - Mô tả được ý tưởng chia để trị của sắp xếp trộn và sắp xếp nhanh.
  - Giải thích trường hợp xấu nhất O(n²) của sắp xếp nhanh.
  - Dùng sorted với key và tuple để sắp xếp theo nhiều tiêu chí.
topics: ['sap-xep', 'de-quy']
related:
  algorithms: ['sap-xep-tron', 'sap-xep-nhanh', 'sap-xep-dem-phan-phoi']
  problems: ['xep-hang-thi-dau']
  traps: ['sap-xep-xau-so']
quiz:
  - q: Sắp xếp trộn luôn có độ phức tạp?
    options: ['O(n²)', 'O(n log n)', 'O(n)']
    answer: 1
    explain: Chia đôi log n tầng, mỗi tầng trộn O(n).
    level: nhan-biet
  - q: Sắp xếp nhanh chọn chốt là phần tử cuối, dãy đã tăng dần. Điều gì xảy ra?
    options: ['Nhanh nhất', 'Rơi vào trường hợp xấu nhất O(n²)', 'Báo lỗi']
    answer: 1
    explain: Mỗi lần phân hoạch chỉ bớt được một phần tử, sinh n tầng đệ quy.
    level: thong-hieu
  - q: Sắp xếp học sinh theo điểm giảm dần, cùng điểm thì theo tên tăng dần. key nào đúng?
    options: ['key=lambda h: (h[1], h[0])', 'key=lambda h: (-h[1], h[0])', 'key=lambda h: h[0]']
    answer: 1
    explain: Đổi dấu điểm để có thứ tự giảm, rồi so sánh tiếp tên tăng dần.
    level: van-dung
  - q: Điểm thi là số nguyên từ 0 đến 10, có 10⁶ học sinh. Cách sắp xếp nào nhanh nhất?
    options: ['Nổi bọt', 'Đếm phân phối', 'Sắp xếp chọn']
    answer: 1
    explain: Giá trị nhỏ (0 đến 10) nên đếm phân phối chạy O(n + 11).
    level: van-dung-cao
---

## Sắp xếp trộn

Chia đôi dãy, sắp xếp từng nửa (đệ quy), rồi trộn hai nửa đã sắp xếp bằng cách liên tục lấy số nhỏ hơn ở đầu hai nửa. Luôn O(n log n), cần thêm bộ nhớ O(n). Xem [mô phỏng sắp xếp trộn](/mo-phong/sap-xep-tron).

## Sắp xếp nhanh

Chọn một **chốt**, đưa các số nhỏ hơn chốt sang trái, còn lại sang phải; chốt đã đúng chỗ. Làm tiếp hai bên. Trung bình O(n log n) nhưng xấu nhất O(n²).

Trong [mô phỏng sắp xếp nhanh](/mo-phong/sap-xep-nhanh), chọn bộ mẫu "Đã tăng, chốt cuối" để thấy trường hợp xấu nhất.

## sorted với key trong đề thi

Python dùng thuật toán Timsort, O(n log n) và **ổn định** (giữ thứ tự ban đầu của các phần tử bằng nhau).

```python title="xep_hang.py"
hoc_sinh = [("Lan", 8), ("Hùng", 9), ("An", 9), ("Bình", 7)]
xep = sorted(hoc_sinh, key=lambda h: (-h[1], h[0]))
for ten, diem in xep:
    print(ten, diem)
```

Kết quả: An 9, Hùng 9, Lan 8, Bình 7.

> [!MEO] Tuple so sánh lần lượt từng phần
> Python so sánh tuple phần đầu trước, bằng nhau mới xét phần sau. Đổi dấu số để đảo thứ tự giảm dần.

> [!BAY] Sắp xếp số đang ở dạng xâu
> `sorted(["10", "9", "2"])` cho `['10', '2', '9']`. Đổi sang số trước. Xem [bẫy sắp xếp xâu số](/bay-thuong-gap/sap-xep-xau-so).

## Tự luyện

1. Viết hàm trộn hai danh sách đã sắp xếp thành một danh sách sắp xếp trong O(n + m).
2. Sắp xếp các xâu theo độ dài tăng dần, cùng độ dài theo thứ tự từ điển.
3. Làm bài [Xếp hạng thi đấu](/luyen-de/xep-hang-thi-dau).
