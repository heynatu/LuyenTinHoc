---
title: Tháp Hà Nội
summary: In số lần chuyển ít nhất và toàn bộ các bước chuyển n đĩa từ cọc A sang cọc C theo luật Tháp Hà Nội.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài đệ quy thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THCS.
grades: [8, 9]
topics: ['de-quy']
difficulty: 3
io: { mode: file, input: HANOI.INP, output: HANOI.OUT, program: HANOI.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 60, constraint: 'n ≤ 10' }
  - { percent: 40, constraint: 'n ≤ 16' }
compare: tokens
sampleNotes:
  - 'Đĩa 1 sang B để lấy đường cho đĩa 2 sang C, rồi đĩa 1 từ B sang C. Cách chuyển ít bước nhất là duy nhất nên đáp án duy nhất.'
hints:
  - Muốn chuyển đĩa lớn nhất sang C, n − 1 đĩa phía trên phải nằm hết ở cọc B.
  - 'Viết hàm đệ quy chuyen(k, tu, sang, qua): chuyển k − 1 đĩa sang cọc trung gian, chuyển đĩa k, rồi chuyển k − 1 đĩa về đích.'
algorithms: ['thap-ha-noi']
traps: ['print-trong-vong-lap', 'de-quy-qua-sau']
---

## Đề bài

Có ba cọc A, B, C. Cọc A có n đĩa kích thước khác nhau, đánh số từ 1 (nhỏ nhất) đến n (lớn nhất), đĩa lớn nằm dưới. Mỗi bước được lấy đĩa trên cùng của một cọc đặt sang cọc khác, nhưng không được đặt đĩa lớn lên trên đĩa nhỏ hơn.

Hãy chuyển cả n đĩa sang cọc C với số bước ít nhất.

## Dữ liệu vào

Một dòng chứa số nguyên n (1 ≤ n ≤ 16).

## Kết quả

- Dòng 1: số bước ít nhất.
- Mỗi dòng tiếp theo mô tả một bước theo thứ tự thực hiện, gồm số hiệu đĩa, cọc đi và cọc đến, cách nhau một dấu cách.
