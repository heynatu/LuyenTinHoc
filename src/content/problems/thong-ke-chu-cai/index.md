---
title: Thống kê chữ cái
summary: Đếm số lần xuất hiện của từng chữ cái trong một đoạn văn nhiều dòng, không phân biệt chữ hoa chữ thường, in theo thứ tự a đến z.
source:
  kind: original
  contest: tin-hoc-tre
  level: thcs
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài phần thi lập trình Tin học trẻ bảng THCS.
grades: [7, 8]
topics: ['xau', 'mang']
difficulty: 2
io: { mode: stdio, input: THONGKE.INP, output: THONGKE.OUT, program: THONGKE.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 50, constraint: 'Đoạn văn chỉ có một dòng, ≤ 1000 ký tự' }
  - { percent: 50, constraint: 'Nhiều dòng, tổng ≤ 10⁵ ký tự' }
compare: tokens
sampleNotes:
  - 'Chữ l xuất hiện 3 lần (hai lần trong Hello, một lần trong Lai). Dấu phẩy, dấu chấm than và dấu cách không được đếm.'
hints:
  - Dùng một mảng 26 phần tử, phần tử thứ k đếm chữ cái thứ k.
  - Đọc toàn bộ đoạn văn một lần, kể cả các dòng sau.
algorithms: []
traps: ['sai-dinh-dang-output', 'doc-theo-token']
---

## Đề bài

Cho một đoạn văn gồm chữ cái tiếng Anh, chữ số, dấu cách và dấu câu, có thể gồm nhiều dòng. Hãy đếm số lần xuất hiện của từng chữ cái, coi chữ hoa và chữ thường là một.

## Dữ liệu vào

Đoạn văn, tổng độ dài không quá 10⁵ ký tự. Đoạn văn có ít nhất một chữ cái.

## Kết quả

Mỗi chữ cái xuất hiện ít nhất một lần được in trên một dòng gồm chữ cái đó (viết thường) và số lần xuất hiện, cách nhau một dấu cách. Các dòng theo thứ tự từ `a` đến `z`.
