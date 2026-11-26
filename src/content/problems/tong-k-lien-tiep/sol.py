import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "TONGK.INP", "TONGK.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])  # [L1]
    a = list(map(int, data[2:2 + n]))
    s = sum(a[:k])  # [L2]
    tot, vt = s, 0  # không khởi tạo bằng 0: tổng có thể âm
    for i in range(k, n):  # [L3]
        s += a[i] - a[i - k]  # [L4]
        if s > tot:  # [L5] dấu > giữ vị trí nhỏ nhất
            tot, vt = s, i - k + 1
    out = f"{tot} {vt + 1}"  # [L7]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
