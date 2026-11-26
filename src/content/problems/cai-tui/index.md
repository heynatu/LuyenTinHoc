---
title: Cái túi
summary: Chọn các món đồ có tổng khối lượng không vượt quá sức chứa để tổng giá trị lớn nhất, mỗi món lấy tối đa một lần.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài quy hoạch động thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['quy-hoach-dong']
difficulty: 4
io: { mode: file, input: CAITUI.INP, output: CAITUI.OUT, program: CAITUI.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'n ≤ 20' }
  - { percent: 70, constraint: 'n ≤ 100, W ≤ 10⁴' }
compare: tokens
sampleNotes:
  - 'Lấy món 2 (nặng 4, giá trị 40) và món 4 (nặng 3, giá trị 50): tổng nặng 7, giá trị 90. Không cách chọn nào tốt hơn.'
hints:
  - 'Với n ≤ 20, thử mọi tập con: 2²⁰ ≈ 10⁶ cách.'
  - 'f[c] là giá trị lớn nhất với sức chứa c. Xét từng món, duyệt c từ W giảm dần: f[c] = max(f[c], f[c − w] + v). Duyệt giảm dần để mỗi món chỉ được lấy một lần.'
algorithms: ['cai-tui-0-1']
traps: ['mang-hai-chieu-dung-chung', 'chon-sai-do-phuc-tap']
---

## Đề bài

Bạn có một chiếc túi chịu được khối lượng tối đa W và n món đồ. Món thứ i nặng wᵢ và có giá trị vᵢ. Hãy chọn một số món (mỗi món lấy không quá một lần) sao cho tổng khối lượng không vượt quá W và tổng giá trị lớn nhất.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, W (1 ≤ n ≤ 100, 1 ≤ W ≤ 10⁴).
- n dòng tiếp theo, dòng thứ i gồm hai số nguyên wᵢ, vᵢ (1 ≤ wᵢ ≤ 10⁴, 1 ≤ vᵢ ≤ 10⁶).

## Kết quả

Một số nguyên là tổng giá trị lớn nhất.
