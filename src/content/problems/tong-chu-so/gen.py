# Sinh test cho bài Tổng các chữ số. Dùng: python gen.py <seed> <co>
import random
import sys


def so_ngau_nhien(rng, so_chu_so):
    return str(rng.randint(1, 9)) + "".join(rng.choice("0123456789") for _ in range(so_chu_so - 1))


def sinh(rng, co):
    if co == "nho":
        return so_ngau_nhien(rng, rng.randint(1, 18)) + "\n"
    if co == "vua":
        return so_ngau_nhien(rng, rng.randint(15, 18)) + "\n"
    return so_ngau_nhien(rng, 100000) + "\n"


BIEN = ["1\n", "999999999999999999\n", "100000000000000000\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 4)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
