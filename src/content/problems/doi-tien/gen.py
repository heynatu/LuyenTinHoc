# Sinh test cho bài Đổi tiền. Dùng: python gen.py <seed> <co>
import random
import sys


def sinh(rng, co):
    if co == "nho":
        m, cmax, s = rng.randint(1, 4), 10, rng.randint(1, 40)
    elif co == "vua":
        m, cmax, s = rng.randint(3, 10), 1000, rng.randint(1000, 5000)
    else:
        m, cmax, s = 10, 10**4, rng.randint(45000, 50000)
    menh_gia = [rng.randint(1, cmax) for _ in range(m)]
    if rng.random() < 0.3:
        menh_gia = [2 * x for x in menh_gia]  # chỉ còn mệnh giá chẵn, S lẻ sẽ không đổi được
    return f"{m} {s}\n{' '.join(map(str, menh_gia))}\n"


BIEN = ["1 1\n1\n", "1 1\n2\n", "3 6\n1 3 4\n", "2 10000\n9999 10000\n", "2 3\n3 3\n"]
KE_HOACH = [("nho", 3), ("vua", 4), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
