# Sinh test cho bài Doanh thu quán cà phê. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    n = {"nho": rng.randint(1, 8), "vua": rng.randint(500, 1000)}.get(co, 100000)
    # "lon" vừa bộ chấm trên web; "cuc-dai" đúng giới hạn (chỉ có trong zip)
    q = {"nho": rng.randint(1, 6), "vua": rng.randint(500, 1000), "lon": 30000}.get(co, 100000)
    gh = {"nho": 50, "vua": 10**6, "lon": 1000}.get(co, 10**6)
    a = [rng.randint(0, gh) for _ in range(n)]
    hoi = []
    for _ in range(q):
        dau, cuoi = sorted((rng.randint(1, n), rng.randint(1, n)))
        hoi.append(f"{dau} {cuoi}")
    return f"{n} {q}\n{' '.join(map(str, a))}\n" + "\n".join(hoi) + "\n"


BIEN = [
    "1 1\n0\n1 1\n",
    "3 3\n1000000 1000000 1000000\n1 3\n2 2\n3 3\n",
    "4 2\n5 0 0 7\n1 4\n2 3\n",
]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 1), ("cuc-dai", 1)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
