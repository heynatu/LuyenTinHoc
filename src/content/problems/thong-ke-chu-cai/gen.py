# Sinh test cho bài Thống kê chữ cái. Dùng: python gen.py <seed> <co>
import random
import sys

KY_TU = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789     .,!?"


def sinh(rng, co):
    do_dai = {"nho": rng.randint(1, 30), "vua": rng.randint(300, 1000), "lon": 100000}[co]
    nhieu_dong = co != "vua"
    chu = [rng.choice(KY_TU) for _ in range(do_dai)]
    if nhieu_dong:
        chu = [("\n" if rng.random() < 0.05 else c) for c in chu]
    chu[rng.randrange(do_dai)] = rng.choice("qQzZ")  # luôn có ít nhất một chữ cái
    van = "".join(chu)
    return "\n".join(dong.strip() for dong in van.split("\n")).strip("\n") + "\n"


BIEN = ["a\n", "Z\n", "AaAa\nbB\n", "x1 y2 z3!\n"]
KE_HOACH = [("nho", 4), ("vua", 3), ("lon", 2)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
