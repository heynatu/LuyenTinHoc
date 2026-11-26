# Lời giải trâu: ghép xâu đã chuẩn hóa rồi so với xâu đảo ngược.
dong = input()
t = ""
for c in dong:
    if c != " " and c != "\r":
        t += c.lower()
print("YES" if t == t[::-1] else "NO")
