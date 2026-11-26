# Lời giải trâu: lọc riêng từng loại bằng phép AND bit cuối.
import sys

so = [int(x) for x in sys.stdin.read().split()]
n, a = so[0], so[1:]
cac_so_chan = [x for x in a[:n] if (x & 1) == 0]
print(len(cac_so_chan))
print(n - len(cac_so_chan))
print(sum(cac_so_chan))
