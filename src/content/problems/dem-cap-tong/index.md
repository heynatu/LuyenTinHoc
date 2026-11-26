---
title: Đếm cặp có tổng không vượt quá X
summary: Đếm số cặp chỉ số i < j có aᵢ + aⱼ ≤ X trong dãy 10⁵ số bằng sắp xếp và hai con trỏ.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['hai-con-tro', 'sap-xep']
difficulty: 3
io: { mode: file, input: DEMCAP.INP, output: DEMCAP.OUT, program: DEMCAP.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'n ≤ 2000' }
  - { percent: 60, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Các cặp thỏa mãn: 1 + 5, 1 + 3, 1 + 7 (bằng 8 vẫn được vì là không vượt quá), 5 + 3.'
hints:
  - Thứ tự các số không ảnh hưởng tới số cặp, nên có thể sắp xếp dãy trước.
  - Trên dãy tăng, nếu a[i] + a[j] ≤ X thì a[i] ghép được với mọi số từ a[i + 1] đến a[j].
algorithms: ['hai-con-tro']
traps: ['khong-vuot-qua', 'chon-sai-do-phuc-tap']
---

## Đề bài

Cho dãy n số nguyên a₁, a₂, …, aₙ và số nguyên X. Hãy đếm số cặp chỉ số (i, j) với i < j sao cho aᵢ + aⱼ ≤ X.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, X (2 ≤ n ≤ 10⁵, |X| ≤ 2·10⁹).
- Dòng 2: n số nguyên aᵢ (|aᵢ| ≤ 10⁹).

## Kết quả

Một số nguyên là số cặp thỏa mãn.
