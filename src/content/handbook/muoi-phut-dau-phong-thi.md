---
title: Mười phút đầu phòng thi và danh sách kiểm trước khi nộp
description: Việc cần làm trong mười phút đầu, cách phân bổ thời gian cho đề 3 đến 5 bài, và danh sách kiểm từng bài trước khi nộp.
order: 7
audience: ['thcs', 'thpt']
---

## Mười phút đầu

1. Kiểm tra máy: mở trình soạn code, chạy thử chương trình in một dòng, xem phiên bản Python bằng `python --version`.
2. Đọc **hết** các bài, ghi ra giấy ràng buộc và tên file của từng bài.
3. Xếp bài theo độ dễ với bạn, không nhất thiết theo thứ tự đề.
4. Với mỗi bài, ghi một dòng ý tưởng cho subtask nhỏ nhất.

## Phân bổ thời gian (đề 180 phút, 4 bài)

| Giai đoạn | Thời gian | Việc làm                                     |
| --------- | --------- | -------------------------------------------- |
| Đọc đề    | 10 phút   | Như trên                                     |
| Vòng 1    | 70 phút   | Lời giải đúng cho subtask dễ của mọi bài     |
| Vòng 2    | 70 phút   | Tối ưu bài có nhiều điểm nhất còn thiếu      |
| Kiểm tra  | 30 phút   | Danh sách kiểm bên dưới, test biên, test lớn |

> [!BAY] Sa đà một bài khó
> Mất 2 giờ cho bài khó nhất rồi không kịp lấy điểm dễ ở bài khác. Đặt giờ cho từng bài, hết giờ thì chuyển. Xem [bẫy bỏ qua subtask](/bay-thuong-gap/bo-qua-subtask).

## Danh sách kiểm trước khi nộp (từng bài)

- [ ] Tên file chương trình, file `.INP`, `.OUT` đúng từng chữ, đúng chữ hoa.
- [ ] `DOC_GHI_FILE = True` nếu đề yêu cầu đọc ghi file.
- [ ] Không còn lệnh `print` gỡ lỗi, không in lời nhắc kiểu "Nhap n:".
- [ ] Đã chạy với ví dụ trong đề và kết quả khớp từng ký tự.
- [ ] Đã thử test biên: n nhỏ nhất, mọi số bằng nhau, số âm, giá trị lớn nhất.
- [ ] Đã thử test lớn nhất và đo thời gian.
- [ ] Không dùng hàm cần Python mới hơn máy chấm.
- [ ] Đã lưu file vào đúng thư mục.
