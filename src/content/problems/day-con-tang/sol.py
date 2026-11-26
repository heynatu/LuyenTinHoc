import sys
from bisect import bisect_left

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DAYTANG.INP", "DAYTANG.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1]
    c = []  # [L2] c[k]: giá trị cuối nhỏ nhất của dãy tăng dài k + 1
    for x in map(int, data[1:1 + n]):  # [L3]
        k = bisect_left(c, x)  # [L4] tăng ngặt nên dùng bisect_left
        if k == len(c):  # [L5]
            c.append(x)
        else:  # [L6]
            c[k] = x
    out = str(len(c))  # [L9]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
