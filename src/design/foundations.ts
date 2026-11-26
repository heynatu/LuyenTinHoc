/** Danh sách token nền tảng để trưng bày ở /thiet-ke (giá trị thật nằm trong CSS). */

export const SPACING = [
  ['0', 0],
  ['25', 2],
  ['50', 4],
  ['75', 8],
  ['100', 12],
  ['200', 16],
  ['300', 24],
  ['400', 32],
  ['500', 40],
  ['600', 48],
  ['700', 64],
  ['800', 80],
  ['900', 96],
] as const;

export const RADIUS = [
  ['0', '0'],
  ['2', '2px'],
  ['4', '4px'],
  ['6', '6px'],
  ['8', '8px'],
  ['12', '12px'],
  ['16', '16px'],
  ['24', '24px'],
  ['full', '9999px'],
] as const;

export const TEXT_STYLES = [
  {
    group: 'Heading',
    items: [
      ['heading-1', '60 / 60', 'Semibold'],
      ['heading-2', '48 / 48', 'Semibold'],
      ['heading-3', '36 / 40', 'Semibold'],
      ['heading-4', '30 / 36', 'Semibold'],
      ['heading-5', '24 / 32', 'Semibold'],
      ['heading-6', '20 / 28', 'Semibold'],
    ],
  },
  {
    group: 'Title',
    items: [
      ['title-1', '20 / 28', 'Medium'],
      ['title-2', '18 / 28', 'Medium'],
      ['title-3', '16 / 24', 'Medium'],
      ['title-4', '14 / 20', 'Medium'],
      ['title-5', '12 / 16', 'Medium'],
    ],
  },
  {
    group: 'Body',
    items: [
      ['body-1', '16 / 24', 'Semibold'],
      ['body-2', '16 / 24', 'Medium'],
      ['body-3', '16 / 24', 'Regular'],
      ['body-4', '14 / 20', 'Semibold'],
      ['body-5', '14 / 20', 'Medium'],
      ['body-6', '14 / 20', 'Regular'],
    ],
  },
  {
    group: 'Button',
    items: [
      ['button-lg', '18 / 28', 'Semibold'],
      ['button-md', '16 / 24', 'Semibold'],
      ['button-sm', '14 / 20', 'Semibold'],
      ['button-xsm', '12 / 16', 'Semibold'],
    ],
  },
  {
    group: 'Caption',
    items: [
      ['caption-1', '14 / 20', 'Medium'],
      ['caption-2', '14 / 20', 'Regular'],
      ['caption-3', '12 / 16', 'Semibold'],
      ['caption-4', '12 / 16', 'Medium'],
      ['caption-5', '12 / 16', 'Regular'],
    ],
  },
] as const;

export const GROUP_LABELS: Record<string, string> = {
  border: 'Border',
  surface: 'Surface',
  action: 'Action',
  text: 'Text',
  icon: 'Icon',
  overlay: 'Overlay',
};
