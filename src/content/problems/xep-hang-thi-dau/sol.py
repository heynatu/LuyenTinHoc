import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "XEPHANG.INP", "XEPHANG.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])  # [L1]
    ts = []
    for i in range(n):
        ten = data[1 + 3 * i].decode()
        diem, tg = int(data[2 + 3 * i]), int(data[3 + 3 * i])
        ts.append((-diem, tg, ten))  # [L2] đổi dấu điểm để điểm cao đứng trước
    ts.sort()  # [L3]
    dong = []
    hang = 0
    for i, (am_diem, tg, ten) in enumerate(ts):  # [L4]
        if i == 0 or ts[i - 1][:2] != (am_diem, tg):  # [L5]
            hang = i + 1  # [L6]
        dong.append(f"{hang} {ten} {-am_diem} {tg}")  # [L8]
    out = "\n".join(dong)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
