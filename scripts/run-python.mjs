// Chạy một script Python bằng trình thông dịch có sẵn: python3, python hoặc py -3 (Windows).
// Dùng: node scripts/run-python.mjs <script.py> [tham số...]
import { spawnSync } from 'node:child_process';

const CANDIDATES = [
  ['python3', []],
  ['python', []],
  ['py', ['-3']],
];

const [script, ...args] = process.argv.slice(2);
if (!script) {
  console.error('Thiếu đường dẫn script Python.');
  process.exit(2);
}

for (const [cmd, prefix] of CANDIDATES) {
  const probe = spawnSync(
    cmd,
    [...prefix, '-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)'],
    {
      stdio: 'ignore',
    },
  );
  if (probe.status !== 0) continue;
  // UTF-8 cho mọi đọc ghi file và console (tên bài, đề tiếng Việt), kể cả trên Windows.
  const env = { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };
  const run = spawnSync(cmd, [...prefix, script, ...args], { stdio: 'inherit', env });
  process.exit(run.status ?? 1);
}

console.error('Không tìm thấy Python 3.10 trở lên. Cài Python từ python.org rồi chạy lại.');
process.exit(1);
