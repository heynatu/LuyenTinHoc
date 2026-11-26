---
title: Đếm số chẵn, số lẻ
summary: Đếm số chẵn, số lẻ và tính tổng các số chẵn của một dãy số nguyên có cả số âm, dữ liệu có thể nằm trên nhiều dòng.
source:
  kind: original
  contest: tin-hoc-tre
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài phần thi lập trình Tin học trẻ bảng THCS.
grades: [6, 7]
topics: ['mang', 'vong-lap']
difficulty: 1
io: { mode: stdio, input: CHANLE.INP, output: CHANLE.OUT, program: CHANLE.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 50, constraint: 'n ≤ 1000, các số nằm trên một dòng' }
  - { percent: 50, constraint: 'n ≤ 10⁵, các số có thể nằm trên nhiều dòng' }
compare: tokens
sampleNotes:
  - 'Số chẵn: −4, 0, 10 (tổng 6). Số lẻ: 3, 7, −5. Số 0 là số chẵn; các số nằm trên hai dòng.'
hints:
  - Đọc toàn bộ dữ liệu rồi tách theo khoảng trắng, không phụ thuộc số nằm trên dòng nào.
  - Trong Python, x % 2 luôn là 0 hoặc 1 kể cả khi x âm.
algorithms: []
traps: ['doc-theo-token', 'doc-du-lieu-cham']
---

## Đề bài

Cho dãy gồm n số nguyên a₁, a₂, …, aₙ. Hãy đếm số lượng số chẵn, số lượng số lẻ và tính tổng các số chẵn trong dãy.

## Dữ liệu vào

- Dòng đầu chứa số nguyên n (1 ≤ n ≤ 10⁵).
- Tiếp theo là n số nguyên aᵢ (|aᵢ| ≤ 10⁶), cách nhau bởi dấu cách hoặc xuống dòng.

## Kết quả

Ba dòng: số lượng số chẵn, số lượng số lẻ, tổng các số chẵn.
