---
title: Làm việc theo từng bước
description: Chia một công việc thành các bước rõ ràng, đúng thứ tự, để người khác hoặc robot làm theo được mà không phải đoán.
level: tieu-hoc
grade: 3
strand: F
order: 1
minutes: 25
objectives:
  - Kể được các bước của một việc quen thuộc theo đúng thứ tự.
  - Giải thích được vì sao đổi thứ tự các bước có thể làm hỏng việc.
  - Điều khiển robot trên lưới bằng dãy lệnh Tiến, Rẽ trái, Rẽ phải.
topics: []
quiz:
  - q: Pha một cốc nước cam. Bước nào phải làm trước bước "Khuấy đều"?
    options: ['Cho nước cam và nước vào cốc', 'Uống nước cam', 'Rửa cốc sau khi uống']
    answer: 0
    explain: Phải có nước cam trong cốc thì mới khuấy được.
    level: nhan-biet
  - q: Robot quay mặt sang phải và nhận các lệnh Tiến, Tiến, Rẽ phải, Tiến. Robot đi tất cả bao nhiêu ô?
    options: ['2 ô', '3 ô', '4 ô']
    answer: 1
    explain: Có ba lệnh Tiến, mỗi lệnh đi một ô. Lệnh Rẽ phải chỉ đổi hướng, không đi thêm ô nào.
    level: thong-hieu
  - q: Vì sao khi giao việc cho robot phải ghi rõ từng bước?
    options:
      [
        'Vì robot thích đọc nhiều chữ',
        'Vì robot chỉ làm đúng những gì được bảo, không tự đoán',
        'Vì như vậy robot đi nhanh hơn',
      ]
    answer: 1
    explain: Máy tính và robot không tự đoán ý người dùng; thiếu bước hoặc sai thứ tự là làm sai.
    level: thong-hieu
  - q: Đổi thứ tự hai bước "Đi tất" và "Đi giày" thì sao?
    options: ['Không sao cả', 'Không đi tất vào được vì đã đi giày', 'Đi nhanh hơn']
    answer: 1
    explain: Có những việc bắt buộc phải làm trước việc khác. Thứ tự các bước rất quan trọng.
    level: van-dung
---

## Mỗi việc là một dãy bước

Khi pha một cốc nước cam, bạn làm lần lượt:

1. Lấy một cái cốc sạch.
2. Cho nước cam và nước lọc vào cốc.
3. Khuấy đều.
4. Uống.

Nếu đảo bước 3 lên trước bước 2 thì bạn khuấy một cái cốc rỗng. Một dãy bước rõ ràng, đúng thứ tự để làm xong một việc gọi là **thuật toán**. Từ lớp 6 bạn sẽ học kỹ hơn về thuật toán.

> [!MEO] Thử nói to các bước
> Khi viết các bước cho một việc, hãy đọc to và tưởng tượng mình là người làm theo mà không biết gì trước. Chỗ nào phải đoán là chỗ còn thiếu bước.

## Điều khiển robot trên lưới

Robot đứng trên một lưới ô vuông và chỉ hiểu ba lệnh:

| Lệnh    | Robot làm gì                      |
| ------- | --------------------------------- |
| Tiến    | Đi tới một ô theo hướng đang nhìn |
| Rẽ trái | Quay sang trái, đứng yên tại chỗ  |
| Rẽ phải | Quay sang phải, đứng yên tại chỗ  |

Robot đang nhìn sang phải. Dãy lệnh **Tiến, Tiến, Rẽ phải, Tiến** làm robot đi hai ô sang phải, quay xuống dưới, rồi đi thêm một ô xuống dưới.

> [!BAY] Rẽ không phải là đi
> Lệnh Rẽ chỉ làm robot quay mặt. Muốn sang ô bên cạnh, sau khi rẽ vẫn phải có lệnh Tiến.

## Tự luyện

1. Viết các bước để rửa tay sạch, ít nhất 5 bước.
2. Robot nhìn lên trên, cần đi tới ô cách 2 ô về bên phải và 1 ô lên trên. Viết dãy lệnh ngắn nhất.
3. Vào mục [Rèn luyện tư duy](/tu-duy) và giải các câu đố robot ở mức Khởi động.
