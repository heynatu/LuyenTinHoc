/** Mẫu code cho phòng lập trình (mục 4.4). */

export type LabTemplate = {
  id: string;
  label: string;
  code: string;
  stdin: string;
  fileMode?: { input: string; output: string };
};

export const LAB_TEMPLATES: LabTemplate[] = [
  {
    id: 'co-ban',
    label: 'Mẫu cơ bản',
    code: `# Đọc hai số nguyên trên một dòng và in tổng của chúng
a, b = map(int, input().split())
print(a + b)
`,
    stdin: '3 5\n',
  },
  {
    id: 'doc-nhanh',
    label: 'Mẫu đọc nhanh',
    code: `import sys


def main():
    # Đọc toàn bộ dữ liệu một lần rồi tách theo khoảng trắng: nhanh và không lo xuống dòng
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    print(sum(a))


if __name__ == "__main__":
    main()
`,
    stdin: '5\n1 2 3 4 5\n',
  },
  {
    id: 'phong-thi',
    label: 'Mẫu phòng thi đọc ghi file',
    code: `import sys

DOC_GHI_FILE = True  # đặt False nếu đề dùng vào ra chuẩn
TEN_VAO, TEN_RA = "BAI1.INP", "BAI1.OUT"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))

    ket_qua = max(a)

    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(str(ket_qua) + "\\n")
    else:
        sys.stdout.write(str(ket_qua) + "\\n")


if __name__ == "__main__":
    main()
`,
    stdin: '5\n7 -2 9 4 3\n',
    fileMode: { input: 'BAI1.INP', output: 'BAI1.OUT' },
  },
  {
    id: 'theo-doi',
    label: 'Mẫu để theo dõi từng dòng',
    code: `a = [5, 2, 4, 1]
n = len(a)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(a)
`,
    stdin: '',
  },
];

export const DEFAULT_TEMPLATE = LAB_TEMPLATES[0]!;
