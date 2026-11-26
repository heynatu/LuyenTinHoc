/**
 * File đi kèm mỗi bài trong kho đề (chạy lúc build): ví dụ, lời giải, kết quả kiểm định.
 * Bài chỉ được hiển thị khi verify.json tồn tại và mã băm khớp sol.py hiện tại (mục 5.1).
 */
import { createHash } from 'node:crypto';

export type VerifyRecord = {
  solSha256: string;
  tests: number;
  zipOnly: number;
  stressRounds: number;
  maxTimeMs: number;
  timeLimitMs: number;
  pseudoLines: number;
  minPython: string;
  verifiedAt: string;
};

export type Sample = { input: string; output: string };

const raw = (glob: Record<string, unknown>) => glob as Record<string, string>;

const SOLUTIONS = raw(
  import.meta.glob('/src/content/problems/*/{sol,sub1,sub2,sub3}.py', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
);
const SAMPLES = raw(
  import.meta.glob('/src/content/problems/*/vi-du/*.{inp,out}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
);
const VERIFY = import.meta.glob('/src/content/problems/*/verify.json', {
  import: 'default',
  eager: true,
}) as Record<string, VerifyRecord>;

const path = (id: string, file: string) => `/src/content/problems/${id}/${file}`;

/** Băm sau khi chuẩn hóa xuống dòng, giống sha256_text trong verify_content.py. */
export const sha256Text = (text: string) =>
  createHash('sha256').update(text.replace(/\r\n?/g, '\n'), 'utf8').digest('hex');

export function solutionOf(id: string, file = 'sol.py'): string | undefined {
  return SOLUTIONS[path(id, file)];
}

export function verifyOf(id: string): VerifyRecord | null {
  const record = VERIFY[path(id, 'verify.json')];
  const sol = solutionOf(id);
  if (!record || !sol) return null;
  return record.solSha256 === sha256Text(sol) ? record : null;
}

const warned = new Set<string>();
export function isVerified(id: string): boolean {
  const ok = verifyOf(id) !== null;
  if (!ok && !warned.has(id)) {
    warned.add(id);
    console.warn(
      `[kho đề] Bỏ qua bài "${id}": chưa kiểm định hoặc sol.py đã đổi. Chạy npm run verify:content.`,
    );
  }
  return ok;
}

export function samplesOf(id: string): Sample[] {
  const samples: Sample[] = [];
  for (let i = 1; ; i += 1) {
    const input = SAMPLES[path(id, `vi-du/${i}.inp`)];
    const output = SAMPLES[path(id, `vi-du/${i}.out`)];
    if (input === undefined || output === undefined) break;
    samples.push({ input: input.replace(/\r\n?/g, '\n'), output: output.replace(/\r\n?/g, '\n') });
  }
  return samples;
}

/** Code khởi đầu cho ô soạn code của một bài: khung đọc ghi đúng tên file như phòng thi. */
export function starterCode(io: { mode: 'file' | 'stdio'; input: string; output: string }): string {
  const file = io.mode === 'file';
  return `import sys

DOC_GHI_FILE = ${file ? 'True' : 'False'}  # ${file ? 'đề yêu cầu đọc ghi file' : 'đề dùng vào ra chuẩn'}
TEN_VAO, TEN_RA = "${io.input}", "${io.output}"


def main():
    if DOC_GHI_FILE:
        with open(TEN_VAO, "rb") as f:
            data = f.read().split()
    else:
        data = sys.stdin.buffer.read().split()
    # data là danh sách các từ (dạng bytes) của dữ liệu vào, ví dụ n = int(data[0])
    # Viết lời giải của bạn ở đây
    ket_qua = ""

    if DOC_GHI_FILE:
        with open(TEN_RA, "w") as f:
            f.write(ket_qua + "\\n")
    else:
        sys.stdout.write(ket_qua + "\\n")


main()
`;
}
