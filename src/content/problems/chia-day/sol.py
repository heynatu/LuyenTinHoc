import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "CHIADAY.INP", "CHIADAY.OUT"


def chia_duoc(a, k, x):  # [L8]
    so_doan, tong = 1, 0
    for v in a:
        tong += v
        if tong > x:  # mở đoạn mới bắt đầu từ v
            so_doan += 1
            tong = v
            if so_doan > k:
                return False
    return True


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])  # [L1]
    a = list(map(int, data[2:2 + n]))
    lo, hi = max(a), sum(a)  # [L2] lo ≥ max nên mỗi số luôn vừa một đoạn
    while lo < hi:  # [L3]
        giua = (lo + hi) // 2  # [L4]
        if chia_duoc(a, k, giua):  # [L5]
            hi = giua
        else:
            lo = giua + 1
    out = str(lo)  # [L7]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
