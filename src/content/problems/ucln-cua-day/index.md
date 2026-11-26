---
title: Ước chung của dãy
summary: Tìm ước chung lớn nhất của cả dãy và ước chung lớn nhất có thể đạt được khi xóa đúng một phần tử.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài số học thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THCS.
grades: [8, 9]
topics: ['so-hoc', 'mang-cong-don']
difficulty: 3
io: { mode: file, input: UCLNDAY.INP, output: UCLNDAY.OUT, program: UCLNDAY.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 50, constraint: 'n ≤ 1000' }
  - { percent: 50, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Số 7 làm ước chung của cả dãy bằng 1. Xóa số 7 thì 12, 18, 24, 30 có ước chung lớn nhất là 6.'
  - 'Xóa số nào thì hai số còn lại vẫn có ước chung 8.'
hints:
  - Dòng 1 chỉ cần gộp dần UCLN(kết quả, aᵢ). Lưu ý UCLN(0, x) = x.
  - Khi xóa aᵢ, phần còn lại là đoạn bên trái cộng đoạn bên phải. Tính trước UCLN của mọi tiền tố và mọi hậu tố.
algorithms: ['euclid-ucln']
traps: ['truong-hop-bien', 'chon-sai-do-phuc-tap']
---

## Đề bài

Cho dãy n số nguyên dương a₁, a₂, …, aₙ.

1. Tìm ước chung lớn nhất (UCLN) của cả dãy.
2. Xóa đúng một phần tử của dãy. Hỏi UCLN của n − 1 số còn lại lớn nhất có thể bằng bao nhiêu?

## Dữ liệu vào

- Dòng 1: số nguyên n (2 ≤ n ≤ 10⁵).
- Dòng 2: n số nguyên dương aᵢ (aᵢ ≤ 10⁹).

## Kết quả

- Dòng 1: UCLN của cả dãy.
- Dòng 2: UCLN lớn nhất sau khi xóa đúng một phần tử.
