# Lời giải trâu: thử mọi xâu con của xâu ngắn hơn (chỉ dùng cho xâu ngắn).
def la_xau_con(s, t):
    it = iter(t)
    return all(c in it for c in s)


with open("XAUCHUNG.INP") as f:
    a, b = f.read().split()[:2]
if len(a) > len(b):
    a, b = b, a
tot = 0
for mask in range(1 << len(a)):
    s = "".join(a[i] for i in range(len(a)) if mask >> i & 1)
    if len(s) > tot and la_xau_con(s, b):
        tot = len(s)
with open("XAUCHUNG.OUT", "w") as f:
    f.write(f"{tot}\n")
