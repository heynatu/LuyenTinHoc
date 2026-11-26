import sys
from bisect import bisect_right

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DEMSO.INP", "DEMSO.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])  # [L1]
    a = sorted(map(int, data[2:2 + n]))  # [L2] sắp xếp một lần
    dong = []
    for x in map(int, data[2 + n:2 + n + q]):  # [L3]
        dong.append(str(bisect_right(a, x)))  # [L9] số phần tử ≤ x
    out = "\n".join(dong)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
