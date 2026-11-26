# Sinh test cho bài Đường đi trên lưới. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        m, n, p = rng.randint(1, 5), rng.randint(1, 5), 0.2
    elif co == "vua":
        m, n, p = rng.randint(5, 10), rng.randint(5, 10), 0.15
    else:
        m, n, p = rng.randint(450, 500), rng.randint(450, 500), rng.choice([0.0, 0.05, 0.3])
    luoi = ["".join("#" if rng.random() < p else "." for _ in range(n)) for _ in range(m)]
    if rng.random() < 0.85:
        luoi[0] = "." + luoi[0][1:]
        luoi[-1] = luoi[-1][:-1] + "."
    return f"{m} {n}\n" + "\n".join(luoi) + "\n"


BIEN = ["1 1\n.\n", "1 1\n#\n", "2 2\n.#\n#.\n", "1 5\n.....\n", "3 1\n.\n#\n.\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
