# Sinh test cho bài Xâu con chung dài nhất. Dùng: python gen.py <seed> <co>
import random
import sys


def xau(rng, do_dai, chu):
    return "".join(rng.choice(chu) for _ in range(do_dai))


def sinh(rng, co):
    if co == "nho":
        la, lb, chu = rng.randint(1, 8), rng.randint(1, 8), "abc"
    elif co == "vua":
        la, lb, chu = rng.randint(100, 300), rng.randint(100, 300), "abcd"
    else:
        la, lb, chu = 1000, 1000, rng.choice(["ab", "abcd", "abcdefghijklmnopqrstuvwxyz"])
    return f"{xau(rng, la, chu)}\n{xau(rng, lb, chu)}\n"


BIEN = ["a\na\n", "a\nb\n", "abc\nabc\n", "aaaa\naa\n", "abcdef\nfedcba\n"]
KE_HOACH = [("nho", 3), ("vua", 3), ("lon", 3)]

if __name__ == "__main__":
    co = sys.argv[2] if len(sys.argv) > 2 else "nho"
    sys.stdout.write(sinh(random.Random(int(sys.argv[1])), co))
