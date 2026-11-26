---
title: Doanh thu quán cà phê
summary: Trả lời nhiều câu hỏi tổng doanh thu từ ngày l đến ngày r bằng mảng cộng dồn, mỗi câu hỏi một phép trừ.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['mang-cong-don']
difficulty: 2
io: { mode: file, input: DOANHTHU.INP, output: DOANHTHU.OUT, program: DOANHTHU.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'n, q ≤ 1000' }
  - { percent: 60, constraint: 'n, q ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Ngày 1 đến 3: 120 + 80 + 150 = 350. Ngày 2 đến 5: 80 + 150 + 90 + 200 = 520. Ngày 4 đến 4: 90.'
hints:
  - Cộng lại từng đoạn mất O(n) mỗi câu hỏi, chỉ đủ subtask 1.
  - Gọi P[i] là tổng i ngày đầu. Tổng từ ngày l đến ngày r bằng P[r] − P[l − 1].
algorithms: ['mang-cong-don']
traps: ['lech-chi-so', 'doc-du-lieu-cham']
---

## Đề bài

Một quán cà phê ghi lại doanh thu (nghìn đồng) của n ngày liên tiếp, ngày thứ i thu được aᵢ. Chủ quán có q câu hỏi, mỗi câu hỏi gồm hai số l, r: tổng doanh thu từ ngày l đến ngày r (tính cả hai ngày) là bao nhiêu?

## Dữ liệu vào

- Dòng 1: hai số nguyên n, q (1 ≤ n, q ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (0 ≤ aᵢ ≤ 10⁶).
- q dòng tiếp theo, mỗi dòng hai số nguyên l, r (1 ≤ l ≤ r ≤ n).

## Kết quả

Gồm q dòng, dòng thứ j là câu trả lời cho câu hỏi thứ j.
