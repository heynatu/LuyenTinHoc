/** Danh mục dùng chung: cấp học, chủ đề, kỳ thi. Schema nội dung kiểm tra theo các khóa này. */

export const LEVEL_KEYS = ['tieu-hoc', 'thcs', 'thpt'] as const;
export type LevelKey = (typeof LEVEL_KEYS)[number];

export const LEVEL_INFO: Record<LevelKey, { label: string; grades: number[]; summary: string }> = {
  'tieu-hoc': {
    label: 'Tiểu học',
    grades: [3, 4, 5],
    summary:
      'Làm quen với việc chia công việc thành các bước, lặp lại và rẽ nhánh qua câu đố và khối lệnh.',
  },
  thcs: {
    label: 'THCS',
    grades: [6, 7, 8, 9],
    summary:
      'Thuật toán, sơ đồ khối, tìm kiếm và sắp xếp; mở rộng sang Python để luyện thi học sinh giỏi lớp 9.',
  },
  thpt: {
    label: 'THPT',
    grades: [10, 11, 12],
    summary:
      'Lập trình Python, cơ sở dữ liệu và SQL, kỹ thuật lập trình, cấu trúc dữ liệu và giải thuật cho kỳ thi tỉnh.',
  },
};

export const TOPICS = {
  'vao-ra': 'Vào ra dữ liệu',
  're-nhanh': 'Rẽ nhánh',
  'vong-lap': 'Vòng lặp',
  mang: 'Mảng, danh sách',
  xau: 'Xâu ký tự',
  'so-hoc': 'Số học',
  'so-nguyen-to': 'Số nguyên tố',
  'tim-kiem': 'Tìm kiếm',
  'tim-kiem-nhi-phan': 'Tìm kiếm nhị phân',
  'sap-xep': 'Sắp xếp',
  'mang-cong-don': 'Mảng cộng dồn',
  'hai-con-tro': 'Hai con trỏ',
  'cua-so-truot': 'Cửa sổ trượt',
  'de-quy': 'Đệ quy',
  'quay-lui': 'Quay lui',
  'tham-lam': 'Tham lam',
  'quy-hoach-dong': 'Quy hoạch động',
  'ngan-xep': 'Ngăn xếp',
  'hang-doi': 'Hàng đợi',
  'do-thi': 'Đồ thị',
  bfs: 'Tìm kiếm theo chiều rộng',
  dfs: 'Tìm kiếm theo chiều sâu',
  'duong-di-ngan-nhat': 'Đường đi ngắn nhất',
  'chat-nhi-phan': 'Chặt nhị phân theo đáp án',
  'to-hop': 'Tổ hợp, đếm',
  'co-so-du-lieu': 'Cơ sở dữ liệu, SQL',
} as const;
export type TopicKey = keyof typeof TOPICS;
export const TOPIC_KEYS = Object.keys(TOPICS) as [TopicKey, ...TopicKey[]];

export const CONTEST_KEYS = [
  'hsg-tinh-gia-lai',
  'hsg-tinh-binh-dinh',
  'tin-hoc-tre',
  'hsg-truong',
  'olympic-30-4',
  'hsg-quoc-gia',
] as const;
export type ContestKey = (typeof CONTEST_KEYS)[number];

export const DIFFICULTY_KEYS = [1, 2, 3, 4, 5] as const;
