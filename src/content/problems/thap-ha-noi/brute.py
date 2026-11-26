# Lời giải đối chiếu không đệ quy: ở bước m, đĩa chuyển là 1 + số bit 0 cuối của m,
# cọc đi (m & (m - 1)) % 3, cọc đến ((m | (m - 1)) + 1) % 3. Với n chẵn, đổi vai B và C.
with open("HANOI.INP") as f:
    n = int(f.read().split()[0])
coc = "ABC" if n % 2 == 1 else "ACB"
dong = [str(2**n - 1)]
for m in range(1, 2**n):
    dia = (m & -m).bit_length()
    tu = (m & (m - 1)) % 3
    sang = ((m | (m - 1)) + 1) % 3
    dong.append(f"{dia} {coc[tu]} {coc[sang]}")
with open("HANOI.OUT", "w") as f:
    f.write("\n".join(dong) + "\n")
