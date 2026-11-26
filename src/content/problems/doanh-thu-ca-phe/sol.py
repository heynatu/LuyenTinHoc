import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DOANHTHU.INP", "DOANHTHU.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])  # [L1]
    p = [0] * (n + 1)  # [L2]
    for i in range(n):  # [L3]
        p[i + 1] = p[i] + int(data[2 + i])
    dong = []
    vt = 2 + n
    for _ in range(q):  # [L4]
        dau, cuoi = int(data[vt]), int(data[vt + 1])
        vt += 2
        dong.append(str(p[cuoi] - p[dau - 1]))  # [L5] đề đánh số ngày từ 1
    out = "\n".join(dong)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
