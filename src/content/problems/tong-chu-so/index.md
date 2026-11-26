---
title: Tổng các chữ số
summary: Tính tổng các chữ số của một số nguyên dương có thể dài tới 100 000 chữ số.
source:
  kind: original
  contest: tin-hoc-tre
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài phần thi lập trình Tin học trẻ bảng THCS.
grades: [6, 7]
topics: ['so-hoc', 'xau']
difficulty: 1
io: { mode: stdio, input: TONGCS.INP, output: TONGCS.OUT, program: TONGCS.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 60, constraint: 'n < 10¹⁸' }
  - { percent: 40, constraint: 'n có tới 100 000 chữ số' }
compare: tokens
sampleNotes:
  - '2 + 0 + 2 + 5 = 9.'
  - 'Cộng 13 chữ số được 51.'
hints:
  - 'Không cần đổi n sang số: đọc n như một xâu rồi cộng từng ký tự chữ số.'
  - Với 100 000 chữ số, int(xâu) trên Python mới sẽ báo lỗi vì giới hạn 4300 chữ số. Cách đọc xâu tránh được lỗi này.
algorithms: []
traps: ['so-thuc-lon', 'python-cu-tren-may-cham']
---

## Đề bài

Cho số nguyên dương n. Hãy tính tổng các chữ số của n.

## Dữ liệu vào

Một dòng chứa số n, không có chữ số 0 ở đầu.

## Kết quả

Một số nguyên là tổng các chữ số của n.
