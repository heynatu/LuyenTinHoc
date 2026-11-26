# Lời giải trâu: thử mọi số từ 1 đến n (chỉ dùng cho n nhỏ).
with open("TONGUOC.INP") as f:
    n = int(f.read().split()[0])
uoc = [d for d in range(1, n + 1) if n % d == 0]
with open("TONGUOC.OUT", "w") as f:
    f.write(f"{sum(uoc)}\n{len(uoc)}\n")
