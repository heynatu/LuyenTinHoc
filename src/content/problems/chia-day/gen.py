# Sinh test cho bài Chia dãy. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 8), "vua": rng.randint(50, 100), "lon": 100000}[co]
    gh = {"nho": 10, "vua": 10**9, "lon": rng.choice([10**3, 10**9])}[co]
    k = rng.choice([1, n, rng.randint(1, n)])
    a = [rng.randint(1, gh) for _ in range(n)]
    return f"{n} {k}\n{' '.join(map(str, a))}\n"


BIEN = [
    "1 1\n7\n",
    "3 1\n1 1 1\n",
    "3 3\n5 1 9\n",
    "4 2\n1000000000 1000000000 1000000000 1000000000\n",
]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
