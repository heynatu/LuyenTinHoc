/**
 * Thông báo nổi (toast). Dựng DOM bằng createElement và textContent, không chèn HTML thô.
 * Icon lấy từ <template> do ToastRegion.astro render sẵn (icon Phosphor dựng lúc build).
 * Lỗi đọc qua vùng assertive, còn lại qua vùng polite. Tối đa 3 thông báo cùng lúc.
 */

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
  message: string;
  tone?: ToastTone;
  /** Mili giây; 0 là không tự đóng. Mặc định 5000 (lỗi: 8000). */
  duration?: number;
};

const MAX_VISIBLE = 3;

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'text-icon-success',
  error: 'text-icon-error',
  info: 'text-icon-info',
  warning: 'text-icon-warning',
};

function cloneTemplate(id: string): DocumentFragment | null {
  const template = document.getElementById(id);
  return template instanceof HTMLTemplateElement
    ? (template.content.cloneNode(true) as DocumentFragment)
    : null;
}

function dismiss(toast: HTMLElement) {
  if (toast.dataset.leaving === 'true') return;
  toast.dataset.leaving = 'true';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => toast.remove(), reduce ? 0 : 300);
}

export function showToast({ message, tone = 'info', duration }: ToastOptions): HTMLElement | null {
  const region = document.getElementById(tone === 'error' ? 'toast-assertive' : 'toast-polite');
  if (!region) return null;

  const all = document.querySelectorAll<HTMLElement>('.ui-toast:not([data-leaving="true"])');
  if (all.length >= MAX_VISIBLE && all[0]) dismiss(all[0]);

  const toast = document.createElement('div');
  toast.className =
    'ui-toast pointer-events-auto flex w-full items-start gap-100 rounded-12 border border-border-primary bg-surface-primary p-200 animate-enter';
  toast.dataset.tone = tone;

  const icon = document.createElement('span');
  icon.className = `inline-flex shrink-0 pt-25 ${TONE_CLASSES[tone]}`;
  const iconContent = cloneTemplate(`toast-icon-${tone}`);
  if (iconContent) icon.append(iconContent);

  const text = document.createElement('p');
  text.className = 'body-5 flex-1 text-text-primary';
  text.textContent = message;

  const close = document.createElement('button');
  close.type = 'button';
  close.className =
    'inline-flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full text-icon-secondary transition duration-300 ease-base hover:bg-surface-primary-hover hover:text-icon-default';
  close.setAttribute('aria-label', 'Đóng thông báo');
  const closeIcon = cloneTemplate('toast-icon-close');
  if (closeIcon) close.append(closeIcon);
  close.addEventListener('click', () => dismiss(toast));

  toast.append(icon, text, close);
  region.append(toast);

  const ms = duration ?? (tone === 'error' ? 8000 : 5000);
  if (ms > 0) {
    let timer = window.setTimeout(() => dismiss(toast), ms);
    const pause = () => window.clearTimeout(timer);
    const resume = () => {
      timer = window.setTimeout(() => dismiss(toast), ms);
    };
    toast.addEventListener('mouseenter', pause);
    toast.addEventListener('mouseleave', resume);
    toast.addEventListener('focusin', pause);
    toast.addEventListener('focusout', resume);
  }
  return toast;
}
