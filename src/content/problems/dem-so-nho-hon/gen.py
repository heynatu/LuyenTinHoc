# Sinh test cho bài Đếm số không vượt quá. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 8), "vua": rng.randint(500, 1000)}.get(co, 100000)
    q = {"nho": rng.randint(1, 6), "vua": rng.randint(500, 1000)}.get(co, 100000)
    # "lon" giá trị nhỏ để vừa bộ chấm trên web; "cuc-dai" đúng giới hạn (chỉ có trong zip)
    gh = {"nho": 10, "vua": 10**6, "lon": 10**4, "cuc-dai": 10**9}[co]
    a = [rng.randint(-gh, gh) for _ in range(n)]
    hoi = [rng.choice(a) if rng.random() < 0.4 else rng.randint(-gh - 2, gh + 2) for _ in range(q)]
    return f"{n} {q}\n{' '.join(map(str, a))}\n" + "\n".join(map(str, hoi)) + "\n"


BIEN = [
    "1 3\n5\n4\n5\n6\n",
    "3 2\n7 7 7\n7\n6\n",
    "2 2\n-1000000000 1000000000\n-1000000000\n1000000000\n",
]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 1), ("cuc-dai", 1)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
