# Lời giải trâu: quy hoạch động thử mọi vị trí cắt (chỉ dùng cho n nhỏ).
with open("CHIADAY.INP") as f:
    so = list(map(int, f.read().split()))
n, k = so[0], so[1]
a = so[2:2 + n]
VO_CUNG = 10**30
f = [[VO_CUNG] * (k + 1) for _ in range(n + 1)]
f[0][0] = 0
for i in range(1, n + 1):
    for j in range(1, k + 1):
        for p in range(j - 1, i):
            f[i][j] = min(f[i][j], max(f[p][j - 1], sum(a[p:i])))
with open("CHIADAY.OUT", "w") as fo:
    fo.write(f"{f[n][k]}\n")
