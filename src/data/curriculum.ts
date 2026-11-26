/**
 * Khung lộ trình theo Chương trình GDPT 2018 môn Tin học (Thông tư 32/2018/TT-BGDĐT).
 * Đây là định hướng biên soạn của website, viết theo chương trình và SGK hiện hành; khi có văn bản
 * chính thức trong docs/SOURCES.md thì đối chiếu và chỉnh theo văn bản.
 */
import type { LevelKey } from './taxonomy';

export const STRANDS = {
  A: 'Máy tính và cộng đồng (THPT: Máy tính và xã hội tri thức)',
  B: 'Mạng máy tính và Internet',
  C: 'Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
  D: 'Đạo đức, pháp luật và văn hóa trong môi trường số',
  E: 'Ứng dụng tin học',
  F: 'Giải quyết vấn đề với sự trợ giúp của máy tính',
  G: 'Hướng nghiệp với tin học',
} as const;

export const GRADES: Record<number, { level: LevelKey; focus: string; tools: string }> = {
  3: {
    level: 'tieu-hoc',
    focus: 'Thực hiện công việc theo các bước, tư duy tuần tự.',
    tools: 'Câu đố robot trên lưới',
  },
  4: {
    level: 'tieu-hoc',
    focus: 'Lập trình trực quan: tuần tự, lặp lại.',
    tools: 'Khối lệnh (SGK dùng Scratch), câu đố',
  },
  5: {
    level: 'tieu-hoc',
    focus: 'Lập trình trực quan: rẽ nhánh, biến đơn giản.',
    tools: 'Khối lệnh (SGK dùng Scratch), câu đố',
  },
  6: {
    level: 'thcs',
    focus:
      'Khái niệm thuật toán; mô tả bằng liệt kê các bước và sơ đồ khối; ba cấu trúc điều khiển.',
    tools: 'Giả mã, sơ đồ khối',
  },
  7: {
    level: 'thcs',
    focus: 'Tìm kiếm tuần tự, tìm kiếm nhị phân; sắp xếp chọn, sắp xếp nổi bọt.',
    tools: 'Mô phỏng thuật toán',
  },
  8: {
    level: 'thcs',
    focus: 'Lập trình trực quan: biến, biểu thức, cấu trúc điều khiển.',
    tools: 'Khối lệnh, cầu nối sang Python',
  },
  9: {
    level: 'thcs',
    focus: 'Giải quyết vấn đề với máy tính; mở rộng Python để luyện thi học sinh giỏi lớp 9.',
    tools: 'Phòng Python, kho đề THCS',
  },
  10: {
    level: 'thpt',
    focus:
      'Lập trình Python cơ bản: kiểu dữ liệu, rẽ nhánh, lặp, hàm, list, xâu, kiểm thử và gỡ lỗi.',
    tools: 'Phòng Python, theo dõi từng dòng',
  },
  11: {
    level: 'thpt',
    focus: 'Cơ sở dữ liệu quan hệ và SQL; kỹ thuật lập trình: sắp xếp, tìm kiếm, độ phức tạp.',
    tools: 'Phòng SQL, mô phỏng',
  },
  12: {
    level: 'thpt',
    focus: 'Tạo trang web với HTML và CSS; chủ đề nâng cao định hướng Khoa học máy tính.',
    tools: 'Bài học HTML, CSS',
  },
};

export const TRACK_LABEL = {
  'chuong-trinh': 'Theo chương trình',
  hsg: 'Bồi dưỡng học sinh giỏi',
} as const;
