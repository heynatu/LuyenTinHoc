"""Kiểm định kho đề (mục 5.2 của docs/SUPER_PROMPT.md).

Với mỗi bài trong src/content/problems/<id>/:
  1. sol.py phải cho đúng mọi ví dụ trong vi-du/.
  2. Đối chiếu ngẫu nhiên sol.py với brute.py trên ít nhất 300 bộ test nhỏ từ gen.py,
     cộng các test biên viết tay (gen.BIEN). Lệch một bộ là dừng, in bộ test gây lệch.
  3. Sinh bộ test chính thức (ví dụ, test biên, test theo gen.KE_HOACH); đáp án do sol.py
     tính SAU khi bước 2 đã qua.
  4. Đo thời gian sol.py bằng CPython (tiến trình riêng) trên các test lớn nhất.
  5. Kiểm tra code: ruff và vermin nếu đã cài (bắt buộc ở chế độ --ci); nếu chưa cài thì
     kiểm tra cú pháp Python 3.8 và danh sách hàm cần Python mới hơn.
  6. Nhãn # [Lx] trong sol.py phải trỏ tới dòng có thật của giả mã trong editorial.md.
  7. Ghi verify.json, public/judge/<id>/tests.json và gói zip theo cấu trúc Themis.

Dùng:
  npm run verify:content                 kiểm định và ghi file cho mọi bài
  npm run verify:content -- tong-uoc     chỉ một bài
  python scripts/content/verify_content.py --ci   chỉ kiểm tra, file đã commit phải khớp

Không bao giờ sửa verify.json, tests.json hay file zip bằng tay.
"""

from __future__ import annotations

import argparse
import ast
import contextlib
import hashlib
import io
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROBLEMS = ROOT / "src" / "content" / "problems"
JUDGE = ROOT / "public" / "judge"

STRESS_ROUNDS = 300
JSON_BUDGET = 2_000_000  # tests.json của mỗi bài không quá 2 MB; test lớn hơn chỉ có trong zip
ZIP_TIME = (1980, 1, 1, 0, 0, 0)  # thời điểm cố định để file zip giống hệt nhau giữa các lần chạy
FLOAT_EPS = 1e-6

# Hàm và cú pháp cần Python mới hơn 3.8 (dùng khi chưa cài vermin).
NEWER_API = {
    r"\bmath\.lcm\b": "math.lcm (3.9)",
    r"\.removeprefix\(": "str.removeprefix (3.9)",
    r"\.removesuffix\(": "str.removesuffix (3.9)",
    r"\bpairwise\b": "itertools.pairwise (3.10)",
    r"\bfunctools\.cache\b|from functools import cache\b": "functools.cache (3.9)",
    r"\.bit_count\(": "int.bit_count (3.10)",
    r"\bstrict\s*=": "zip(strict=) (3.10)",
    r"\bbisect\w*\([^)]*\bkey\s*=": "bisect với key (3.10)",
}


class Fail(Exception):
    """Bài không qua kiểm định."""


@dataclass
class Meta:
    mode: str
    input: str
    output: str
    program: str
    time_ms: int
    compare: str


@dataclass
class Test:
    name: str
    kind: str
    input: str
    output: str = ""


def norm_text(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def sha256_text(text: str) -> str:
    """Băm sau khi chuẩn hóa xuống dòng để Windows (CRLF) và Linux (LF) cho cùng kết quả."""
    return hashlib.sha256(norm_text(text).encode("utf-8")).hexdigest()


def read_meta(folder: Path) -> Meta:
    text = norm_text((folder / "index.md").read_text(encoding="utf-8"))
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        raise Fail("index.md thiếu frontmatter")
    front = match.group(1)
    io_line = re.search(
        r"^io: \{ mode: (file|stdio), input: ([A-Z0-9_]+\.INP), output: ([A-Z0-9_]+\.OUT), "
        r"program: ([A-Z0-9_]+\.PY) \}$",
        front,
        re.M,
    )
    limits = re.search(r"^limits: \{ timeMs: (\d+), memoryMb: (\d+) \}$", front, re.M)
    compare = re.search(r"^compare: (tokens|lines|float)$", front, re.M)
    if not io_line or not limits:
        raise Fail(
            "index.md phải có dòng io và limits đúng dạng một dòng, ví dụ\n"
            "  io: { mode: file, input: BAI.INP, output: BAI.OUT, program: BAI.PY }\n"
            "  limits: { timeMs: 1000, memoryMb: 256 }"
        )
    return Meta(
        mode=io_line.group(1),
        input=io_line.group(2),
        output=io_line.group(3),
        program=io_line.group(4),
        time_ms=int(limits.group(1)),
        compare=compare.group(1) if compare else "tokens",
    )


def same_output(expected: str, actual: str, mode: str) -> bool:
    """Cùng luật với bộ chấm trên trình duyệt (src/lib/judge/compare.ts)."""
    a, b = norm_text(expected), norm_text(actual)
    if mode == "lines":
        return [x.rstrip() for x in a.rstrip("\n").split("\n")] == [
            x.rstrip() for x in b.rstrip("\n").split("\n")
        ]
    ta, tb = a.split(), b.split()
    if mode == "float":
        if len(ta) != len(tb):
            return False
        for x, y in zip(ta, tb):
            if x == y:
                continue
            try:
                fx, fy = float(x), float(y)
            except ValueError:
                return False
            if abs(fx - fy) > FLOAT_EPS * max(1.0, abs(fx)):
                return False
        return True
    return ta == tb


# --------------------------------------------------------------------------- chạy chương trình


class Program:
    """Một file .py được biên dịch một lần, chạy nhiều lần ngay trong tiến trình này (nhanh)."""

    def __init__(self, path: Path, meta: Meta, workdir: Path):
        self.path = path
        self.meta = meta
        self.workdir = workdir
        self.code = compile(path.read_text(encoding="utf-8"), str(path), "exec")

    def run(self, data: str) -> str:
        meta = self.meta
        stdin = io.TextIOWrapper(io.BytesIO(data.encode("utf-8")), encoding="utf-8")
        stdout = io.TextIOWrapper(io.BytesIO(), encoding="utf-8", newline="\n")
        out_file = self.workdir / meta.output
        if meta.mode == "file":
            (self.workdir / meta.input).write_bytes(data.encode("utf-8"))
            if out_file.exists():
                out_file.unlink()
        old_cwd, old_in, old_out = os.getcwd(), sys.stdin, sys.stdout
        os.chdir(self.workdir)
        sys.stdin, sys.stdout = stdin, stdout
        try:
            exec(self.code, {"__name__": "__main__", "__file__": str(self.path)})
        except SystemExit:
            pass
        except Exception as exc:
            raise Fail(
                f"{self.path.name} lỗi khi chạy: {exc!r}\nDữ liệu vào:\n{clip(data)}"
            ) from exc
        finally:
            sys.stdin, sys.stdout = old_in, old_out
            os.chdir(old_cwd)
        if meta.mode == "file":
            if not out_file.exists():
                raise Fail(f"{self.path.name} không tạo file {meta.output}")
            return out_file.read_text(encoding="utf-8")
        stdout.flush()
        return stdout.buffer.getvalue().decode("utf-8")  # type: ignore[attr-defined]


def run_subprocess(path: Path, meta: Meta, data: str, timeout: float) -> float:
    """Chạy sol.py bằng một tiến trình CPython riêng, trả về thời gian (ms)."""
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        shutil.copy(path, work / meta.program)
        if meta.mode == "file":
            (work / meta.input).write_bytes(data.encode("utf-8"))
        start = time.perf_counter()
        proc = subprocess.run(
            [sys.executable, meta.program],
            cwd=work,
            input=None if meta.mode == "file" else data.encode("utf-8"),
            stdout=subprocess.DEVNULL if meta.mode == "file" else subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
            check=False,
        )
        elapsed = (time.perf_counter() - start) * 1000
        if proc.returncode != 0:
            raise Fail(
                f"sol.py lỗi khi chạy riêng: {proc.stderr.decode('utf-8', 'replace')[-500:]}"
            )
        return elapsed


def clip(text: str, limit: int = 600) -> str:
    return text if len(text) <= limit else text[:limit] + f"\n… (còn {len(text) - limit} ký tự)"


def load_gen(path: Path) -> dict:
    scope: dict = {"__name__": "gen"}
    exec(compile(path.read_text(encoding="utf-8"), str(path), "exec"), scope)
    if not callable(scope.get("sinh")):
        raise Fail("gen.py phải có hàm sinh(rng, co)")
    return scope


# --------------------------------------------------------------------------- kiểm tra code


def lint(folder: Path, ci: bool) -> list[str]:
    files = sorted(folder.glob("*.py"))
    notes: list[str] = []
    ruff_cli = tool_path("ruff")
    vermin_cli = tool_path("vermin")
    ruff = ruff_cli is not None or module_available("ruff")
    vermin = vermin_cli is not None
    if ruff:
        cmd = [ruff_cli] if ruff_cli else [sys.executable, "-m", "ruff"]
        proc = subprocess.run(
            [*cmd, "check", "--quiet", *map(str, files)], cwd=ROOT, capture_output=True, check=False
        )
        if proc.returncode != 0:
            raise Fail("ruff báo lỗi:\n" + (proc.stdout + proc.stderr).decode("utf-8", "replace"))
    if vermin_cli:
        proc = subprocess.run(
            [vermin_cli, "-t=3.8-", "--no-tips", "--violations", *map(str, files)],
            capture_output=True,
            check=False,
        )
        if proc.returncode != 0:
            output = (proc.stdout + proc.stderr).decode("utf-8", "replace")
            raise Fail("vermin: code cần Python mới hơn 3.8:\n" + output)
    if (not ruff or not vermin) and ci:
        raise Fail("Chế độ --ci cần ruff và vermin: python -m pip install -r requirements-dev.txt")
    if not ruff or not vermin:
        notes.append("chưa cài ruff hoặc vermin: dùng kiểm tra dự phòng (cú pháp 3.8, hàm mới)")
    for file in files:
        source = file.read_text(encoding="utf-8")
        try:
            ast.parse(source, filename=str(file), feature_version=(3, 8))
        except SyntaxError as exc:
            raise Fail(f"{file.name}: cú pháp không chạy được trên Python 3.8: {exc}") from exc
        for number, line in enumerate(source.splitlines(), 1):
            if len(line) > 100:
                raise Fail(f"{file.name}:{number} dài {len(line)} ký tự, quá 100 (ruff E501)")
        for pattern, label in NEWER_API.items():
            if re.search(pattern, source):
                raise Fail(f"{file.name} dùng {label}, máy chấm Python 3.8 không chạy được")
        if re.search(r"^\s*(import|from)\s+(numpy|pandas|sortedcontainers)\b", source, re.M):
            raise Fail(f"{file.name} dùng thư viện ngoài, chỉ được dùng thư viện chuẩn")
    return notes


def tool_path(name: str) -> str | None:
    """Tìm công cụ dòng lệnh trên PATH hoặc cạnh trình thông dịch đang chạy (venv)."""
    found = shutil.which(name)
    if found:
        return found
    folder = Path(sys.executable).parent
    for candidate in (folder / name, folder / f"{name}.exe", folder / "Scripts" / f"{name}.exe"):
        if candidate.exists():
            return str(candidate)
    return None


def module_available(name: str) -> bool:
    proc = subprocess.run(
        [sys.executable, "-c", f"import {name}"], capture_output=True, check=False
    )
    return proc.returncode == 0


def check_pseudo(folder: Path) -> int:
    editorial = norm_text((folder / "editorial.md").read_text(encoding="utf-8"))
    block = re.search(r"```pseudo[^\n]*\n(.*?)\n```", editorial, re.S)
    if not block:
        raise Fail("editorial.md thiếu khối ```pseudo")
    count = len(block.group(1).split("\n"))
    labels = [
        int(x)
        for x in re.findall(r"#\s*\[L(\d+)\]", (folder / "sol.py").read_text(encoding="utf-8"))
    ]
    if not labels:
        raise Fail("sol.py chưa có nhãn # [Lx] nối với giả mã")
    bad = sorted({x for x in labels if x < 1 or x > count})
    if bad:
        raise Fail(f"sol.py có nhãn {bad} nhưng giả mã chỉ có {count} dòng")
    return count


# --------------------------------------------------------------------------- một bài


def read_samples(folder: Path) -> list[Test]:
    tests = []
    for inp in sorted((folder / "vi-du").glob("*.inp"), key=lambda p: int(p.stem)):
        out = inp.with_suffix(".out")
        if not out.exists():
            raise Fail(f"thiếu {out.relative_to(folder)}")
        tests.append(
            Test(
                name="",
                kind="vi-du",
                input=norm_text(inp.read_text(encoding="utf-8")),
                output=norm_text(out.read_text(encoding="utf-8")),
            )
        )
    if not tests:
        raise Fail("thiếu ví dụ trong vi-du/ (1.inp, 1.out)")
    return tests


def verify(folder: Path, ci: bool) -> dict:
    pid = folder.name
    for name in ("index.md", "editorial.md", "sol.py", "brute.py", "gen.py"):
        if not (folder / name).exists():
            raise Fail(f"thiếu file {name}")
    meta = read_meta(folder)
    notes = lint(folder, ci)
    pseudo_lines = check_pseudo(folder)

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        sol = Program(folder / "sol.py", meta, work)
        brute = Program(folder / "brute.py", meta, work)
        gen = load_gen(folder / "gen.py")
        subs = [Program(p, meta, work) for p in sorted(folder.glob("sub[0-9].py"))]

        # 1. Ví dụ
        samples = read_samples(folder)
        for i, test in enumerate(samples, 1):
            got = sol.run(test.input)
            if not same_output(test.output, got, meta.compare):
                raise Fail(
                    f"sol.py sai ví dụ {i}.\nDữ liệu vào:\n{clip(test.input)}\n"
                    f"Cần:\n{clip(test.output)}\nNhận:\n{clip(got)}"
                )
            if not same_output(test.output, brute.run(test.input), meta.compare):
                raise Fail(f"brute.py sai ví dụ {i}: kiểm tra lại lời giải trâu")

        # 2. Đối chiếu ngẫu nhiên với lời giải trâu
        rng = random.Random(f"{pid}:doi-chieu")
        edge = [norm_text(x) for x in gen.get("BIEN", [])]
        stress_inputs = edge + [norm_text(gen["sinh"](rng, "nho")) for _ in range(STRESS_ROUNDS)]
        for data in stress_inputs:
            a, b = sol.run(data), brute.run(data)
            if not same_output(b, a, meta.compare):
                raise Fail(
                    f"sol.py và brute.py lệch nhau.\nDữ liệu vào:\n{clip(data)}\n"
                    f"brute.py:\n{clip(b)}\nsol.py:\n{clip(a)}"
                )
            for sub in subs:
                if not same_output(b, sub.run(data), meta.compare):
                    raise Fail(f"{sub.path.name} sai trên test nhỏ:\n{clip(data)}")

        # 3. Bộ test chính thức
        tests: list[Test] = list(samples)
        tests += [Test(name="", kind="bien", input=x) for x in edge]
        rng = random.Random(f"{pid}:chinh-thuc")
        for co, count in gen.get("KE_HOACH", [("nho", 4), ("vua", 4), ("lon", 2)]):
            tests += [
                Test(name="", kind=co, input=norm_text(gen["sinh"](rng, co))) for _ in range(count)
            ]
        for i, test in enumerate(tests, 1):
            test.name = f"Test{i:02d}"
            if test.kind != "vi-du":
                test.output = norm_text(sol.run(test.input))

    # 4. Đo thời gian trên các test lớn nhất
    largest = sorted(tests, key=lambda t: len(t.input), reverse=True)[:2]
    limit_s = meta.time_ms / 1000
    max_ms = 0.0
    for test in largest:
        best = min(
            run_subprocess(folder / "sol.py", meta, test.input, limit_s * 10) for _ in range(2)
        )
        max_ms = max(max_ms, best)
    if max_ms > meta.time_ms:
        raise Fail(
            f"sol.py chạy {max_ms:.0f} ms trên test lớn nhất, vượt giới hạn {meta.time_ms} ms"
        )

    return {
        "meta": meta,
        "tests": tests,
        "stress": len(stress_inputs),
        "max_ms": round(max_ms),
        "pseudo": pseudo_lines,
        "notes": notes,
        "sol_hash": sha256_text((folder / "sol.py").read_text(encoding="utf-8")),
    }


# --------------------------------------------------------------------------- ghi kết quả


def tests_json(pid: str, meta: Meta, tests: list[Test]) -> tuple[str, int]:
    payload_tests = []
    used = 0
    zip_only = 0
    for t in tests:
        item = {"name": t.name, "kind": t.kind, "input": t.input, "output": t.output}
        # Đo đúng kích thước sau khi mã hóa JSON (mỗi ký tự xuống dòng thành hai ký tự).
        size = len(json.dumps(item, ensure_ascii=False, separators=(",", ":")).encode("utf-8")) + 1
        if used + size > JSON_BUDGET and t.kind != "vi-du":
            zip_only += 1
            continue
        used += size
        payload_tests.append(item)
    payload = {
        "id": pid,
        "mode": meta.mode,
        "input": meta.input,
        "output": meta.output,
        "program": meta.program,
        "timeMs": meta.time_ms,
        "compare": meta.compare,
        "zipOnly": zip_only,
        "tests": payload_tests,
    }
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", zip_only


def themis_zip(meta: Meta, tests: list[Test]) -> bytes:
    task = meta.program[: -len(".PY")]
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for t in tests:
            for name, content in ((meta.input, t.input), (meta.output, t.output)):
                info = zipfile.ZipInfo(f"{task}/{t.name}/{name}", date_time=ZIP_TIME)
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                zf.writestr(info, content.encode("utf-8"))
    return buffer.getvalue()


def zip_contents(data: bytes) -> list[tuple[str, bytes]]:
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        return [(name, zf.read(name)) for name in sorted(zf.namelist())]


def write_if_changed(path: Path, data: bytes, ci: bool, stale: list[str]) -> None:
    old = path.read_bytes() if path.exists() else None
    if old == data:
        return
    # Zip so theo nội dung: bản zlib khác nhau có thể nén ra byte khác nhau.
    if old is not None and path.suffix == ".zip" and zip_contents(old) == zip_contents(data):
        return
    if ci:
        stale.append(str(path.relative_to(ROOT)))
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(description="Kiểm định kho đề")
    parser.add_argument("--ci", action="store_true", help="chỉ kiểm tra; file đã commit phải khớp")
    parser.add_argument("ids", nargs="*", help="chỉ kiểm định các bài này")
    args = parser.parse_args()

    folders = sorted(p for p in PROBLEMS.glob("*") if p.is_dir()) if PROBLEMS.exists() else []
    if args.ids:
        folders = [p for p in folders if p.name in set(args.ids)]
        missing = set(args.ids) - {p.name for p in folders}
        if missing:
            print(f"Không có bài: {', '.join(sorted(missing))}", file=sys.stderr)
            return 1
    if not folders:
        print("Chưa có bài nào trong src/content/problems. Không có gì để kiểm định.")
        return 0

    failed: list[str] = []
    stale: list[str] = []
    started = time.perf_counter()
    for folder in folders:
        pid = folder.name
        try:
            result = verify(folder, args.ci)
        except Fail as exc:
            failed.append(pid)
            print(f"[KHÔNG ĐẠT] {pid}\n{exc}\n", file=sys.stderr)
            continue
        meta: Meta = result["meta"]
        tests: list[Test] = result["tests"]
        body, zip_only = tests_json(pid, meta, tests)
        zip_bytes = themis_zip(meta, tests)
        verify_path = folder / "verify.json"
        old = json.loads(verify_path.read_text(encoding="utf-8")) if verify_path.exists() else {}
        record = {
            "solSha256": result["sol_hash"],
            "testsSha256": hashlib.sha256(body.encode("utf-8")).hexdigest(),
            "tests": len(tests),
            "zipOnly": zip_only,
            "stressRounds": result["stress"],
            "maxTimeMs": result["max_ms"],
            "timeLimitMs": meta.time_ms,
            "pseudoLines": result["pseudo"],
            "minPython": "3.8",
        }
        # Giữ ngày kiểm định cũ nếu không có gì đổi (tránh thay đổi vô nghĩa khi commit).
        comparable = {k: v for k, v in old.items() if k not in ("verifiedAt", "maxTimeMs")}
        unchanged = comparable == {k: v for k, v in record.items() if k != "maxTimeMs"}
        record["maxTimeMs"] = (
            old.get("maxTimeMs", record["maxTimeMs"]) if unchanged else record["maxTimeMs"]
        )
        record["verifiedAt"] = old.get("verifiedAt") if unchanged else time.strftime("%Y-%m-%d")
        text = json.dumps(record, ensure_ascii=False, indent=2) + "\n"
        write_if_changed(verify_path, text.encode("utf-8"), args.ci, stale)
        write_if_changed(JUDGE / pid / "tests.json", body.encode("utf-8"), args.ci, stale)
        write_if_changed(JUDGE / pid / f"{meta.program[:-3]}_themis.zip", zip_bytes, args.ci, stale)
        extra = f", {zip_only} test chỉ có trong zip" if zip_only else ""
        note = f" ({'; '.join(result['notes'])})" if result["notes"] else ""
        print(
            f"[ĐẠT] {pid}: {len(tests)} test, {result['stress']} vòng đối chiếu, "
            f"lâu nhất {result['max_ms']} ms / {meta.time_ms} ms{extra}{note}"
        )

    elapsed = time.perf_counter() - started
    print(f"\n{len(folders) - len(failed)}/{len(folders)} bài đạt trong {elapsed:.1f} giây.")
    if stale:
        print(
            "File kiểm định chưa khớp với code hiện tại:\n  "
            + "\n  ".join(stale)
            + "\nChạy npm run verify:content rồi commit các file trên.",
            file=sys.stderr,
        )
    return 1 if failed or stale else 0


if __name__ == "__main__":
    with contextlib.suppress(KeyboardInterrupt):
        sys.exit(main())
