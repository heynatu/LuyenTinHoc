# Lời giải trâu: thử xóa từng phần tử rồi tính lại UCLN bằng thuật toán Euclid tự viết.
def ucln(a, b):
    while b:
        a, b = b, a % b
    return a


with open("UCLNDAY.INP") as f:
    so = list(map(int, f.read().split()))
n, a = so[0], so[1:]
ca_day = 0
for x in a:
    ca_day = ucln(ca_day, x)
tot = 0
for bo in range(n):
    g = 0
    for i in range(n):
        if i != bo:
            g = ucln(g, a[i])
    tot = max(tot, g)
with open("UCLNDAY.OUT", "w") as f:
    f.write(f"{ca_day}\n{tot}\n")
