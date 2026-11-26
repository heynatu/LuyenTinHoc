---
title: Đường đi trên lưới
summary: Đếm số đường đi chỉ sang phải hoặc xuống dưới trên lưới có ô cấm, lấy số dư khi chia cho 10⁹ + 7.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài quy hoạch động thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['quy-hoach-dong', 'to-hop']
difficulty: 3
io: { mode: file, input: DUONGDI.INP, output: DUONGDI.OUT, program: DUONGDI.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'm, n ≤ 10' }
  - { percent: 70, constraint: 'm, n ≤ 500' }
compare: tokens
sampleNotes:
  - 'Ô giữa bị cấm nên chỉ còn hai đường: đi vòng theo hàng trên cùng rồi xuống, hoặc xuống trước rồi đi theo hàng dưới cùng.'
hints:
  - Bước cuối cùng tới ô (i, j) đến từ ô phía trên hoặc ô bên trái.
  - f[i][j] = f[i − 1][j] + f[i][j − 1], ô cấm có f = 0. Lấy số dư ở mỗi bước cộng.
algorithms: ['dem-duong-di-tren-luoi']
traps: ['quen-lay-du', 'mang-hai-chieu-dung-chung']
---

## Đề bài

Cho lưới m dòng, n cột. Mỗi ô là `.` (đi được) hoặc `#` (bị cấm). Một robot xuất phát ở ô trên cùng bên trái, mỗi bước chỉ được đi sang ô bên phải hoặc ô bên dưới, không được vào ô cấm. Hỏi có bao nhiêu cách đi tới ô dưới cùng bên phải?

Vì số cách có thể rất lớn, hãy in số dư khi chia cho 10⁹ + 7.

## Dữ liệu vào

- Dòng 1: hai số nguyên m, n (1 ≤ m, n ≤ 500).
- m dòng tiếp theo, mỗi dòng là một xâu n ký tự `.` hoặc `#`.

## Kết quả

Số cách đi chia lấy dư cho 10⁹ + 7. Nếu ô xuất phát hoặc ô đích bị cấm, in 0.
