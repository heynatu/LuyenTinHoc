import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DOITIEN.INP", "DOITIEN.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    m, s_can = int(data[0]), int(data[1])  # [L1]
    menh_gia = list(map(int, data[2:2 + m]))
    vo_cung = s_can + 1  # không bao giờ cần quá S tờ
    f = [vo_cung] * (s_can + 1)  # [L2]
    f[0] = 0
    for s in range(1, s_can + 1):  # [L3]
        for c in menh_gia:  # [L4]
            if c <= s and f[s - c] + 1 < f[s]:  # [L5]
                f[s] = f[s - c] + 1
    out = str(f[s_can] if f[s_can] < vo_cung else -1)  # [L8]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
