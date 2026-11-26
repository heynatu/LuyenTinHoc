# Lời giải trâu: thử mọi đoạn (dau, cuoi), cộng lại từng đoạn.
with open("DOANCON.INP") as f:
    so = list(map(int, f.read().split()))
n, a = so[0], so[1:]
tot = None
for dau in range(n):
    for cuoi in range(dau, n):
        tong = sum(a[dau:cuoi + 1])
        if tot is None or tong > tot:
            tot = tong
with open("DOANCON.OUT", "w") as f:
    f.write(f"{tot}\n")
