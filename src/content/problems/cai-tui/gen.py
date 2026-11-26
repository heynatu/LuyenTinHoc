# Sinh test cho bài Cái túi. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        n, suc_chua, wmax = rng.randint(1, 10), rng.randint(1, 30), 15
    elif co == "vua":
        n, suc_chua, wmax = 20, rng.randint(100, 1000), 300
    else:
        n, suc_chua, wmax = 100, 10**4, rng.choice([300, 10**4])
    vmax = 50 if co == "nho" else 10**6
    dong = [f"{rng.randint(1, wmax)} {rng.randint(1, vmax)}" for _ in range(n)]
    return f"{n} {suc_chua}\n" + "\n".join(dong) + "\n"


BIEN = ["1 1\n2 100\n", "1 5\n5 7\n", "3 10\n10 1\n10 2\n10 3\n", "2 3\n1 5\n1 6\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
