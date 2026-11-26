import sys

DOC_GHI_FILE = False  # đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "CHANLE.INP", "CHANLE.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1] đọc theo token nên số nằm trên dòng nào cũng được
    chan = le = tong = 0  # [L2]
    for x in map(int, data[1:1 + n]):  # [L3]
        if x % 2 == 0:  # [L4]
            chan += 1  # [L5]
            tong += x
        else:  # [L6]
            le += 1  # [L7]
    out = f"{chan}\n{le}\n{tong}"  # [L10]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
