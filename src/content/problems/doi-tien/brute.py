# Lời giải đối chiếu: BFS trên các số tiền, mỗi cạnh là thêm một tờ.
from collections import deque

with open("DOITIEN.INP") as f:
    so = list(map(int, f.read().split()))
m, s_can = so[0], so[1]
menh_gia = so[2:2 + m]
so_to = {0: 0}
hang = deque([0])
while hang:
    x = hang.popleft()
    for c in menh_gia:
        y = x + c
        if y <= s_can and y not in so_to:
            so_to[y] = so_to[x] + 1
            hang.append(y)
with open("DOITIEN.OUT", "w") as f:
    f.write(f"{so_to.get(s_can, -1)}\n")
