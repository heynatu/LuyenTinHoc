# Lời giải đối chiếu: hợp nhất các ô đất kề nhau bằng cấu trúc tập rời nhau (DSU).
with open("DEMVUNG.INP") as f:
    tu = f.read().split()
m, n = int(tu[0]), int(tu[1])
luoi = tu[2:2 + m]
cha = list(range(m * n))


def goc(x):
    while cha[x] != x:
        cha[x] = cha[cha[x]]
        x = cha[x]
    return x


for i in range(m):
    for j in range(n):
        if luoi[i][j] != "#":
            continue
        if i + 1 < m and luoi[i + 1][j] == "#":
            cha[goc(i * n + j)] = goc((i + 1) * n + j)
        if j + 1 < n and luoi[i][j + 1] == "#":
            cha[goc(i * n + j)] = goc(i * n + j + 1)
co = {}
for i in range(m):
    for j in range(n):
        if luoi[i][j] == "#":
            g = goc(i * n + j)
            co[g] = co.get(g, 0) + 1
with open("DEMVUNG.OUT", "w") as f:
    f.write(f"{len(co)} {max(co.values(), default=0)}\n")
