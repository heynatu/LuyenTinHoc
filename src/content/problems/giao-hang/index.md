---
title: Giao hàng
summary: Tìm quãng đường ngắn nhất từ kho số 1 tới điểm giao hàng số n trên mạng đường có độ dài bằng thuật toán Dijkstra.
source:
  kind: original
  contest: hsg-tinh-gia-lai
  level: thpt
  year: null
  round: null
  reference: null
  note: Đề luyện biên soạn theo dạng bài đồ thị thường gặp ở kỳ thi học sinh giỏi cấp tỉnh THPT.
grades: [11, 12]
topics: ['duong-di-ngan-nhat', 'do-thi']
difficulty: 4
io: { mode: file, input: GIAOHANG.INP, output: GIAOHANG.OUT, program: GIAOHANG.PY }
limits: { timeMs: 1000, memoryMb: 256 }
scoring: { mode: per-test, points: 5 }
subtasks:
  - { percent: 30, constraint: 'n ≤ 100, m ≤ 1000' }
  - { percent: 70, constraint: 'n ≤ 10⁵, m ≤ 2·10⁵' }
compare: tokens
sampleNotes:
  - 'Đường 1 → 3 → 2 → 4 → 5 dài 1 + 2 + 5 + 3 = 11. Đi thẳng 1 → 2 đã mất 4, còn đi 3 → 4 mất 8.'
hints:
  - BFS chỉ đúng khi mọi đường dài như nhau. Ở đây mỗi đường có độ dài riêng.
  - Dijkstra lấy ra điểm có khoảng cách tạm nhỏ nhất bằng heapq, rồi cập nhật các điểm kề. Bỏ qua phần tử cũ trong heap khi khoảng cách đã lỗi thời.
algorithms: ['dijkstra']
traps: ['do-thi-khong-lien-thong', 'doc-du-lieu-cham']
---

## Đề bài

Thành phố có n điểm đánh số từ 1 đến n và m con đường hai chiều. Con đường thứ i nối điểm uᵢ với điểm vᵢ và dài wᵢ mét. Xe giao hàng xuất phát từ kho ở điểm 1. Hãy tìm độ dài quãng đường ngắn nhất từ điểm 1 tới điểm n.

Giữa hai điểm có thể có nhiều con đường; có thể có đường nối một điểm với chính nó.

## Dữ liệu vào

- Dòng 1: hai số nguyên n, m (1 ≤ n ≤ 10⁵, 0 ≤ m ≤ 2·10⁵).
- m dòng tiếp theo, mỗi dòng ba số nguyên uᵢ, vᵢ, wᵢ (1 ≤ uᵢ, vᵢ ≤ n, 1 ≤ wᵢ ≤ 10⁶).

## Kết quả

Độ dài quãng đường ngắn nhất, hoặc `-1` nếu không có đường từ điểm 1 tới điểm n.
