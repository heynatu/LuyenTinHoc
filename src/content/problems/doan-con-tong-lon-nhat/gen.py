# Sinh test cho bài Đoạn con tổng lớn nhất. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 9), "vua": rng.randint(2000, 5000), "lon": 100000}[co]
    gh = {"nho": 6, "vua": 10**9, "lon": 10**5}[co]
    toan_am = rng.random() < 0.15
    a = [rng.randint(-gh, -1 if toan_am else gh) for _ in range(n)]
    return f"{n}\n{' '.join(map(str, a))}\n"


BIEN = ["1\n-1000000000\n", "1\n7\n", "3\n0 0 0\n", "5\n-1 -1 5 -1 -1\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
