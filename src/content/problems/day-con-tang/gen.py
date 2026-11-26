# Sinh test cho bài Dãy con tăng dài nhất. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 10), "vua": rng.randint(800, 1000), "lon": 100000}[co]
    gh = {"nho": 6, "vua": 10**9, "lon": 10**5}[co]
    kieu = rng.random()
    if kieu < 0.15:
        a = sorted(rng.randint(-gh, gh) for _ in range(n))  # gần như tăng, có số trùng
    elif kieu < 0.25:
        a = sorted((rng.randint(-gh, gh) for _ in range(n)), reverse=True)
    else:
        a = [rng.randint(-gh, gh) for _ in range(n)]
    return f"{n}\n{' '.join(map(str, a))}\n"


BIEN = ["1\n5\n", "4\n3 3 3 3\n", "5\n1 2 3 4 5\n", "5\n5 4 3 2 1\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
