import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "CAITUI.INP", "CAITUI.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, suc_chua = int(data[0]), int(data[1])  # [L1]
    f = [0] * (suc_chua + 1)  # [L2]
    for i in range(n):  # [L3]
        w, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        for c in range(suc_chua, w - 1, -1):  # [L4] giảm dần: mỗi món lấy tối đa một lần
            moi = f[c - w] + v  # [L5]
            if moi > f[c]:
                f[c] = moi
    out = str(f[suc_chua])  # [L8]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
