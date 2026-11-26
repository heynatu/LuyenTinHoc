import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DOANCON.INP", "DOANCON.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1]
    a = list(map(int, data[1:1 + n]))
    tot = hien = a[0]  # [L2] không khởi tạo bằng 0: đoạn phải khác rỗng
    for x in a[1:]:  # [L3]
        hien = max(x, hien + x)  # [L4] tốt nhất kết thúc tại vị trí này
        tot = max(tot, hien)  # [L5]
    out = str(tot)  # [L7]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
