# Sinh test cho bài Số nguyên tố trong đoạn. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    q = {"nho": rng.randint(1, 5), "vua": rng.randint(50, 100), "lon": 100000}[co]
    bmax = {"nho": 200, "vua": 10**4, "lon": 10**6}[co]
    dong = []
    for _ in range(q):
        a, b = sorted((rng.randint(1, bmax), rng.randint(1, bmax)))
        if rng.random() < 0.1:
            a = b  # đoạn chỉ có một số
        dong.append(f"{a} {b}")
    return f"{q}\n" + "\n".join(dong) + "\n"


BIEN = ["1\n1 1\n", "1\n2 2\n", "2\n1 2\n4 4\n", "1\n999983 1000000\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
