# Sinh test cho bài Đếm cặp có tổng không vượt quá X. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(2, 9), "vua": rng.randint(1000, 2000), "lon": 100000}[co]
    gh = {"nho": 10, "vua": 10**6, "lon": 10**5}[co]
    a = [rng.randint(-gh, gh) for _ in range(n)]
    x = rng.choice([rng.randint(-2 * gh, 2 * gh), a[0] + a[-1], 0])
    return f"{n} {x}\n{' '.join(map(str, a))}\n"


BIEN = [
    "2 2\n1 1\n",
    "2 1\n1 1\n",
    "3 -2000000000\n-1000000000 -1000000000 -1000000000\n",
    "4 2000000000\n1000000000 1000000000 1000000000 1000000000\n",
]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
