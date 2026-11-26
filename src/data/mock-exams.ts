/**
 * Đề thi thử (mục 4.8): ghép các bài đã kiểm định trong kho đề. Mọi đề ở đây là đề luyện biên
 * soạn; thời gian và thang điểm do trang chọn để luyện tập, không phải thể lệ chính thức.
 * (SUPER_PROMPT gợi ý tệp YAML; dùng TypeScript để kiểm tra kiểu lúc build.)
 */
import type { ContestKey, LevelKey } from './taxonomy';

export type MockExam = {
  id: string;
  title: string;
  contest: ContestKey;
  level: LevelKey;
  minutes: number;
  description: string;
  problems: { id: string; points: number }[];
};

const five = (ids: string[]) => ids.map((id) => ({ id, points: 5 }));

export const MOCK_EXAMS: MockExam[] = [
  {
    id: 'tin-hoc-tre-thcs-1',
    title: 'Đề luyện phần thi lập trình Tin học trẻ THCS, số 1',
    contest: 'tin-hoc-tre',
    level: 'thcs',
    minutes: 90,
    description:
      '4 bài vào ra chuẩn: số học, đếm, xâu. Phù hợp học sinh lớp 6 đến 8 mới học Python.',
    problems: five(['tong-chu-so', 'dem-so-chan-le', 'xau-doi-xung', 'thong-ke-chu-cai']),
  },
  {
    id: 'hsg-thcs-1',
    title: 'Đề luyện học sinh giỏi THCS, số 1',
    contest: 'hsg-tinh-gia-lai',
    level: 'thcs',
    minutes: 150,
    description: '4 bài đọc ghi file: ước số, ước chung, số nguyên tố, cửa sổ trượt.',
    problems: five(['tong-uoc', 'ucln-cua-day', 'so-nguyen-to-trong-doan', 'tong-k-lien-tiep']),
  },
  {
    id: 'hsg-thcs-2',
    title: 'Đề luyện học sinh giỏi THCS, số 2',
    contest: 'hsg-tinh-gia-lai',
    level: 'thcs',
    minutes: 150,
    description: '4 bài đọc ghi file: xâu, đệ quy, sắp xếp, tìm kiếm nhị phân.',
    problems: five(['thong-ke-chu-cai', 'thap-ha-noi', 'xep-hang-thi-dau', 'dem-so-nho-hon']),
  },
  {
    id: 'hsg-thpt-1',
    title: 'Đề luyện học sinh giỏi THPT, số 1',
    contest: 'hsg-tinh-gia-lai',
    level: 'thpt',
    minutes: 180,
    description: '4 bài: mảng cộng dồn, hai con trỏ, quy hoạch động, BFS.',
    problems: five(['doanh-thu-ca-phe', 'dem-cap-tong', 'doi-tien', 'me-cung']),
  },
  {
    id: 'hsg-thpt-2',
    title: 'Đề luyện học sinh giỏi THPT, số 2',
    contest: 'hsg-tinh-gia-lai',
    level: 'thpt',
    minutes: 180,
    description: '4 bài: sắp xếp nhiều tiêu chí, Kadane, đếm đường đi, Dijkstra.',
    problems: five(['xep-hang-thi-dau', 'doan-con-tong-lon-nhat', 'duong-di-luoi', 'giao-hang']),
  },
  {
    id: 'hsg-thpt-3',
    title: 'Đề luyện học sinh giỏi THPT, số 3',
    contest: 'hsg-tinh-gia-lai',
    level: 'thpt',
    minutes: 180,
    description: '4 bài mức vận dụng cao: dãy con tăng, cái túi, xâu con chung, chặt nhị phân.',
    problems: five(['day-con-tang', 'cai-tui', 'xau-con-chung', 'chia-day']),
  },
];

export const getMockExam = (id: string) => MOCK_EXAMS.find((e) => e.id === id);
