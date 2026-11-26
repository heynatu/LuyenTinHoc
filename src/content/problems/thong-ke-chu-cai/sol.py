import sys

DOC_GHI_FILE = False  # đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "THONGKE.INP", "THONGKE.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            text = f.read().decode()
    else:
        text = sys.stdin.buffer.read().decode()  # [L1] đọc cả đoạn văn nhiều dòng
    dem = [0] * 26  # [L2]
    for c in text.lower():  # [L3]
        if "a" <= c <= "z":  # [L4]
            dem[ord(c) - 97] += 1
    dong = []
    for k in range(26):  # [L6]
        if dem[k] > 0:  # [L7]
            dong.append(f"{chr(97 + k)} {dem[k]}")
    out = "\n".join(dong)
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
