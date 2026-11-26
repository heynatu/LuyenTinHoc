---
title: Đổi tiền
summary: Tìm số tờ tiền ít nhất có tổng đúng bằng S với các mệnh giá cho trước; cách lấy tờ lớn nhất trước không phải lúc nào cũng đúng.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài quy hoạch động thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [10, 11]
topics: ['quy-hoach-dong', 'tham-lam']
difficulty: 3
io: { mode: file, input: DOITIEN.INP, output: DOITIEN.OUT, program: DOITIEN.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'S ≤ 100' }
  - { percent: 70, constraint: 'S ≤ 5·10⁴' }
compare: tokens
sampleNotes:
  - 'Lấy tờ lớn nhất trước được 4 + 1 + 1 (3 tờ), nhưng 3 + 3 chỉ cần 2 tờ.'
  - 'Chỉ có tờ 2 và 4 thì không ghép được số lẻ.'
hints:
  - Tìm một phản ví dụ cho cách lấy tờ lớn nhất trước. Có phản ví dụ thì phải xét mọi khả năng.
  - f[s] là số tờ ít nhất để được s đồng. Tờ cuối cùng có mệnh giá c nào đó, nên f[s] = 1 + min f[s − c].
algorithms: ['doi-tien-it-dong-nhat']
traps: ['truong-hop-bien', 'khoi-tao-max-bang-0']
---

## Đề bài

Có m loại tiền với mệnh giá c₁, c₂, …, cₘ, mỗi loại có số tờ không giới hạn. Hãy tìm số tờ ít nhất để có tổng đúng bằng S đồng.

## Dữ liệu vào

- Dòng 1: hai số nguyên m, S (1 ≤ m ≤ 10, 1 ≤ S ≤ 5·10⁴).
- Dòng 2: m số nguyên cᵢ (1 ≤ cᵢ ≤ 10⁴).

## Kết quả

Số tờ ít nhất, hoặc `-1` nếu không thể ghép đúng S đồng.
