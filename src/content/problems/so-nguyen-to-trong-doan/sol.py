import sys
from itertools import accumulate
from math import isqrt

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "NGUYENTO.INP", "NGUYENTO.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    q = int(data[0])  # [L1]
    so = list(map(int, data[1:1 + 2 * q]))
    m = max(2, max(so[1::2]))
    la_nt = bytearray([1]) * (m + 1)  # [L2]
    la_nt[0] = la_nt[1] = 0
    for i in range(2, isqrt(m) + 1):  # [L3]
        if la_nt[i]:  # [L4]
            la_nt[i * i::i] = bytes(len(range(i * i, m + 1, i)))  # [L5] gạch các bội của i
    dem = list(accumulate(la_nt))  # [L8] dem[x] = số nguyên tố ≤ x
    dong = [str(dem[so[k + 1]] - dem[so[k] - 1]) for k in range(0, 2 * q, 2)]  # [L9]
    out = "\n".join(dong)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
