# Lời giải trâu: thử mọi tập con bằng bitmask (chỉ dùng cho n nhỏ).
with open("CAITUI.INP") as f:
    so = list(map(int, f.read().split()))
n, suc_chua = so[0], so[1]
mon = [(so[2 + 2 * i], so[3 + 2 * i]) for i in range(n)]
tot = 0
for mask in range(1 << n):
    nang = sum(mon[i][0] for i in range(n) if mask >> i & 1)
    if nang <= suc_chua:
        tot = max(tot, sum(mon[i][1] for i in range(n) if mask >> i & 1))
with open("CAITUI.OUT", "w") as f:
    f.write(f"{tot}\n")
