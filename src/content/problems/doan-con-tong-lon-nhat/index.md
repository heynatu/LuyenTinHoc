---
title: Đoạn con tổng lớn nhất
summary: Tìm tổng lớn nhất của một đoạn con liên tiếp khác rỗng bằng quy hoạch động Kadane trong O(n).
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['quy-hoach-dong', 'mang-cong-don']
difficulty: 3
io: { mode: file, input: DOANCON.INP, output: DOANCON.OUT, program: DOANCON.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'n ≤ 300' }
  - { percent: 30, constraint: 'n ≤ 5000' }
  - { percent: 40, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Đoạn 5, −1, 2 có tổng 6, không đoạn nào lớn hơn.'
  - 'Mọi số đều âm: chọn đoạn chỉ gồm số lớn nhất là −3. Đoạn phải khác rỗng nên không được trả lời 0.'
hints:
  - Gọi f[i] là tổng lớn nhất của đoạn kết thúc đúng tại i. Đoạn đó hoặc chỉ gồm a[i], hoặc nối tiếp đoạn tốt nhất kết thúc tại i − 1.
  - f[i] = max(a[i], f[i − 1] + a[i]). Đáp án là f lớn nhất, khởi tạo bằng a[0] chứ không phải 0.
algorithms: ['kadane', 'mang-cong-don']
traps: ['khoi-tao-max-bang-0', 'day-con-lien-tiep']
---

## Đề bài

Cho dãy n số nguyên a₁, a₂, …, aₙ. Hãy tìm tổng lớn nhất của một **đoạn con liên tiếp khác rỗng** aₗ + aₗ₊₁ + … + aᵣ (1 ≤ l ≤ r ≤ n).

## Dữ liệu vào

- Dòng 1: số nguyên n (1 ≤ n ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (|aᵢ| ≤ 10⁹).

## Kết quả

Một số nguyên là tổng lớn nhất tìm được.
