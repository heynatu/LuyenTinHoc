---
title: Nếu thì, chọn việc theo điều kiện
description: Dùng khối "nếu … thì … nếu không thì …" để chương trình tự chọn việc phải làm tùy theo tình huống.
level: tieu-hoc
grade: 5
strand: F
order: 1
minutes: 30
objectives:
  - Nhận biết điều kiện đúng hoặc sai trong một tình huống.
  - Dùng khối nếu thì để chọn một trong hai việc.
  - Kết hợp khối lặp và khối nếu thì để robot tránh tường.
topics: ['re-nhanh']
quiz:
  - q: '"Nếu trời mưa thì mang áo mưa". Hôm nay trời nắng, bạn làm gì?'
    options: ['Mang áo mưa', 'Không mang áo mưa', 'Ở nhà']
    answer: 1
    explain: Điều kiện "trời mưa" sai nên việc trong khối nếu không được làm.
    level: nhan-biet
  - q: Câu nào là một điều kiện (đúng hoặc sai)?
    options: ['Đi thẳng', 'Phía trước có tường', 'Rẽ trái']
    answer: 1
    explain: '"Phía trước có tường" chỉ có thể đúng hoặc sai. Các câu còn lại là lệnh.'
    level: thong-hieu
  - q: 'Robot làm "Nếu phía trước có tường thì Rẽ phải, nếu không thì Tiến". Phía trước không có tường. Robot làm gì?'
    options: ['Rẽ phải', 'Tiến', 'Đứng yên']
    answer: 1
    explain: Điều kiện sai nên robot làm việc ở nhánh "nếu không thì".
    level: van-dung
  - q: Muốn robot đi mãi và tự tránh tường, cần ghép những khối nào?
    options: ['Chỉ khối lặp', 'Chỉ khối nếu thì', 'Khối nếu thì đặt bên trong khối lặp']
    answer: 2
    explain: Mỗi bước robot kiểm tra lại có tường hay không, nên khối nếu thì phải nằm trong khối lặp.
    level: van-dung-cao
---

## Điều kiện đúng hoặc sai

"Phía trước có tường", "điểm của bạn lớn hơn 8", "trời đang mưa" là những **điều kiện**: mỗi điều kiện lúc thì đúng, lúc thì sai. Chương trình dựa vào điều kiện để chọn việc phải làm.

```text
nếu phía trước có tường thì
    Rẽ phải
nếu không thì
    Tiến
```

Khi điều kiện đúng, robot làm các lệnh ở nhánh đầu. Khi điều kiện sai, robot làm các lệnh ở nhánh "nếu không thì".

> [!VI-DU] Tính điểm thưởng
> Nếu bạn làm đúng cả 10 câu thì được thêm một ngôi sao, nếu không thì được lời động viên. Điều kiện ở đây là "đúng cả 10 câu".

## Ghép khối lặp với khối nếu thì

Robot đi trong hành lang có khúc quanh. Ta đặt khối nếu thì vào trong khối lặp để sau mỗi bước, robot lại nhìn xem phía trước có tường không:

```text
lặp lại 10 lần
    nếu phía trước có tường thì
        Rẽ phải
    nếu không thì
        Tiến
```

> [!BAY] Kiểm tra một lần là chưa đủ
> Nếu khối nếu thì đặt ngoài khối lặp, robot chỉ kiểm tra một lần lúc đầu. Gặp tường ở giữa đường, robot vẫn cố tiến.

## Tự luyện

1. Viết quy tắc bằng "nếu … thì … nếu không thì …" cho việc chọn trang phục theo thời tiết.
2. Một số được nhập vào. Viết các bước: nếu số chia hết cho 2 thì nói "chẵn", nếu không thì nói "lẻ".
3. Giải các câu đố robot có tường ở mục [Rèn luyện tư duy](/tu-duy).
