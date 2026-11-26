# Sinh test cho bài Tổng các ước. Dùng: python gen.py <seed> <co>
import random
import sys

DAC_BIET = [10**12, 999999999989, 999966000289, 963761198400, 2**39, 735134400]


def sinh(rng, co):
    if co == "nho":
        n = rng.choice([rng.randint(1, 50), rng.randint(1, 3000), rng.randint(1, 60) ** 2])
    elif co == "vua":
        n = rng.choice([rng.randint(1, 10**6), 720720, 997**2])
    else:
        n = rng.choice([rng.randint(10**11, 10**12), rng.choice(DAC_BIET)])
    return f"{n}\n"


BIEN = ["1\n", "2\n", "4\n", "36\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 4)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
