# Lời giải từng phần: quy hoạch động O(n²), đạt subtask 1 (n ≤ 1000).
import sys

DOC_GHI_FILE = True
TEN_VAO, TEN_RA = "DAYTANG.INP", "DAYTANG.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    f = [1] * n  # f[i]: độ dài dãy tăng dài nhất kết thúc tại i
    for i in range(n):
        for j in range(i):
            if a[j] < a[i] and f[j] + 1 > f[i]:
                f[i] = f[j] + 1
    out = str(max(f))
    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as fo:
            fo.write(out + "\n")
    else:
        sys.stdout.write(out + "\n")


if __name__ == "__main__":
    main()
