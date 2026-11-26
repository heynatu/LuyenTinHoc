---
title: Cơ sở dữ liệu quan hệ và SQL
description: Bảng, bản ghi, khóa chính, khóa ngoài; truy vấn SELECT với WHERE, ORDER BY, GROUP BY, JOIN trên cơ sở dữ liệu thư viện trường.
level: thpt
grade: 11
strand: F
order: 1
minutes: 60
objectives:
  - Giải thích được bảng, bản ghi, trường, khóa chính, khóa ngoài.
  - Viết được truy vấn SELECT có lọc, sắp xếp, gom nhóm, đếm.
  - Kết nối hai bảng bằng JOIN qua khóa ngoài.
topics: ['co-so-du-lieu']
quiz:
  - q: Khóa chính của bảng có tính chất gì?
    options: ['Có thể trùng nhau', 'Xác định duy nhất mỗi bản ghi, không được trùng', 'Luôn là số']
    answer: 1
    explain: Khóa chính phân biệt các bản ghi, nên không trùng và không để trống.
    level: nhan-biet
  - q: Truy vấn nào lấy tên các sách xuất bản sau năm 2020?
    options:
      [
        'SELECT ten_sach FROM sach WHERE nam_xb > 2020',
        'SELECT * WHERE nam_xb > 2020',
        'GET ten_sach FROM sach',
      ]
    answer: 0
    explain: SELECT cột FROM bảng WHERE điều kiện.
    level: thong-hieu
  - q: Muốn đếm số sách của mỗi thể loại, cần mệnh đề nào?
    options: ['ORDER BY the_loai', 'GROUP BY the_loai', 'WHERE the_loai']
    answer: 1
    explain: GROUP BY gom các dòng cùng thể loại, COUNT(*) đếm trong từng nhóm.
    level: van-dung
  - q: Bảng phieu_muon có cột ma_sach trỏ tới bảng sach. Cột đó gọi là gì?
    options: ['Khóa chính', 'Khóa ngoài', 'Chỉ mục']
    answer: 1
    explain: Khóa ngoài tham chiếu tới khóa chính của bảng khác, tạo quan hệ giữa hai bảng.
    level: van-dung-cao
---

## Bảng, bản ghi, khóa

Cơ sở dữ liệu quan hệ lưu dữ liệu trong các **bảng**. Mỗi dòng là một **bản ghi**, mỗi cột là một **trường**.

- **Khóa chính** xác định duy nhất mỗi bản ghi, ví dụ `ma_sach`.
- **Khóa ngoài** là trường trỏ tới khóa chính của bảng khác, ví dụ `phieu_muon.ma_sach` trỏ tới `sach.ma_sach`.

## Truy vấn SELECT

```sql title="sach_moi.sql"
SELECT ten_sach, tac_gia, nam_xb
FROM sach
WHERE nam_xb >= 2020
ORDER BY nam_xb DESC, ten_sach;
```

## Gom nhóm và đếm

```sql title="theo_the_loai.sql"
SELECT the_loai, COUNT(*) AS so_sach
FROM sach
GROUP BY the_loai
HAVING COUNT(*) >= 2
ORDER BY so_sach DESC;
```

`WHERE` lọc từng dòng trước khi gom nhóm; `HAVING` lọc các nhóm sau khi gom.

## Kết nối hai bảng

```sql title="ai_muon_sach_gi.sql"
SELECT hs.ho_ten, s.ten_sach, pm.ngay_muon
FROM phieu_muon AS pm
JOIN hoc_sinh AS hs ON hs.ma_hs = pm.ma_hs
JOIN sach AS s ON s.ma_sach = pm.ma_sach
ORDER BY pm.ngay_muon;
```

> [!MEO] Chạy thử ngay
> Mọi truy vấn trên chạy được ở [Phòng thực hành SQL](/sql) với cơ sở dữ liệu Thư viện trường có sẵn.

> [!LUU-Y] SQLite trên web và MySQL trong sách
> Phòng thực hành dùng SQLite chạy ngay trên trình duyệt. Sách giáo khoa thường thực hành với MySQL. Các lệnh SELECT, WHERE, GROUP BY, JOIN giống nhau; khác ở một số kiểu dữ liệu và cách tạo khóa tự tăng.

## Tự luyện

1. Viết truy vấn liệt kê học sinh lớp 11A1 theo thứ tự tên.
2. Đếm số lượt mượn của từng cuốn sách, chỉ lấy sách được mượn ít nhất 3 lần.
3. Làm các bài trong [Phòng thực hành SQL](/sql).
