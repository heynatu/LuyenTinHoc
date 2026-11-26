/// <reference lib="webworker" />
/**
 * Web Worker chạy SQLite (sql.js, tự host). Mỗi cơ sở dữ liệu có một bản làm việc để học sinh thử
 * tự do; khi chấm bài, worker tạo hai bản mới từ schema (một cho lời giải, một cho bài làm).
 */
import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import versions from '../../generated/wasm-versions.json';
import { compareResults, type ResultSet } from './compare';

export type SqlRequest =
  | { id: number; type: 'exec'; db: string; schema: string; sql: string }
  | { id: number; type: 'reset'; db: string; schema: string }
  | {
      id: number;
      type: 'check';
      schema: string;
      user: string;
      solution: string;
      check?: string;
      ordered?: boolean;
    };

export type SqlResponse =
  | { id: number; type: 'exec'; ok: true; results: ResultSet[]; changes: number }
  | { id: number; type: 'check'; ok: true; pass: boolean; reason: string; expected?: ResultSet }
  | { id: number; type: 'reset'; ok: true }
  | { id: number; type: 'error'; ok: false; message: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;
let sqlPromise: Promise<SqlJsStatic> | null = null;
const working = new Map<string, Database>();

const loadSql = () =>
  (sqlPromise ??= initSqlJs({
    locateFile: () => `/sqljs/v${versions['sql.js']}/sql-wasm-browser.wasm`,
    // Giữ mặc định của sql.js (kiểu khai báo bắt buộc ghi rõ trường này).
    useOldExtensionFunctions: true,
  }));

async function fresh(schema: string): Promise<Database> {
  const SQL = await loadSql();
  const db = new SQL.Database();
  db.exec(schema);
  return db;
}

const last = (results: ResultSet[]) => results[results.length - 1];

scope.onmessage = async (event: MessageEvent<SqlRequest>) => {
  const req = event.data;
  try {
    if (req.type === 'reset') {
      working.get(req.db)?.close();
      working.set(req.db, await fresh(req.schema));
      scope.postMessage({ id: req.id, type: 'reset', ok: true } satisfies SqlResponse);
      return;
    }
    if (req.type === 'exec') {
      let db = working.get(req.db);
      if (!db) {
        db = await fresh(req.schema);
        working.set(req.db, db);
      }
      const results = db.exec(req.sql) as ResultSet[];
      scope.postMessage({
        id: req.id,
        type: 'exec',
        ok: true,
        results,
        changes: db.getRowsModified(),
      } satisfies SqlResponse);
      return;
    }
    const ref = await fresh(req.schema);
    const mine = await fresh(req.schema);
    try {
      const refOut = ref.exec(req.solution) as ResultSet[];
      let mineOut: ResultSet[];
      try {
        mineOut = mine.exec(req.user) as ResultSet[];
      } catch (error) {
        scope.postMessage({
          id: req.id,
          type: 'check',
          ok: true,
          pass: false,
          reason: `Câu lệnh bị lỗi: ${(error as Error).message}`,
        } satisfies SqlResponse);
        return;
      }
      const expected = req.check ? last(ref.exec(req.check) as ResultSet[]) : last(refOut);
      const actual = req.check ? last(mine.exec(req.check) as ResultSet[]) : last(mineOut);
      const verdict = compareResults(expected, actual, req.ordered || Boolean(req.check));
      scope.postMessage({
        id: req.id,
        type: 'check',
        ok: true,
        pass: verdict.ok,
        reason: verdict.ok ? 'Kết quả khớp với lời giải.' : verdict.reason,
        expected: req.check ? undefined : expected,
      } satisfies SqlResponse);
    } finally {
      ref.close();
      mine.close();
    }
  } catch (error) {
    scope.postMessage({
      id: req.id,
      type: 'error',
      ok: false,
      message: (error as Error).message,
    } satisfies SqlResponse);
  }
};
