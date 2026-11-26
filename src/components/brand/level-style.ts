/**
 * Màu và icon riêng cho từng cấp học (kiểu thẻ khóa học nhiều màu của các web học lập trình).
 * Chữ trên nền subtle dùng token inverted tương ứng; mọi cặp đã có trong check-contrast.
 */
import { DatabaseIcon, FlowArrowIcon, PuzzlePieceIcon } from '@phosphor-icons/react/ssr';
import type { LevelKey } from '../../data/taxonomy';

export const LEVEL_STYLE: Record<
  LevelKey,
  { icon: typeof PuzzlePieceIcon; panel: string; edge: string }
> = {
  'tieu-hoc': {
    icon: PuzzlePieceIcon,
    panel: 'bg-surface-success-subtle text-text-success-inverted',
    edge: 'hover:border-border-success',
  },
  thcs: {
    icon: FlowArrowIcon,
    panel: 'bg-surface-info-subtle text-text-info-inverted',
    edge: 'hover:border-border-action-primary',
  },
  thpt: {
    icon: DatabaseIcon,
    panel: 'bg-surface-accent-subtle text-text-on-warning',
    edge: 'hover:border-border-warning',
  },
};
