/**
 * Nút "Sao chép code" cho mọi khung code (component và Markdown). Nạp một lần từ BaseLayout.
 * Dùng ủy quyền sự kiện nên khung code thêm sau (mô phỏng, phòng lập trình) cũng chạy.
 */
import { showToast } from './toast';

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

document.addEventListener('click', async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest<HTMLButtonElement>('[data-copy-code]');
  if (!button) return;
  const frame = button.closest('[data-code-frame]');
  const raw = frame?.querySelector<HTMLElement>('code[data-raw]')?.dataset.raw ?? '';
  if (!(await copyText(raw))) {
    showToast({ tone: 'error', message: 'Không sao chép được. Bôi đen đoạn code rồi bấm Ctrl+C.' });
    return;
  }
  showToast({ tone: 'success', message: 'Đã sao chép code' });
  const idle = button.querySelector<HTMLElement>('[data-copy-icon="idle"]');
  const done = button.querySelector<HTMLElement>('[data-copy-icon="done"]');
  idle?.classList.add('hidden');
  done?.classList.remove('hidden');
  window.setTimeout(() => {
    idle?.classList.remove('hidden');
    done?.classList.add('hidden');
  }, 2000);
});
