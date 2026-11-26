# Lời giải trâu: cộng lại từng đoạn cho mỗi câu hỏi.
with open("DOANHTHU.INP") as f:
    so = list(map(int, f.read().split()))
n, q = so[0], so[1]
a = so[2:2 + n]
dap_an = []
for k in range(q):
    dau, cuoi = so[2 + n + 2 * k], so[3 + n + 2 * k]
    tong = 0
    for ngay in range(dau, cuoi + 1):
        tong += a[ngay - 1]
    dap_an.append(tong)
with open("DOANHTHU.OUT", "w") as f:
    f.write("\n".join(map(str, dap_an)) + "\n")
