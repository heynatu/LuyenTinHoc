---
title: Tự chấm ở nhà bằng Themis
description: Cách dùng bộ test tải từ trang để tự chấm bằng phần mềm Themis trên máy tính, giống cách nhiều kỳ thi tin học chấm bài.
order: 6
audience: ['thcs', 'thpt']
---

Themis là phần mềm chấm bài tự động được nhiều kỳ thi tin học trong nước sử dụng. Hãy tải phần mềm từ nguồn chính thức do giáo viên bồi dưỡng hoặc Sở Giáo dục và Đào tạo cung cấp, không tải từ trang lạ. Cách thao tác cụ thể trên giao diện có thể khác giữa các phiên bản: hãy đối chiếu với hướng dẫn đi kèm phần mềm.

## Bộ test tải từ trang

Mỗi bài trong [kho đề](/luyen-de) có nút **Tải bộ test dạng Themis**. File zip có cấu trúc:

```text title="Cấu trúc thư mục test"
TONGUOC/
  Test01/
    TONGUOC.INP
    TONGUOC.OUT
  Test02/
    TONGUOC.INP
    TONGUOC.OUT
  ...
```

Tên thư mục bài trùng tên chương trình (bỏ đuôi `.PY`), mỗi test một thư mục con chứa file dữ liệu vào và kết quả đúng.

## Các bước tổng quát

1. Giải nén bộ test vào một thư mục đề thi.
2. Đặt bài làm vào thư mục của thí sinh, tên file đúng như đề (ví dụ `TONGUOC.PY`).
3. Trong Themis, chọn thư mục đề thi và thư mục bài làm, đặt giới hạn thời gian theo đề.
4. Chấm và xem kết quả từng test.

> [!LUU-Y] Không thay cho thể lệ
> Quy ước tên file, thư mục và cách chấm của mỗi kỳ thi phải theo văn bản của ban tổ chức năm đó. Xem [hồ sơ kỳ thi](/ky-thi).

> [!MEO] Không có Themis?
> Dùng nút Chấm thử ngay trên trang bài tập, hoặc script đối chiếu trong [Kiểm thử như người ra đề](/cam-nang/kiem-thu-nhu-nguoi-ra-de).
