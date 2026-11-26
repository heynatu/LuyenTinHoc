import sys
from collections import deque

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "MECUNG.INP", "MECUNG.OUT"


def bfs(m, n, luoi):
    o = b"".join(luoi)  # ô (i, j) có số thứ tự i * n + j
    s, t = o.index(b"S"), o.index(b"T")  # [L1]
    d = [-1] * (m * n)  # [L2]
    d[s] = 0
    q = deque([s])
    while q:  # [L3]
        u = q.popleft()  # [L4]
        i, j = divmod(u, n)
        ke = ((u - n, i > 0), (u + n, i < m - 1), (u - 1, j > 0), (u + 1, j < n - 1))
        for v, hop_le in ke:  # [L5] ô kề nằm trong lưới
            if hop_le and o[v] != 35 and d[v] == -1:  # [L6] 35 là mã của '#'
                d[v] = d[u] + 1  # [L7]
                q.append(v)
    return d[t]  # [L11]


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    m, n = int(data[0]), int(data[1])
    out = str(bfs(m, n, data[2:2 + m]))
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
