# Sinh test cho bài Tháp Hà Nội. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 8), "vua": rng.randint(9, 12), "lon": rng.randint(15, 16)}[co]
    return f"{n}\n"


BIEN = ["1\n", "2\n", "3\n", "10\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
