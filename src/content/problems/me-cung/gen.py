# Sinh test cho bài Mê cung. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        m, n, p = rng.randint(1, 5), rng.randint(2, 5), 0.3
    elif co == "vua":
        m, n, p = rng.randint(5, 10), rng.randint(5, 10), 0.3
    else:
        m, n, p = rng.randint(450, 500), rng.randint(450, 500), rng.choice([0.1, 0.3, 0.4])
    o = [["#" if rng.random() < p else "." for _ in range(n)] for _ in range(m)]
    vi_tri = rng.sample(range(m * n), 2)
    if co == "lon" and rng.random() < 0.5:
        vi_tri = [0, m * n - 1]  # hai góc đối diện: đường dài nhất
    for ky_hieu, k in zip("ST", vi_tri):
        o[k // n][k % n] = ky_hieu
    return f"{m} {n}\n" + "\n".join("".join(dong) for dong in o) + "\n"


BIEN = ["1 2\nST\n", "1 3\nS#T\n", "2 2\nS#\n#T\n", "3 3\nS..\n.#.\n..T\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
