---
title: Tạo trang web với HTML và CSS
description: Cấu trúc một trang HTML, các thẻ thường dùng, gắn CSS để định dạng màu chữ, khoảng cách, bố cục đơn giản.
level: thpt
grade: 12
strand: F
order: 1
minutes: 50
objectives:
  - Viết được khung trang HTML với tiêu đề, đoạn văn, danh sách, liên kết, ảnh.
  - Gắn CSS bằng thẻ style và chọn phần tử theo tên thẻ, class, id.
  - Biết vì sao cần thuộc tính alt cho ảnh và cấu trúc tiêu đề rõ ràng.
topics: []
quiz:
  - q: Thẻ nào tạo liên kết?
    options: ['<link>', '<a href="…">', '<p>']
    answer: 1
    explain: Thẻ a với thuộc tính href tạo liên kết; thẻ link dùng để nạp file CSS.
    level: nhan-biet
  - q: Bộ chọn CSS .noi-bat áp dụng cho phần tử nào?
    options: ['Phần tử có id="noi-bat"', 'Phần tử có class="noi-bat"', 'Mọi thẻ noi-bat']
    answer: 1
    explain: Dấu chấm chọn theo class, dấu thăng chọn theo id.
    level: thong-hieu
  - q: Vì sao ảnh cần thuộc tính alt?
    options:
      ['Để ảnh tải nhanh hơn', 'Để người dùng trình đọc màn hình biết ảnh nói gì', 'Để ảnh to hơn']
    answer: 1
    explain: alt mô tả nội dung ảnh cho người khiếm thị và khi ảnh không tải được.
    level: thong-hieu
  - q: 'Quy tắc p { color: blue; } và .ghi-chu { color: gray; }. Thẻ <p class="ghi-chu"> có màu gì?'
    options: ['Xanh dương', 'Xám', 'Đen']
    answer: 1
    explain: Bộ chọn class cụ thể hơn bộ chọn tên thẻ nên được ưu tiên.
    level: van-dung-cao
---

## Khung một trang HTML

```text title="index.html"
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <title>Câu lạc bộ Tin học</title>
    <style>
      body { font-family: sans-serif; max-width: 640px; margin: 0 auto; }
      h1 { color: navy; }
      .noi-bat { font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Câu lạc bộ Tin học</h1>
    <p class="noi-bat">Sinh hoạt chiều thứ Năm hằng tuần.</p>
    <ul>
      <li>Luyện thuật toán</li>
      <li>Luyện đề học sinh giỏi</li>
    </ul>
    <a href="https://example.com">Trang của trường</a>
  </body>
</html>
```

## Các thẻ thường dùng

| Thẻ                 | Dùng cho                          |
| ------------------- | --------------------------------- |
| `h1` đến `h6`       | Tiêu đề, từ lớn tới nhỏ           |
| `p`                 | Đoạn văn                          |
| `ul`, `ol`, `li`    | Danh sách không thứ tự, có thứ tự |
| `a href`            | Liên kết                          |
| `img src alt`       | Ảnh, alt là mô tả ảnh             |
| `table`, `tr`, `td` | Bảng                              |

## CSS: chọn phần tử và định dạng

- Theo tên thẻ: `p { … }`
- Theo class: `.noi-bat { … }` (một class dùng cho nhiều phần tử)
- Theo id: `#dau-trang { … }` (id là duy nhất trong trang)

> [!LUU-Y] Trang web cho mọi người
> Mỗi trang chỉ nên có một `h1`, các tiêu đề con theo thứ tự `h2`, `h3`. Ảnh luôn có `alt`. Màu chữ phải đủ tương phản với nền. Những điều này giúp người dùng trình đọc màn hình và người nhìn kém đọc được trang.

> [!MEO] Thử trên máy
> Lưu đoạn code trên thành file `index.html` rồi mở bằng trình duyệt. Sửa CSS, lưu, tải lại trang để xem thay đổi.

## Tự luyện

1. Tạo trang giới thiệu bản thân có ảnh, danh sách sở thích và một bảng thời khóa biểu.
2. Thêm CSS để các dòng chẵn của bảng có nền khác dòng lẻ (gợi ý: `tr:nth-child(even)`).
3. Kiểm tra trang của bạn: mọi ảnh đã có alt chưa, tiêu đề có theo thứ tự không.
