# Lời giải trâu: với mỗi câu hỏi, duyệt cả dãy để đếm.
with open("DEMSO.INP") as f:
    so = list(map(int, f.read().split()))
n, q = so[0], so[1]
a = so[2:2 + n]
dap_an = []
for x in so[2 + n:2 + n + q]:
    dem = 0
    for v in a:
        if v <= x:
            dem += 1
    dap_an.append(dem)
with open("DEMSO.OUT", "w") as f:
    f.write("\n".join(map(str, dap_an)) + "\n")
