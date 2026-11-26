# Lời giải đối chiếu: Bellman Ford, nới lỏng mọi cạnh n lần (chỉ dùng cho đồ thị nhỏ).
with open("GIAOHANG.INP") as f:
    so = list(map(int, f.read().split()))
n, m = so[0], so[1]
canh = [(so[2 + 3 * k], so[3 + 3 * k], so[4 + 3 * k]) for k in range(m)]
VO_CUNG = 10**18
d = [VO_CUNG] * (n + 1)
d[1] = 0
for _ in range(n):
    for u, v, w in canh:
        if d[u] + w < d[v]:
            d[v] = d[u] + w
        if d[v] + w < d[u]:
            d[u] = d[v] + w
with open("GIAOHANG.OUT", "w") as f:
    f.write(f"{d[n] if d[n] < VO_CUNG else -1}\n")
