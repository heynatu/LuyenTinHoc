---
title: Số nguyên tố trong đoạn
summary: Trả lời tới 10⁵ câu hỏi đếm số nguyên tố trong đoạn [a, b] bằng sàng Eratosthenes và mảng cộng dồn.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài số học thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THCS.
grades: [9]
topics: ['so-nguyen-to', 'mang-cong-don']
difficulty: 3
io: { mode: file, input: NGUYENTO.INP, output: NGUYENTO.OUT, program: NGUYENTO.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 40, constraint: 'q ≤ 100, b ≤ 10⁴' }
  - { percent: 60, constraint: 'q ≤ 10⁵, b ≤ 10⁶' }
compare: tokens
sampleNotes:
  - 'Đoạn [1, 10] có 2, 3, 5, 7. Đoạn [11, 20] có 11, 13, 17, 19. Số 1 không phải số nguyên tố.'
hints:
  - Kiểm tra từng số bằng cách chia thử tới căn bậc hai chỉ đủ cho subtask 1.
  - Sàng một lần tới b lớn nhất, rồi lập mảng dem[x] là số nguyên tố không vượt quá x. Mỗi câu hỏi trả lời bằng một phép trừ.
algorithms: ['sang-eratosthenes', 'mang-cong-don']
traps: ['so-1-khong-nguyen-to', 'print-trong-vong-lap']
---

## Đề bài

Cho q câu hỏi, mỗi câu hỏi gồm hai số a, b. Với mỗi câu hỏi, hãy đếm số lượng số nguyên tố trong đoạn [a, b] (tính cả a và b).

## Dữ liệu vào

- Dòng 1: số nguyên q (1 ≤ q ≤ 10⁵).
- q dòng tiếp theo, mỗi dòng hai số nguyên a, b (1 ≤ a ≤ b ≤ 10⁶).

## Kết quả

Gồm q dòng, dòng thứ i là câu trả lời cho câu hỏi thứ i.
