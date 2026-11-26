import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { TRAP_GROUPS, TRAPS } from '../../src/data/traps';
import { explainError } from '../../src/lib/python/errors';

function findPython(): string[] | null {
  for (const cmd of [['python3'], ['python'], ['py', '-3']]) {
    const probe = spawnSync(
      cmd[0]!,
      [...cmd.slice(1), '-c', 'import sys; print(sys.version_info[0])'],
      { encoding: 'utf8' },
    );
    if (probe.status === 0 && probe.stdout.trim() === '3') return cmd;
  }
  return null;
}

describe('thư viện bẫy', () => {
  it('có ít nhất 45 bẫy, slug không trùng, nhóm hợp lệ', () => {
    expect(TRAPS.length).toBeGreaterThanOrEqual(45);
    expect(new Set(TRAPS.map((t) => t.slug)).size).toBe(TRAPS.length);
    for (const t of TRAPS) {
      expect(Object.keys(TRAP_GROUPS)).toContain(t.group);
      expect(t.slug).toMatch(/^[a-z0-9-]+$/);
      expect(t.explain.length).toBeGreaterThan(40);
    }
  });

  it('mọi bẫy mà thông báo lỗi Python trỏ tới đều tồn tại', () => {
    const types = [
      'ValueError',
      'IndexError',
      'ZeroDivisionError',
      'RecursionError',
      'MemoryError',
      'FileNotFoundError',
      'EOFError',
      'OverflowError',
    ];
    for (const type of types) {
      const trap = explainError({ type, message: '', line: null }).trap;
      if (trap) expect(TRAPS.map((t) => t.slug)).toContain(trap);
    }
  });

  const python = findPython();
  it.skipIf(!python)('mọi đoạn code trong bẫy biên dịch được bằng Python', () => {
    const snippets = TRAPS.flatMap((t) =>
      [t.wrong, t.right].filter(Boolean).map((code) => ({ slug: t.slug, code: code! })),
    );
    const program = `import json, sys\nbad = []\nfor item in json.load(sys.stdin):\n    try:\n        compile(item["code"], item["slug"], "exec")\n    except SyntaxError as e:\n        bad.append(item["slug"] + ": " + str(e))\nprint(json.dumps(bad))`;
    const run = spawnSync(python![0]!, [...python!.slice(1), '-c', program], {
      input: JSON.stringify(snippets),
      encoding: 'utf8',
      env: { ...process.env, PYTHONUTF8: '1' },
    });
    expect(run.status, run.stderr).toBe(0);
    // Bẫy "xau-bat-bien" có code sai cố ý gây lỗi khi chạy, không phải lỗi cú pháp.
    expect(JSON.parse(run.stdout)).toEqual([]);
  });
});
