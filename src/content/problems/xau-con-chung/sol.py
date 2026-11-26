import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "XAUCHUNG.INP", "XAUCHUNG.OUT"


def lcs(a, b):
    truoc = [0] * (len(b) + 1)  # [L2]
    for x in a:  # [L3]
        hien = [0]  # [L4]
        for j, y in enumerate(b):  # [L5]
            if x == y:  # [L6]
                hien.append(truoc[j] + 1)
            else:  # [L7]
                hien.append(max(hien[j], truoc[j + 1]))
        truoc = hien  # [L9]
    return truoc[len(b)]  # [L11]


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    a, b = data[0].decode(), data[1].decode()  # [L1]
    out = str(lcs(a, b))
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
