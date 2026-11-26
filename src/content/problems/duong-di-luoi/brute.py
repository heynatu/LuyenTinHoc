# Lời giải trâu: liệt kê mọi đường đi bằng ngăn xếp (chỉ dùng cho lưới nhỏ).
with open("DUONGDI.INP") as f:
    tu = f.read().split()
m, n = int(tu[0]), int(tu[1])
luoi = tu[2:2 + m]
dem = 0
if luoi[0][0] == "." and luoi[m - 1][n - 1] == ".":
    ngan_xep = [(0, 0)]
    while ngan_xep:
        i, j = ngan_xep.pop()
        if (i, j) == (m - 1, n - 1):
            dem += 1
            continue
        for di, dj in ((1, 0), (0, 1)):
            x, y = i + di, j + dj
            if x < m and y < n and luoi[x][y] == ".":
                ngan_xep.append((x, y))
with open("DUONGDI.OUT", "w") as f:
    f.write(f"{dem % (10**9 + 7)}\n")
