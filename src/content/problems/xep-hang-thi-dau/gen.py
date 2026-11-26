# Sinh test cho bài Xếp hạng thi đấu. Dùng: python gen.py <seed> <co>
import random
import sys

CHU = "abcdefghijklmnopqrstuvwxyz"


def cac_ten(rng, n):
    ten = set()
    while len(ten) < n:
        do_dai = rng.randint(1, 9)
        ten.add(rng.choice(CHU.upper()) + "".join(rng.choice(CHU) for _ in range(do_dai)))
    ds = sorted(ten)
    rng.shuffle(ds)
    return ds


def sinh(rng, co):
    n = {"nho": rng.randint(1, 8), "vua": rng.randint(500, 1000), "lon": 50000}[co]
    diem = [0, 100, 200] if co == "nho" else list(range(0, 301))
    tg = [30, 60] if co == "nho" else list(range(0, 181))
    dong = [f"{t} {rng.choice(diem)} {rng.choice(tg)}" for t in cac_ten(rng, n)]
    return f"{n}\n" + "\n".join(dong) + "\n"


BIEN = ["1\nAn 0 0\n", "3\nCa 300 180\nBa 300 180\nAa 300 180\n", "2\nZed 9 1\nAb 10 180\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
