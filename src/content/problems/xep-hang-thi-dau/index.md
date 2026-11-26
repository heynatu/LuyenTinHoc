---
title: Xếp hạng thi đấu
summary: Xếp hạng thí sinh theo điểm, thời gian và tên; người bằng cả điểm và thời gian thì đồng hạng.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài sắp xếp thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['sap-xep']
difficulty: 3
io: { mode: file, input: XEPHANG.INP, output: XEPHANG.OUT, program: XEPHANG.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'n ≤ 1000, không có hai người bằng cả điểm và thời gian' }
  - { percent: 60, constraint: 'n ≤ 5·10⁴' }
compare: tokens
sampleNotes:
  - 'An và Dung bằng cả điểm và thời gian nên cùng hạng 3, An đứng trước vì tên xếp trước. Người tiếp theo là hạng 5 chứ không phải hạng 4.'
hints:
  - 'Sắp xếp một lần với key = (−điểm, thời gian, tên): đổi dấu điểm để có thứ tự giảm dần.'
  - Duyệt danh sách đã sắp xếp. Người thứ i (đếm từ 1) nhận hạng i, trừ khi bằng cả điểm và thời gian với người ngay trước thì giữ hạng của người đó.
algorithms: ['sap-xep-tron', 'sap-xep-nhanh']
traps: ['sap-xep-xau-so', 'sai-dinh-dang-output']
---

## Đề bài

Kỳ thi có n thí sinh. Mỗi thí sinh có tên, điểm và thời gian làm bài (phút). Bảng xếp hạng được sắp như sau:

- Điểm cao hơn đứng trước.
- Bằng điểm thì thời gian ít hơn đứng trước.
- Bằng cả điểm và thời gian thì tên đứng trước theo thứ tự từ điển.

Hạng của một thí sinh bằng 1 cộng số thí sinh có thành tích **tốt hơn hẳn** (điểm cao hơn, hoặc bằng điểm mà thời gian ít hơn). Như vậy người bằng cả điểm và thời gian thì đồng hạng.

## Dữ liệu vào

- Dòng 1: số nguyên n (1 ≤ n ≤ 5·10⁴).
- n dòng tiếp theo, mỗi dòng gồm tên, điểm, thời gian. Tên gồm một chữ cái hoa đầu tiên rồi các chữ cái thường tiếng Anh, dài không quá 10 ký tự, các tên khác nhau. Điểm từ 0 đến 300, thời gian từ 0 đến 180.

## Kết quả

Gồm n dòng theo thứ tự của bảng xếp hạng, mỗi dòng gồm hạng, tên, điểm, thời gian.
