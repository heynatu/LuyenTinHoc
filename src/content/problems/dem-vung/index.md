---
title: Đếm vùng đất
summary: Đếm số vùng đất liền (các ô đất chung cạnh) trên bản đồ lưới và diện tích vùng lớn nhất bằng tìm kiếm theo chiều sâu.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài đồ thị thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['dfs', 'bfs', 'do-thi']
difficulty: 3
io: { mode: file, input: DEMVUNG.INP, output: DEMVUNG.OUT, program: DEMVUNG.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'm, n ≤ 20' }
  - { percent: 70, constraint: 'm, n ≤ 500' }
compare: tokens
sampleNotes:
  - 'Có 4 vùng: góc trên trái (3 ô), góc trên phải (3 ô), giữa dưới (3 ô) và một ô đơn lẻ ở góc dưới phải. Hai ô chỉ chung đỉnh không tính là liền nhau.'
hints:
  - Mỗi lần gặp một ô đất chưa thăm, bạn vừa phát hiện một vùng mới. Loang ra mọi ô đất liền với nó.
  - Lưới 500 × 500 có thể có một vùng 250 000 ô. Hàm đệ quy sẽ vượt giới hạn đệ quy; hãy loang bằng ngăn xếp hoặc hàng đợi tự quản.
algorithms: ['dfs', 'bfs']
traps: ['de-quy-qua-sau', 'truong-hop-bien']
---

## Đề bài

Bản đồ là lưới m dòng, n cột, mỗi ô là `#` (đất) hoặc `.` (nước). Hai ô đất **chung cạnh** thuộc cùng một vùng đất; một vùng gồm mọi ô đất đi tới được nhau qua các ô đất chung cạnh.

Hãy đếm số vùng đất và cho biết vùng lớn nhất có bao nhiêu ô.

## Dữ liệu vào

- Dòng 1: hai số nguyên m, n (1 ≤ m, n ≤ 500).
- m dòng tiếp theo, mỗi dòng là một xâu n ký tự `#` hoặc `.`.

## Kết quả

Hai số nguyên: số vùng đất và số ô của vùng lớn nhất. Nếu không có ô đất nào, in `0 0`.
