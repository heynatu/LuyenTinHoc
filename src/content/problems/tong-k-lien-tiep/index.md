---
title: Tổng k số liên tiếp lớn nhất
summary: Tìm đoạn k phần tử liên tiếp có tổng lớn nhất và vị trí bắt đầu nhỏ nhất của nó, dãy có cả số âm.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THCS.
grades: [9, 10]
topics: ['cua-so-truot', 'mang']
difficulty: 2
io: { mode: file, input: TONGK.INP, output: TONGK.OUT, program: TONGK.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'n ≤ 1000' }
  - { percent: 60, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Hai đoạn bắt đầu ở vị trí 2 và 4 cùng có tổng 7; chọn vị trí nhỏ hơn.'
  - 'Mọi số đều âm nên tổng lớn nhất cũng âm. Khởi tạo kết quả bằng 0 sẽ in sai.'
hints:
  - Khi cửa sổ dịch sang phải một ô, chỉ có một số vào và một số ra.
  - Khởi tạo kết quả bằng tổng của đoạn đầu tiên, không phải bằng 0. Chỉ cập nhật khi tổng mới lớn hơn hẳn để giữ vị trí nhỏ nhất.
algorithms: ['cua-so-truot']
traps: ['khoi-tao-max-bang-0', 'lech-chi-so']
---

## Đề bài

Cho dãy n số nguyên a₁, a₂, …, aₙ và số nguyên k. Hãy tìm đoạn gồm đúng k phần tử liên tiếp có tổng lớn nhất. Nếu có nhiều đoạn cùng tổng lớn nhất, chọn đoạn có vị trí bắt đầu nhỏ nhất.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, k (1 ≤ k ≤ n ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (|aᵢ| ≤ 10⁴).

## Kết quả

Hai số nguyên: tổng lớn nhất và vị trí bắt đầu của đoạn (các phần tử đánh số từ 1).
