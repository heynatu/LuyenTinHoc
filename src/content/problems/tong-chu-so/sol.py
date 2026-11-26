import sys

DOC_GHI_FILE = False  # đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "TONGCS.INP", "TONGCS.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    s = data[0].decode()  # [L1] giữ n ở dạng xâu, không đổi sang số
    tong = 0  # [L2]
    for c in s:  # [L3]
        tong += ord(c) - 48  # [L4] '0' có mã 48
    out = str(tong)  # [L6]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
