# Sinh test cho bài Giao hàng. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        n, m, wmax = rng.randint(1, 6), rng.randint(0, 8), 10
    elif co == "vua":
        n, m, wmax = rng.randint(50, 100), rng.randint(100, 1000), 1000
    elif co == "lon":
        n, m, wmax = 30000, 60000, 10**6  # vừa bộ chấm trên web
    else:
        n, m, wmax = 10**5, 2 * 10**5, 10**6  # đúng giới hạn, chỉ có trong zip
    dong = []
    for _ in range(m):
        u, v = rng.randint(1, n), rng.randint(1, n)
        dong.append(f"{u} {v} {rng.randint(1, wmax)}")
    return f"{n} {m}\n" + "\n".join(dong) + ("\n" if dong else "")


BIEN = ["1 0\n", "2 0\n", "2 1\n1 1 5\n", "3 3\n1 2 1000000\n2 3 1000000\n1 3 1000000\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 2), ("cuc-dai", 1)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
