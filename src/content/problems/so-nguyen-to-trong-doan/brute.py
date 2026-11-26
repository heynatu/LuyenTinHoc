# Lời giải trâu: kiểm tra từng số trong đoạn bằng cách chia thử.
def nguyen_to(x):
    if x < 2:
        return False
    d = 2
    while d * d <= x:
        if x % d == 0:
            return False
        d += 1
    return True


with open("NGUYENTO.INP") as f:
    so = list(map(int, f.read().split()))
q = so[0]
ket_qua = []
for k in range(q):
    a, b = so[1 + 2 * k], so[2 + 2 * k]
    ket_qua.append(sum(1 for x in range(a, b + 1) if nguyen_to(x)))
with open("NGUYENTO.OUT", "w") as f:
    f.write("\n".join(map(str, ket_qua)) + "\n")
