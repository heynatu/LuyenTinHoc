import sys
from math import isqrt

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "TONGUOC.INP", "TONGUOC.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1]
    tong = dem = 0  # [L2]
    for i in range(1, isqrt(n) + 1):  # [L3] isqrt chính xác với số lớn
        if n % i == 0:  # [L4]
            j = n // i  # [L5]
            tong += i
            dem += 1
            if j != i:  # [L6] số chính phương: không cộng √n hai lần
                tong += j
                dem += 1
    out = f"{tong}\n{dem}"  # [L9]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
