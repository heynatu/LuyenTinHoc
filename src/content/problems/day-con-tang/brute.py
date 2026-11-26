# Lời giải trâu: thử mọi tập con các vị trí (chỉ dùng cho n ≤ 12).
with open("DAYTANG.INP") as f:
    so = list(map(int, f.read().split()))
n, a = so[0], so[1:]
tot = 0
for mask in range(1, 1 << n):
    chon = [a[i] for i in range(n) if mask >> i & 1]
    if all(chon[t] < chon[t + 1] for t in range(len(chon) - 1)):
        tot = max(tot, len(chon))
with open("DAYTANG.OUT", "w") as f:
    f.write(f"{tot}\n")
