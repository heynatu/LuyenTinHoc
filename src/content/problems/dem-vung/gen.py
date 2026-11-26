# Sinh test cho bài Đếm vùng đất. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        m, n, p = rng.randint(1, 5), rng.randint(1, 5), rng.choice([0.3, 0.5])
    elif co == "vua":
        m, n, p = rng.randint(10, 20), rng.randint(10, 20), 0.45
    else:
        m, n, p = 500, 500, rng.choice([0.45, 0.6, 1.0])
    luoi = ["".join("#" if rng.random() < p else "." for _ in range(n)) for _ in range(m)]
    return f"{m} {n}\n" + "\n".join(luoi) + "\n"


BIEN = ["1 1\n.\n", "1 1\n#\n", "2 2\n#.\n.#\n", "3 3\n###\n#.#\n###\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
