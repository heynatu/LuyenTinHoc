---
title: Đếm số không vượt quá
summary: Trả lời nhiều câu hỏi đếm số phần tử không vượt quá x bằng sắp xếp một lần và tìm kiếm nhị phân.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['tim-kiem-nhi-phan', 'sap-xep']
difficulty: 3
io: { mode: file, input: DEMSO.INP, output: DEMSO.OUT, program: DEMSO.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'n, q ≤ 1000' }
  - { percent: 60, constraint: 'n, q ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Dãy sau khi sắp xếp là 2 2 5 7 9. Có 2 số không vượt quá 2 (tính cả số bằng 2), 3 số không vượt quá 6, cả 5 số không vượt quá 10.'
hints:
  - Đếm bằng vòng lặp cho mỗi câu hỏi mất O(n·q), chỉ đủ subtask 1.
  - Sắp xếp dãy một lần. Số phần tử ≤ x chính là vị trí đầu tiên có giá trị lớn hơn x, tìm bằng tìm kiếm nhị phân (bisect_right).
algorithms: ['tim-kiem-nhi-phan', 'sap-xep-tron']
traps: ['khong-vuot-qua', 'sap-xep-lap-lai']
---

## Đề bài

Cho dãy gồm n số nguyên a₁, a₂, …, aₙ và q câu hỏi. Câu hỏi thứ j cho một số nguyên xⱼ, hãy đếm số phần tử của dãy **không vượt quá** xⱼ.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, q (1 ≤ n, q ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (|aᵢ| ≤ 10⁹).
- q dòng tiếp theo, mỗi dòng một số nguyên xⱼ (|xⱼ| ≤ 10⁹).

## Kết quả

Gồm q dòng, dòng thứ j là câu trả lời cho câu hỏi thứ j.
