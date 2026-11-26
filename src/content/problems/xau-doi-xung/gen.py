# Sinh test cho bài Xâu đối xứng. Dùng: python gen.py <seed> <co>
import random
import sys

CHU = "abcxyzABCXYZ0123456789"


def doi_hoa_thuong(rng, c):
    return c.upper() if rng.random() < 0.5 else c.lower()


def chen_dau_cach(rng, s, ti_le):
    return "".join(c + (" " if rng.random() < ti_le else "") for c in s)


def sinh(rng, co):
    do_dai = {"nho": rng.randint(1, 12), "vua": rng.randint(50, 200), "lon": 60000}[co]
    nua = [rng.choice(CHU).lower() for _ in range((do_dai + 1) // 2)]
    lop = nua + nua[::-1][do_dai % 2:]
    if rng.random() < 0.5 and len(lop) > 1:
        k = rng.randrange(len(lop))
        lop[k] = rng.choice(CHU).lower()  # có thể làm hỏng tính đối xứng
    s = "".join(doi_hoa_thuong(rng, c) for c in lop)
    return chen_dau_cach(rng, s, 0.2 if co != "lon" else 0.3).strip() + "\n"


BIEN = ["a\n", "Ab\n", "  A b A  \n", "12 21\n", "aB ba\n", "ab\n"]
KE_HOACH = [("nho", 4), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
