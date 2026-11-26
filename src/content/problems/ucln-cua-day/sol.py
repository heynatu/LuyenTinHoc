import sys
from math import gcd

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "UCLNDAY.INP", "UCLNDAY.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1]
    a = list(map(int, data[1:1 + n]))
    trai = [0] * (n + 1)  # [L2] trai[i] = UCLN của i phần tử đầu
    for i in range(n):
        trai[i + 1] = gcd(trai[i], a[i])
    phai = [0] * (n + 1)  # [L3] phai[i] = UCLN từ phần tử i tới hết
    for i in range(n - 1, -1, -1):
        phai[i] = gcd(phai[i + 1], a[i])
    tot = 0  # [L4]
    for i in range(n):  # [L5]
        tot = max(tot, gcd(trai[i], phai[i + 1]))  # [L6] xóa phần tử i
    out = f"{trai[n]}\n{tot}"  # [L8]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
