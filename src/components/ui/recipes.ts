/**
 * Recipe class dùng chung cho component Astro và React (đảo React dùng từ Giai đoạn 4).
 *
 * Mỗi trạng thái là một chuỗi class viết đầy đủ, vì Tailwind chỉ sinh CSS cho class xuất hiện
 * nguyên văn trong mã nguồn. `interactive` dùng khi chạy thật (hover:, active:, disabled:);
 * `default`, `hover`, `pressed`, `focus`, `disabled` là trạng thái "ép" để trưng bày ở /thiet-ke.
 */

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');

export type VisualState = 'interactive' | 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';
export const VISUAL_STATES = ['default', 'hover', 'pressed', 'focus', 'disabled'] as const;
export const STATE_LABELS: Record<(typeof VISUAL_STATES)[number], string> = {
  default: 'Mặc định',
  hover: 'Di chuột',
  pressed: 'Đang nhấn',
  focus: 'Focus',
  disabled: 'Vô hiệu',
};

/* ---------------------------------------------------------------- Button */

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xsm';
export const BUTTON_VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'error',
  'warning',
];
export const BUTTON_VARIANT_LABELS: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  error: 'Error',
  warning: 'Warning',
};

const BUTTON_BASE =
  'inline-flex min-h-touch items-center justify-center gap-75 rounded-8 px-100 py-75 transition duration-300 ease-base select-none';

const BUTTON_SIZE: Record<ButtonSize, string> = {
  lg: 'button-lg',
  md: 'button-md',
  sm: 'button-sm',
  xsm: 'button-xsm',
};

const BUTTON: Record<ButtonVariant, Record<Exclude<VisualState, 'focus'>, string>> = {
  primary: {
    interactive:
      'bg-action-primary text-text-on-action hover:bg-action-primary-hover active:scale-98 active:bg-action-primary-click disabled:cursor-not-allowed disabled:bg-action-primary-disabled disabled:text-text-primary-disabled',
    default: 'bg-action-primary text-text-on-action',
    hover: 'bg-action-primary-hover text-text-on-action',
    pressed: 'scale-98 bg-action-primary-click text-text-on-action',
    // Chữ mờ: ở mode tối nền vô hiệu trùng nền hover (cùng primary 700) nên phải khác ở chữ.
    disabled: 'cursor-not-allowed bg-action-primary-disabled text-text-primary-disabled',
  },
  secondary: {
    interactive:
      'border border-border-action-secondary bg-action-secondary text-text-primary hover:bg-action-secondary-hover active:scale-98 active:bg-action-secondary-click disabled:cursor-not-allowed disabled:border-border-primary-disabled disabled:text-text-primary-disabled',
    default: 'border border-border-action-secondary bg-action-secondary text-text-primary',
    hover: 'border border-border-action-secondary bg-action-secondary-hover text-text-primary',
    pressed:
      'scale-98 border border-border-action-secondary bg-action-secondary-click text-text-primary',
    disabled:
      'cursor-not-allowed border border-border-primary-disabled bg-action-secondary text-text-primary-disabled',
  },
  tertiary: {
    interactive:
      'bg-transparent text-text-info hover:bg-surface-primary-hover active:scale-98 active:bg-surface-secondary disabled:cursor-not-allowed disabled:text-text-primary-disabled',
    default: 'bg-transparent text-text-info',
    hover: 'bg-surface-primary-hover text-text-info',
    pressed: 'scale-98 bg-surface-secondary text-text-info',
    disabled: 'cursor-not-allowed bg-transparent text-text-primary-disabled',
  },
  error: {
    interactive:
      'bg-action-error text-text-on-action hover:bg-action-error-hover active:scale-98 active:bg-action-error-hover disabled:cursor-not-allowed disabled:bg-action-error-disabled disabled:text-text-primary-disabled',
    default: 'bg-action-error text-text-on-action',
    hover: 'bg-action-error-hover text-text-on-action',
    pressed: 'scale-98 bg-action-error-hover text-text-on-action',
    disabled: 'cursor-not-allowed bg-action-error-disabled text-text-primary-disabled',
  },
  warning: {
    interactive:
      'bg-action-warning text-text-on-warning hover:bg-action-warning-hover active:scale-98 active:bg-action-warning-hover disabled:cursor-not-allowed disabled:bg-action-warning-disabled disabled:text-text-primary-disabled',
    default: 'bg-action-warning text-text-on-warning',
    hover: 'bg-action-warning-hover text-text-on-warning',
    pressed: 'scale-98 bg-action-warning-hover text-text-on-warning',
    disabled: 'cursor-not-allowed bg-action-warning-disabled text-text-primary-disabled',
  },
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  state: VisualState = 'interactive',
) {
  const look = state === 'focus' ? `${BUTTON[variant].default} focus-ring` : BUTTON[variant][state];
  return cx(BUTTON_BASE, BUTTON_SIZE[size], look);
}

/* ------------------------------------------------------------ IconButton */

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary';

const ICON_BUTTON_BASE =
  'inline-flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full transition duration-300 ease-base';

const ICON_BUTTON: Record<IconButtonVariant, Record<Exclude<VisualState, 'focus'>, string>> = {
  ghost: {
    interactive:
      'text-icon-secondary hover:bg-surface-primary-hover hover:text-icon-default active:scale-98 active:bg-surface-secondary disabled:cursor-not-allowed disabled:text-icon-disabled',
    default: 'text-icon-secondary',
    hover: 'bg-surface-primary-hover text-icon-default',
    pressed: 'scale-98 bg-surface-secondary text-icon-default',
    disabled: 'cursor-not-allowed text-icon-disabled',
  },
  secondary: {
    interactive:
      'border border-border-action-secondary bg-action-secondary text-icon-default hover:bg-action-secondary-hover active:scale-98 active:bg-action-secondary-click disabled:cursor-not-allowed disabled:border-border-primary-disabled disabled:text-icon-disabled',
    default: 'border border-border-action-secondary bg-action-secondary text-icon-default',
    hover: 'border border-border-action-secondary bg-action-secondary-hover text-icon-default',
    pressed:
      'scale-98 border border-border-action-secondary bg-action-secondary-click text-icon-default',
    disabled:
      'cursor-not-allowed border border-border-primary-disabled bg-action-secondary text-icon-disabled',
  },
  primary: {
    interactive:
      'bg-action-primary text-text-on-action hover:bg-action-primary-hover active:scale-98 active:bg-action-primary-click disabled:cursor-not-allowed disabled:bg-action-primary-disabled disabled:text-icon-disabled',
    default: 'bg-action-primary text-text-on-action',
    hover: 'bg-action-primary-hover text-text-on-action',
    pressed: 'scale-98 bg-action-primary-click text-text-on-action',
    disabled: 'cursor-not-allowed bg-action-primary-disabled text-icon-disabled',
  },
};

export function iconButtonClasses(
  variant: IconButtonVariant = 'ghost',
  state: VisualState = 'interactive',
) {
  const look =
    state === 'focus' ? `${ICON_BUTTON[variant].default} focus-ring` : ICON_BUTTON[variant][state];
  return cx(ICON_BUTTON_BASE, look);
}

/* ------------------------------------------------------- Input, Select… */

export type FieldState =
  'interactive' | 'default' | 'hover' | 'focus' | 'filled' | 'error' | 'disabled';
export const FIELD_STATES = ['default', 'hover', 'focus', 'filled', 'error', 'disabled'] as const;
export const FIELD_STATE_LABELS: Record<(typeof FIELD_STATES)[number], string> = {
  default: 'Mặc định',
  hover: 'Di chuột',
  focus: 'Focus',
  filled: 'Đã nhập',
  error: 'Lỗi',
  disabled: 'Vô hiệu',
};

const FIELD_BASE =
  'body-3 w-full min-h-touch rounded-8 border bg-surface-primary px-100 py-75 text-text-primary placeholder:text-text-tertiary transition duration-300 ease-base';

const FIELD: Record<FieldState, string> = {
  interactive:
    'border-border-action-secondary hover:bg-surface-primary-hover focus-visible:border-border-action-primary error:border-border-error disabled:cursor-not-allowed disabled:border-border-primary-disabled disabled:bg-surface-secondary disabled:text-text-primary-disabled',
  default: 'border-border-action-secondary',
  hover: 'border-border-action-secondary bg-surface-primary-hover',
  focus: 'focus-ring border-border-action-primary',
  filled: 'border-border-action-secondary',
  error: 'border-border-error',
  disabled:
    'cursor-not-allowed border-border-primary-disabled bg-surface-secondary text-text-primary-disabled',
};

export function fieldClasses(state: FieldState = 'interactive') {
  return cx(FIELD_BASE, FIELD[state]);
}

/* --------------------------------------------------------- Badge, Tag… */

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'accent';
export const TONES: Tone[] = ['neutral', 'info', 'success', 'warning', 'error', 'accent'];

/** Nền nhạt + chữ đậm cùng họ màu; mọi cặp đã có trong check-contrast. */
export const TONE_SOFT: Record<Tone, string> = {
  neutral: 'bg-surface-secondary text-text-secondary',
  info: 'bg-surface-info-subtle text-text-info-inverted',
  success: 'bg-surface-success-subtle text-text-success-inverted',
  warning: 'bg-surface-warning-subtle text-text-warning-inverted',
  error: 'bg-surface-error-subtle text-text-error-inverted',
  accent: 'bg-surface-accent-subtle text-text-on-warning',
};

/** Viền cho Callout theo tông. */
export const TONE_BORDER: Record<Tone, string> = {
  neutral: 'border-border-primary',
  info: 'border-border-action-primary',
  success: 'border-border-success',
  warning: 'border-border-warning',
  error: 'border-border-error',
  accent: 'border-border-warning',
};

export const LEVEL_TONE: Record<1 | 2 | 3 | 4 | 5, Tone> = {
  1: 'success',
  2: 'info',
  3: 'accent',
  4: 'warning',
  5: 'error',
};

export const badgeClasses = (tone: Tone = 'neutral') =>
  cx(
    'caption-3 inline-flex items-center gap-50 rounded-full px-100 py-25 whitespace-nowrap',
    TONE_SOFT[tone],
  );

export const tagClasses = (interactive: boolean) =>
  cx(
    'caption-4 inline-flex items-center gap-50 rounded-full border border-border-primary px-100 py-25 text-text-secondary whitespace-nowrap',
    interactive &&
      'touch-target transition duration-300 ease-base hover:bg-surface-primary-hover hover:text-text-primary',
  );

/* ------------------------------------------------------------- Card */

export type CardState = 'interactive' | 'default' | 'hover' | 'focus' | 'selected';

const CARD_BASE = 'flex flex-col gap-200 rounded-16 border p-300';
const CARD: Record<CardState, string> = {
  interactive:
    'border-border-primary bg-surface-primary-subtle transition duration-300 ease-base hover:bg-surface-secondary active:translate-y-px',
  default: 'border-border-primary bg-surface-primary-subtle',
  hover: 'border-border-primary bg-surface-secondary',
  focus: 'focus-ring border-border-primary bg-surface-primary-subtle',
  selected: 'border-2 border-border-action-primary bg-surface-primary-subtle',
};

export const cardClasses = (state: CardState = 'default') => cx(CARD_BASE, CARD[state]);
