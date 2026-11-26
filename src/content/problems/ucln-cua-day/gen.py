# Sinh test cho bài Ước chung của dãy. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(2, 8), "vua": rng.randint(500, 1000), "lon": 100000}[co]
    gmax = {"nho": 6, "vua": 1000, "lon": 30000}[co]
    hmax = {"nho": 10, "vua": 10**5, "lon": 30000}[co]
    g = rng.randint(1, gmax)
    a = [g * rng.randint(1, hmax) for _ in range(n)]
    if rng.random() < 0.6:
        a[rng.randrange(n)] = rng.randint(1, g * hmax)  # một phần tử lạc loài
    return f"{n}\n{' '.join(map(str, a))}\n"


BIEN = ["2\n1 1\n", "2\n6 10\n", "3\n1000000000 1000000000 999999999\n", "4\n5 5 5 5\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
