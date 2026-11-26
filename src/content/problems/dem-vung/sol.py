import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "DEMVUNG.INP", "DEMVUNG.OUT"


def dem_vung(m, n, luoi):
    o = b"".join(luoi)  # ô (i, j) có số thứ tự i * n + j; 35 là mã của '#'
    dem = lon_nhat = 0  # [L2]
    da_tham = bytearray(m * n)
    for s in range(m * n):  # [L3]
        if o[s] != 35 or da_tham[s]:
            continue
        dem += 1  # [L4]
        da_tham[s] = 1
        ngan_xep = [s]
        co = 0
        while ngan_xep:  # [L5]
            u = ngan_xep.pop()  # [L6]
            co += 1
            i, j = divmod(u, n)
            ke = ((u - n, i > 0), (u + n, i < m - 1), (u - 1, j > 0), (u + 1, j < n - 1))
            for v, hop_le in ke:  # [L7] ô kề nằm trong lưới
                if hop_le and o[v] == 35 and not da_tham[v]:
                    da_tham[v] = 1  # [L8]
                    ngan_xep.append(v)
        lon_nhat = max(lon_nhat, co)  # [L11]
    return dem, lon_nhat


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    m, n = int(data[0]), int(data[1])  # [L1]
    dem, lon_nhat = dem_vung(m, n, data[2:2 + m])
    out = f"{dem} {lon_nhat}"  # [L13]
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
