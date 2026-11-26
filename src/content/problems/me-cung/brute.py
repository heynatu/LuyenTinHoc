# Lời giải đối chiếu: lặp "khoảng cách = 1 + nhỏ nhất của các ô kề" tới khi không đổi.
with open("MECUNG.INP") as f:
    tu = f.read().split()
m, n = int(tu[0]), int(tu[1])
luoi = tu[2:2 + m]
VO_CUNG = 10**9
d = [[VO_CUNG] * n for _ in range(m)]
for i in range(m):
    for j in range(n):
        if luoi[i][j] == "S":
            d[i][j] = 0
doi = True
while doi:
    doi = False
    for i in range(m):
        for j in range(n):
            if luoi[i][j] == "#":
                continue
            for x, y in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):
                if 0 <= x < m and 0 <= y < n and d[x][y] + 1 < d[i][j]:
                    d[i][j] = d[x][y] + 1
                    doi = True
dap_an = -1
for i in range(m):
    for j in range(n):
        if luoi[i][j] == "T" and d[i][j] < VO_CUNG:
            dap_an = d[i][j]
with open("MECUNG.OUT", "w") as f:
    f.write(f"{dap_an}\n")
