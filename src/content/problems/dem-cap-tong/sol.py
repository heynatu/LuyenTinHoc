import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DEMCAP.INP", "DEMCAP.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, x = int(data[0]), int(data[1])  # [L1]
    a = sorted(map(int, data[2:2 + n]))
    i, j, dem = 0, n - 1, 0  # [L2]
    while i < j:  # [L3]
        if a[i] + a[j] <= x:  # [L4]
            dem += j - i  # [L5] a[i] ghép được với mọi a[i+1..j]
            i += 1
        else:  # [L6]
            j -= 1  # [L7]
    out = str(dem)  # [L10]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
