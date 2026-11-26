# Sinh test cho bài Đếm số chẵn, số lẻ. Dùng: python gen.py <seed> <co>
import random
import sys


def tron_dong(rng, so):
    """Xếp các số lên nhiều dòng ngẫu nhiên (subtask 2)."""
    dong, cur = [], []
    for x in so:
        cur.append(str(x))
        if rng.random() < 0.2:
            dong.append(" ".join(cur))
            cur = []
    if cur:
        dong.append(" ".join(cur))
    return "\n".join(dong)


def sinh(rng, co):
    n = {"nho": rng.randint(1, 10), "vua": rng.randint(500, 1000), "lon": 100000}[co]
    gioi_han = 20 if co == "nho" else 10**6
    so = [rng.randint(-gioi_han, gioi_han) for _ in range(n)]
    than = " ".join(map(str, so)) if co == "vua" else tron_dong(rng, so)
    return f"{n}\n{than}\n"


BIEN = ["1\n0\n", "1\n-7\n", "3\n-1000000 1000000 -999999\n", "4\n2\n4\n6\n8\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
