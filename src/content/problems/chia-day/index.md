---
title: Chia dãy
summary: Chia dãy thành k đoạn liên tiếp sao cho tổng lớn nhất của các đoạn nhỏ nhất, bằng chặt nhị phân theo đáp án.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['chat-nhi-phan', 'tham-lam']
difficulty: 4
io: { mode: file, input: CHIADAY.INP, output: CHIADAY.OUT, program: CHIADAY.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'n ≤ 100' }
  - { percent: 70, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Chia thành 7, 2, 5 (tổng 14) và 10, 8 (tổng 18): tổng lớn nhất là 18. Mọi cách chia khác đều có một đoạn tổng lớn hơn 18.'
  - 'k = n: mỗi số một đoạn, đáp án là số lớn nhất.'
hints:
  - 'Câu hỏi ngược lại dễ hơn: với giới hạn x, có chia được thành không quá k đoạn, mỗi đoạn tổng ≤ x không? Đi từ trái sang, đoạn nào sắp vượt x thì mở đoạn mới.'
  - Nếu x làm được thì mọi x lớn hơn cũng làm được. Tìm x nhỏ nhất bằng tìm kiếm nhị phân trong đoạn [max aᵢ, tổng aᵢ].
algorithms: ['tim-kiem-nhi-phan']
traps: ['lech-chi-so', 'chon-sai-do-phuc-tap']
---

## Đề bài

Cho dãy n số nguyên dương a₁, a₂, …, aₙ và số nguyên k. Hãy chia dãy thành đúng k đoạn liên tiếp khác rỗng (mỗi phần tử thuộc đúng một đoạn) sao cho tổng lớn nhất trong các tổng đoạn là nhỏ nhất có thể.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, k (1 ≤ k ≤ n ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả

Một số nguyên là giá trị nhỏ nhất có thể của tổng đoạn lớn nhất.
