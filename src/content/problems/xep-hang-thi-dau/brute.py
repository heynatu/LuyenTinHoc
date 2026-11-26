# Lời giải trâu: sắp xếp chèn với hàm so sánh tự viết; hạng = 1 + số người tốt hơn hẳn.
def truoc(x, y):
    if x[1] != y[1]:
        return x[1] > y[1]
    if x[2] != y[2]:
        return x[2] < y[2]
    return x[0] < y[0]


with open("XEPHANG.INP") as f:
    tu = f.read().split()
n = int(tu[0])
ts = [(tu[1 + 3 * i], int(tu[2 + 3 * i]), int(tu[3 + 3 * i])) for i in range(n)]
xep = []
for t in ts:
    k = len(xep)
    xep.append(t)
    while k > 0 and truoc(t, xep[k - 1]):
        xep[k] = xep[k - 1]
        k -= 1
    xep[k] = t
dong = []
for t in xep:
    tot_hon = sum(1 for u in ts if u[1] > t[1] or (u[1] == t[1] and u[2] < t[2]))
    dong.append(f"{tot_hon + 1} {t[0]} {t[1]} {t[2]}")
with open("XEPHANG.OUT", "w") as f:
    f.write("\n".join(dong) + "\n")
