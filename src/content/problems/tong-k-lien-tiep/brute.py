# Lời giải trâu: tính lại tổng của mọi đoạn k phần tử.
with open("TONGK.INP") as f:
    so = list(map(int, f.read().split()))
n, k = so[0], so[1]
a = so[2:2 + n]
tot, vt = None, None
for bat_dau in range(1, n - k + 2):
    tong = sum(a[bat_dau - 1:bat_dau - 1 + k])
    if tot is None or tong > tot:
        tot, vt = tong, bat_dau
with open("TONGK.OUT", "w") as f:
    f.write(f"{tot} {vt}\n")
