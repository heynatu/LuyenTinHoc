---
title: Dãy con tăng dài nhất
summary: Tìm độ dài dãy con tăng ngặt dài nhất (không cần liên tiếp) của dãy 10⁵ số trong O(n log n).
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài quy hoạch động thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['quy-hoach-dong', 'tim-kiem-nhi-phan']
difficulty: 4
io: { mode: file, input: DAYTANG.INP, output: DAYTANG.OUT, program: DAYTANG.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 50, constraint: 'n ≤ 1000' }
  - { percent: 50, constraint: 'n ≤ 10⁵' }
compare: tokens
sampleNotes:
  - 'Một dãy con tăng dài nhất là 2, 3, 6, 9 (vị trí 2, 5, 6, 7). Dãy con không cần liên tiếp.'
hints:
  - f[i] là độ dài dãy con tăng dài nhất kết thúc tại i, f[i] = 1 + max f[j] với j < i và a[j] < a[i]. Cách này O(n²), đủ subtask 1.
  - Giữ danh sách C, trong đó C[k] là giá trị cuối nhỏ nhất của một dãy tăng dài k + 1. C luôn tăng nên tìm chỗ đặt mỗi số bằng tìm kiếm nhị phân.
algorithms: ['day-con-tang-dai-nhat', 'tim-kiem-nhi-phan']
traps: ['day-con-lien-tiep', 'chon-sai-do-phuc-tap']
---

## Đề bài

Cho dãy n số nguyên a₁, a₂, …, aₙ. Một **dãy con** được tạo bằng cách xóa đi một số phần tử (có thể không xóa phần tử nào) và giữ nguyên thứ tự các phần tử còn lại. Hãy tìm độ dài lớn nhất của một dãy con **tăng ngặt** (phần tử sau lớn hơn hẳn phần tử trước).

## Dữ liệu vào

- Dòng 1: số nguyên n (1 ≤ n ≤ 10⁵).
- Dòng 2: n số nguyên aᵢ (|aᵢ| ≤ 10⁹).

## Kết quả

Một số nguyên là độ dài dãy con tăng ngặt dài nhất.
