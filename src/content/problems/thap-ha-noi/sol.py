import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "HANOI.INP", "HANOI.OUT"


def chuyen(k, tu, sang, qua, buoc):  # [L1]
    if k == 0:  # [L2]
        return
    chuyen(k - 1, tu, qua, sang, buoc)  # [L3]
    buoc.append(f"{k} {tu} {sang}")  # [L4]
    chuyen(k - 1, qua, sang, tu, buoc)  # [L5]


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L7]
    buoc = [str(2**n - 1)]
    chuyen(n, "A", "C", "B", buoc)
    out = "\n".join(buoc)  # ghi một lần, không print từng dòng
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
