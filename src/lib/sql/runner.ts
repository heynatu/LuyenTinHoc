/** Điều khiển worker SQLite từ trang: nạp lười, quá 3 giây thì dừng cưỡng bức và tạo worker mới. */
import type { SqlRequest, SqlResponse } from './worker';

type Pending = { resolve: (r: SqlResponse) => void; timer: number };
type Body<T> = T extends unknown ? Omit<T, 'id'> : never;

const TIMEOUT = 3000;
let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, Pending>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module', name: 'sql' });
  worker.addEventListener('message', (event: MessageEvent<SqlResponse>) => {
    const p = pending.get(event.data.id);
    if (!p) return;
    window.clearTimeout(p.timer);
    pending.delete(event.data.id);
    p.resolve(event.data);
  });
  return worker;
}

function restart(message: string) {
  worker?.terminate();
  worker = null;
  for (const [id, p] of pending) {
    window.clearTimeout(p.timer);
    p.resolve({ id, type: 'error', ok: false, message });
  }
  pending.clear();
}

export function sqlRequest(body: Body<SqlRequest>): Promise<SqlResponse> {
  const id = nextId++;
  const w = getWorker();
  return new Promise((resolve) => {
    const timer = window.setTimeout(
      () =>
        restart(
          'Câu lệnh chạy quá 3 giây nên đã bị dừng. Cơ sở dữ liệu làm việc được tạo lại từ đầu.',
        ),
      TIMEOUT + (nextId === 2 ? 5000 : 0),
    );
    pending.set(id, { resolve, timer });
    w.postMessage({ ...body, id } as SqlRequest);
  });
}
