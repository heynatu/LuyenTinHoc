---
title: Mê cung
summary: Tìm số bước ít nhất để đi từ S tới T trong mê cung lưới bằng tìm kiếm theo chiều rộng, in −1 nếu không tới được.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài đồ thị thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['bfs', 'do-thi', 'hang-doi']
difficulty: 3
io: { mode: file, input: MECUNG.INP, output: MECUNG.OUT, program: MECUNG.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'm, n ≤ 10' }
  - { percent: 70, constraint: 'm, n ≤ 500' }
compare: tokens
sampleNotes:
  - 'Đường ngắn nhất đi xuống cột 1, sang phải theo dòng 3, xuống dòng 4 rồi vòng lên T: 8 bước. Đường theo dòng 1 bị tường chặn.'
hints:
  - Mỗi ô là một đỉnh, nối với tối đa 4 ô kề không phải tường. Mọi bước dài như nhau.
  - Tìm kiếm theo chiều rộng thăm các ô theo thứ tự số bước tăng dần. Dùng collections.deque, đừng dùng list.pop(0).
algorithms: ['bfs-me-cung', 'bfs']
traps: ['pop-dau-danh-sach', 'do-thi-khong-lien-thong']
---

## Đề bài

Mê cung là lưới m dòng, n cột. Mỗi ô là `.` (đường đi), `#` (tường), `S` (xuất phát) hoặc `T` (đích); có đúng một ô `S` và một ô `T`. Mỗi bước, bạn đi từ một ô sang ô chung cạnh (lên, xuống, trái, phải) không phải tường.

Hãy tìm số bước ít nhất để đi từ S tới T.

## Dữ liệu vào

- Dòng 1: hai số nguyên m, n (1 ≤ m, n ≤ 500, m·n ≥ 2).
- m dòng tiếp theo, mỗi dòng là một xâu n ký tự.

## Kết quả

Số bước ít nhất, hoặc `-1` nếu không đi tới T được.
