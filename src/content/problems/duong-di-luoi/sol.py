import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DUONGDI.INP", "DUONGDI.OUT"
MOD = 10**9 + 7


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    m, n = int(data[0]), int(data[1])  # [L1]
    luoi = data[2:2 + m]
    f = [0] * n  # [L2] f[j]: số đường tới ô (i, j) của dòng đang xét
    for i in range(m):  # [L3]
        dong = luoi[i]
        for j in range(n):  # [L4]
            if dong[j] == 35:  # [L5] mã của '#'
                f[j] = 0
            elif i == 0 and j == 0:  # [L6]
                f[j] = 1
            elif j > 0:  # [L7] f[j] cũ là ô trên, f[j - 1] là ô trái
                f[j] = (f[j] + f[j - 1]) % MOD
    out = str(f[n - 1])  # [L11]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
