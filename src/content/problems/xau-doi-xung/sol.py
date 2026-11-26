import sys

DOC_GHI_FILE = False  # đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "XAUDX.INP", "XAUDX.OUT"


def doi_xung(dong):
    t = [c.lower() for c in dong if c.isalnum()]  # [L2] bỏ dấu cách, cả \r nếu có
    i, j = 0, len(t) - 1  # [L3]
    while i < j:  # [L4]
        if t[i] != t[j]:  # [L5]
            return False
        i += 1  # [L6]
        j -= 1
    return True  # [L8]


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            text = f.read().decode()
    else:
        text = sys.stdin.buffer.read().decode()
    dong = text.split("\n")[0]  # [L1]
    out = "YES" if doi_xung(dong) else "NO"
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
