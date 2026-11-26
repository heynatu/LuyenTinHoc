---
title: Tổng các ước
summary: Tính tổng và số lượng ước dương của n tới 10¹² bằng cách chỉ duyệt tới căn bậc hai của n.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài số học thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THCS.
grades: [8, 9]
topics: ['so-hoc']
difficulty: 2
io: { mode: file, input: TONGUOC.INP, output: TONGUOC.OUT, program: TONGUOC.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 50, constraint: 'n ≤ 10⁶' }
  - { percent: 50, constraint: 'n ≤ 10¹²' }
compare: tokens
sampleNotes:
  - 'Các ước của 12 là 1, 2, 3, 4, 6, 12: tổng 28, có 6 ước.'
  - 'Các ước của 16 là 1, 2, 4, 8, 16. Ước 4 ghép với chính nó nên chỉ đếm một lần.'
hints:
  - Ước đi theo cặp i và n / i. Chỉ cần duyệt i từ 1 tới căn bậc hai của n.
  - Khi i × i = n, hai ước trong cặp trùng nhau, chỉ cộng một lần.
algorithms: []
traps: ['sqrt-so-lon', 'chon-sai-do-phuc-tap']
---

## Đề bài

Cho số nguyên dương n. Hãy tính tổng tất cả các ước dương của n và cho biết n có bao nhiêu ước dương.

## Dữ liệu vào

Một dòng chứa số nguyên n (1 ≤ n ≤ 10¹²).

## Kết quả

- Dòng 1: tổng các ước dương của n.
- Dòng 2: số lượng ước dương của n.
