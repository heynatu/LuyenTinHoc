import sys
from heapq import heappop, heappush

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "GIAOHANG.INP", "GIAOHANG.OUT"


def dijkstra(n, ke):
    vo_cung = float("inf")
    d = [vo_cung] * (n + 1)  # [L2]
    d[1] = 0
    heap = [(0, 1)]
    while heap:  # [L3]
        du, u = heappop(heap)  # [L4]
        if du > d[u]:  # [L5] cặp cũ, đã có đường ngắn hơn
            continue
        if u == n:
            break
        for v, w in ke[u]:  # [L6]
            if du + w < d[v]:  # [L7]
                d[v] = du + w
                heappush(heap, (d[v], v))
    return d[n] if d[n] != vo_cung else -1  # [L10]


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])  # [L1]
    ke = [[] for _ in range(n + 1)]
    for k in range(m):
        u, v, w = int(data[2 + 3 * k]), int(data[3 + 3 * k]), int(data[4 + 3 * k])
        ke[u].append((v, w))
        ke[v].append((u, w))  # đường hai chiều
    out = str(dijkstra(n, ke))
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
