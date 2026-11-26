# Sinh test cho bài Tổng k số liên tiếp lớn nhất. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 9), "vua": rng.randint(500, 1000), "lon": 100000}[co]
    k = rng.randint(1, n)
    gh = 5 if co == "nho" else 10**4
    thap = -gh if rng.random() < 0.8 else -gh * 2  # đôi khi toàn số âm
    a = [rng.randint(thap, gh if thap == -gh else -1) for _ in range(n)]
    return f"{n} {k}\n{' '.join(map(str, a))}\n"


BIEN = ["1 1\n-5\n", "3 3\n1 2 3\n", "5 2\n0 0 0 0 0\n", "4 1\n-1 -1 -1 -1\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
