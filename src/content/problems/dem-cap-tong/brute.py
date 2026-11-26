# Lời giải trâu: thử mọi cặp i < j.
with open("DEMCAP.INP") as f:
    so = list(map(int, f.read().split()))
n, x = so[0], so[1]
a = so[2:2 + n]
dem = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] + a[j] <= x:
            dem += 1
with open("DEMCAP.OUT", "w") as f:
    f.write(f"{dem}\n")
