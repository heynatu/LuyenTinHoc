---
title: Xâu con chung dài nhất
summary: Tìm độ dài xâu con chung dài nhất (không cần liên tiếp) của hai xâu dài tới 1000 ký tự bằng quy hoạch động.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài quy hoạch động thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['quy-hoach-dong', 'xau']
difficulty: 4
io: { mode: file, input: XAUCHUNG.INP, output: XAUCHUNG.OUT, program: XAUCHUNG.PY }
limits: { timeMs: 2000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'độ dài mỗi xâu ≤ 15' }
  - { percent: 70, constraint: 'độ dài mỗi xâu ≤ 1000' }
compare: tokens
sampleNotes:
  - 'Một xâu con chung dài nhất là bcba: lấy các ký tự ở vị trí 2, 3, 4, 6 của xâu thứ nhất và 1, 3, 5, 6 của xâu thứ hai.'
hints:
  - Xét ký tự cuối của hai xâu. Nếu bằng nhau, nó có thể là ký tự cuối của xâu con chung.
  - 'f[i][j] là độ dài xâu con chung dài nhất của i ký tự đầu xâu A và j ký tự đầu xâu B. Nếu A[i] = B[j]: f[i][j] = f[i − 1][j − 1] + 1, ngược lại lấy max(f[i − 1][j], f[i][j − 1]).'
algorithms: ['xau-con-chung-dai-nhat']
traps: ['chon-sai-do-phuc-tap', 'day-con-lien-tiep']
---

## Đề bài

Một **xâu con** của xâu S có được bằng cách xóa đi một số ký tự của S (có thể không xóa ký tự nào) và giữ nguyên thứ tự các ký tự còn lại. Cho hai xâu A và B, hãy tìm độ dài lớn nhất của một xâu vừa là xâu con của A vừa là xâu con của B.

## Dữ liệu vào

- Dòng 1: xâu A.
- Dòng 2: xâu B.

Hai xâu chỉ gồm chữ cái thường tiếng Anh, độ dài mỗi xâu từ 1 đến 1000.

## Kết quả

Một số nguyên là độ dài xâu con chung dài nhất.
