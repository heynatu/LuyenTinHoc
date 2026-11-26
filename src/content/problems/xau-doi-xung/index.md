---
title: Xâu đối xứng
summary: Kiểm tra một câu có đọc xuôi đọc ngược như nhau không khi bỏ qua dấu cách và không phân biệt chữ hoa chữ thường.
source:
  kind: original
  contest: tin-hoc-tre
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài phần thi lập trình Tin học trẻ bảng THCS.
grades: [7, 8]
topics: ['xau', 'hai-con-tro']
difficulty: 2
io: { mode: stdio, input: XAUDX.INP, output: XAUDX.OUT, program: XAUDX.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'S chỉ gồm chữ cái thường, không có dấu cách' }
  - { percent: 60, constraint: 'Đầy đủ: có chữ hoa, chữ số, dấu cách; độ dài ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Bỏ dấu cách và đổi về chữ thường được neveroddoreven, đọc ngược vẫn vậy.'
  - 'tinhoctre đọc ngược là ertcohnit.'
hints:
  - Tạo xâu mới chỉ gồm các ký tự khác dấu cách, đã đổi về chữ thường.
  - So sánh ký tự đầu với cuối, thứ hai với áp chót… bằng hai con trỏ đi vào giữa.
algorithms: ['hai-con-tro']
traps: ['ky-tu-xuong-dong-windows', 'truong-hop-bien']
---

## Đề bài

Một câu được gọi là **đối xứng** nếu sau khi bỏ hết dấu cách và coi chữ hoa như chữ thường, câu đọc từ trái sang phải giống hệt đọc từ phải sang trái.

Cho câu S, hãy cho biết S có đối xứng không.

## Dữ liệu vào

Một dòng chứa câu S gồm chữ cái tiếng Anh (hoa hoặc thường), chữ số và dấu cách. S có ít nhất một ký tự khác dấu cách, độ dài không quá 10⁵.

## Kết quả

In `YES` nếu S đối xứng, ngược lại in `NO`.
