/**
 * Thông số dự án (Phần 0 của docs/SUPER_PROMPT.md).
 * Giá trị dạng {{...}} là chỗ trống chưa điền: hiển thị nguyên dạng cho tới khi người sở hữu điền.
 */
export const SITE = {
  name: 'Tư Duy Tin',
  slug: 'luyentinhoc',
  url: 'https://luyentinhoc.vercel.app',
  description:
    'Học tin học theo chương trình GDPT 2018, xem thuật toán chạy từng bước và luyện đề thi học sinh giỏi, Tin học trẻ với lời giải Python đã kiểm chứng.',
  organization: 'Giáo viên Nguyễn An Thu Uyên',
  contactEmail: 'anthuuyennguyen@gmail.com',
  codeLicense: 'MIT',
  contentLicense: 'CC BY-NC-SA 4.0',
  locale: 'vi_VN',
  storagePrefix: 'tdt:v1:',
} as const;

export const isPlaceholder = (value: string) => /^\{\{.*\}\}$/.test(value);

export type NavItem = {
  label: string;
  href: string;
  /** false: khu vực chưa xây, hiển thị dạng disabled có chú thích. */
  ready: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Học', href: '/hoc', ready: true },
  { label: 'Mô phỏng', href: '/mo-phong', ready: true },
  { label: 'Luyện đề', href: '/luyen-de', ready: true },
  { label: 'Tư duy', href: '/tu-duy', ready: true },
  { label: 'Cẩm nang', href: '/cam-nang', ready: true },
];

/** Khu thực hành ở chân trang (thanh điều hướng chỉ giữ 5 mục chính). */
export const PRACTICE_LINKS: NavItem[] = [
  { label: 'Phòng lập trình Python', href: '/lap-trinh', ready: true },
  { label: 'Phòng thực hành SQL', href: '/sql', ready: true },
  { label: 'Thi thử', href: '/thi-thu', ready: true },
  { label: 'Hồ sơ kỳ thi', href: '/ky-thi', ready: true },
  { label: 'Bẫy thường gặp', href: '/bay-thuong-gap', ready: true },
  { label: 'Tiến độ của bạn', href: '/tien-do', ready: true },
];

export const FOOTER_LINKS: NavItem[] = [
  { label: 'Giới thiệu', href: '/gioi-thieu', ready: true },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat', ready: true },
  { label: 'Điều khoản sử dụng', href: '/dieu-khoan', ready: true },
  { label: 'Dành cho giáo viên', href: '/giao-vien', ready: true },
];

export const LEVELS = [
  { value: 'all', label: 'Mọi cấp học' },
  { value: 'tieu-hoc', label: 'Tiểu học' },
  { value: 'thcs', label: 'THCS' },
  { value: 'thpt', label: 'THPT' },
] as const;

export type LevelValue = (typeof LEVELS)[number]['value'];
