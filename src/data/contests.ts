/**
 * Hồ sơ kỳ thi (mục 4.8). Mọi thông tin thể lệ phải có nguồn trong docs/SOURCES.md; chưa xác minh
 * thì để CAN_XAC_MINH và trang hiển thị nhắc đối chiếu văn bản chính thức năm hiện hành.
 * Không ghi năm, lịch thi hay số liệu khi chưa có văn bản.
 */
import type { ContestKey, LevelKey, TopicKey } from './taxonomy';

export const CAN_XAC_MINH = '{{CẦN XÁC MINH}}';

export type ContestFact = { label: string; value: string; verified: boolean; note?: string };

export type ContestProfile = {
  id: ContestKey;
  name: string;
  short: string;
  levels: LevelKey[];
  status: 'dang-to-chuc' | 'luu-tru' | 'tham-khao';
  summary: string;
  facts: ContestFact[];
  /** Chủ đề nên ôn theo chương trình bồi dưỡng (không phải thống kê từ đề thật). */
  topics: TopicKey[];
  plan: { title: string; detail: string; href: string }[];
  traps: string[];
  notes: string[];
};

const unknown = (label: string, note?: string): ContestFact => ({
  label,
  value: CAN_XAC_MINH,
  verified: false,
  note,
});

export const CONTESTS: ContestProfile[] = [
  {
    id: 'hsg-tinh-gia-lai',
    name: 'Học sinh giỏi cấp tỉnh Gia Lai môn Tin học',
    short: 'HSG tỉnh Gia Lai',
    levels: ['thcs', 'thpt'],
    status: 'dang-to-chuc',
    summary:
      'Kỳ thi chọn học sinh giỏi cấp tỉnh môn Tin học dành cho học sinh THCS và THPT của tỉnh Gia Lai, bao gồm cả địa bàn tỉnh Bình Định cũ từ năm học 2025 đến 2026.',
    facts: [
      {
        label: 'Địa giới',
        value:
          'Từ ngày 01/7/2025, tỉnh Bình Định hợp nhất vào tỉnh Gia Lai mới. Đề từ năm học 2025 đến 2026 trở đi gắn nhãn Gia Lai (mới); đề trước thời điểm đó giữ nhãn tỉnh cũ.',
        verified: true,
      },
      unknown('Đối tượng dự thi'),
      unknown('Hình thức thi', 'Thường là viết chương trình, chấm tự động theo bộ test.'),
      unknown('Ngôn ngữ lập trình được dùng'),
      unknown('Phần mềm chấm', 'Nhiều kỳ thi tin học cấp tỉnh dùng Themis.'),
      unknown('Quy ước tên file và thư mục bài làm'),
      unknown(
        'Thời gian làm bài',
        'Đề tin học cấp tỉnh thường có 3 đến 5 bài trong 150 đến 180 phút.',
      ),
      unknown('Thang điểm và cách tính điểm'),
    ],
    topics: [
      'so-hoc',
      'so-nguyen-to',
      'xau',
      'sap-xep',
      'mang-cong-don',
      'hai-con-tro',
      'quy-hoach-dong',
      'bfs',
      'chat-nhi-phan',
    ],
    plan: [
      {
        title: 'Vào ra như phòng thi',
        detail: 'Đọc ghi file .INP, .OUT, đọc nhanh, cấu trúc main().',
        href: '/hoc/thpt/python-vao-ra-du-lieu',
      },
      {
        title: 'Số học',
        detail: 'Ước, bội, UCLN, số nguyên tố, sàng.',
        href: '/hoc/thcs/so-hoc-cho-hsg',
      },
      {
        title: 'Độ phức tạp',
        detail: 'Chọn thuật toán theo giới hạn n cho Python.',
        href: '/hoc/thpt/do-phuc-tap-thoi-gian',
      },
      {
        title: 'Kỹ thuật mảng',
        detail: 'Cộng dồn, hai con trỏ, cửa sổ trượt.',
        href: '/hoc/thpt/mang-cong-don-va-hai-con-tro',
      },
      {
        title: 'Quy hoạch động',
        detail: 'Các dạng kinh điển và cách tìm công thức.',
        href: '/hoc/thpt/quy-hoach-dong-nhap-mon',
      },
      {
        title: 'Đồ thị',
        detail: 'BFS, DFS, Dijkstra trên lưới và danh sách cạnh.',
        href: '/hoc/thpt/do-thi-va-bfs',
      },
      {
        title: 'Thi thử có bấm giờ',
        detail: 'Làm đề ghép nhiều bài, tự chấm, rút kinh nghiệm.',
        href: '/thi-thu',
      },
    ],
    traps: [
      'sai-ten-file',
      'doc-du-lieu-cham',
      'chon-sai-do-phuc-tap',
      'bo-qua-subtask',
      'python-cu-tren-may-cham',
    ],
    notes: [
      'Đề trong kho của trang hiện là đề luyện biên soạn theo dạng bài thường gặp, không phải đề chính thức.',
      'Khi có đề chính thức, giáo viên đặt file vào thư mục source-materials/ kèm nguồn để biên tập theo đúng quy trình.',
    ],
  },
  {
    id: 'hsg-tinh-binh-dinh',
    name: 'Học sinh giỏi cấp tỉnh Bình Định môn Tin học (lưu trữ)',
    short: 'HSG tỉnh Bình Định',
    levels: ['thcs', 'thpt'],
    status: 'luu-tru',
    summary:
      'Kho lưu trữ đề học sinh giỏi cấp tỉnh Bình Định đến năm học 2024 đến 2025, trước khi tỉnh hợp nhất vào tỉnh Gia Lai mới.',
    facts: [
      {
        label: 'Phạm vi',
        value:
          'Chỉ lưu đề các năm trước ngày 01/7/2025. Từ năm học 2025 đến 2026, xem hồ sơ HSG tỉnh Gia Lai.',
        verified: true,
      },
      unknown('Hình thức thi các năm trước'),
      unknown('Ngôn ngữ lập trình được dùng'),
      unknown('Quy ước tên file và thư mục bài làm'),
    ],
    topics: ['so-hoc', 'xau', 'sap-xep', 'mang-cong-don', 'quy-hoach-dong'],
    plan: [
      {
        title: 'Ôn theo hồ sơ Gia Lai',
        detail: 'Lộ trình ôn dùng chung với kỳ thi của tỉnh Gia Lai mới.',
        href: '/ky-thi/hsg-tinh-gia-lai',
      },
    ],
    traps: ['sai-ten-file', 'truong-hop-bien'],
    notes: [
      'Chưa có đề chính thức nào trong kho. Đề chính thức chỉ được thêm khi có file gốc và nguồn rõ ràng.',
    ],
  },
  {
    id: 'tin-hoc-tre',
    name: 'Hội thi Tin học trẻ',
    short: 'Tin học trẻ',
    levels: ['tieu-hoc', 'thcs', 'thpt'],
    status: 'dang-to-chuc',
    summary:
      'Hội thi có vòng cấp tỉnh và toàn quốc, chia bảng theo cấp học, gồm phần thi lập trình và phần thi sản phẩm sáng tạo.',
    facts: [
      unknown('Đơn vị tổ chức năm hiện hành'),
      unknown('Các bảng thi và đối tượng'),
      unknown('Ngôn ngữ lập trình được dùng ở từng bảng'),
      unknown('Hình thức chấm phần thi lập trình'),
      unknown('Thời gian làm bài'),
    ],
    topics: ['vao-ra', 're-nhanh', 'vong-lap', 'xau', 'so-hoc', 'mang'],
    plan: [
      {
        title: 'Tư duy thuật toán',
        detail: 'Câu đố robot, quy luật, sắp xếp các bước.',
        href: '/tu-duy',
      },
      {
        title: 'Từ khối lệnh sang Python',
        detail: 'Biến, rẽ nhánh, vòng lặp bằng Python.',
        href: '/hoc/thcs/tu-khoi-lenh-sang-python',
      },
      {
        title: 'Xâu và danh sách',
        detail: 'Duyệt xâu, đếm, kiểm tra đối xứng.',
        href: '/hoc/thpt/list-va-xau',
      },
      {
        title: 'Luyện đề Tin học trẻ',
        detail: 'Các bài vào ra chuẩn, độ khó 1 đến 2.',
        href: '/luyen-de',
      },
    ],
    traps: ['in-loi-nhac', 'doc-theo-token', 'sai-dinh-dang-output', 'truong-hop-bien'],
    notes: [
      'Thể lệ Tin học trẻ thay đổi theo năm. Hãy đọc thể lệ chính thức của năm dự thi trước khi luyện.',
    ],
  },
  {
    id: 'hsg-truong',
    name: 'Học sinh giỏi cấp trường, cấp huyện',
    short: 'HSG trường, huyện',
    levels: ['thcs', 'thpt'],
    status: 'dang-to-chuc',
    summary: 'Kỳ thi chọn đội tuyển do trường hoặc địa phương tổ chức theo quy định hiện hành.',
    facts: [
      unknown(
        'Khối lớp được tổ chức thi',
        'Quy định tổ chức thi HSG ở một số khối lớp đã thay đổi, cần xác minh.',
      ),
      unknown('Hình thức thi'),
    ],
    topics: ['vao-ra', 'vong-lap', 'mang', 'xau', 'so-hoc', 'sap-xep'],
    plan: [
      { title: 'Nền tảng', detail: 'Làm hết bài độ khó 1 đến 3 trong kho đề.', href: '/luyen-de' },
    ],
    traps: ['in-loi-nhac', 'truong-hop-bien'],
    notes: [],
  },
  {
    id: 'olympic-30-4',
    name: 'Olympic truyền thống 30/4',
    short: 'Olympic 30/4',
    levels: ['thpt'],
    status: 'tham-khao',
    summary: 'Tham khảo nâng cao cho học sinh muốn vượt mức đề cấp tỉnh.',
    facts: [unknown('Thể lệ năm hiện hành')],
    topics: ['quy-hoach-dong', 'do-thi', 'duong-di-ngan-nhat', 'chat-nhi-phan'],
    plan: [{ title: 'Chuyên sâu', detail: 'Các bài độ khó 4 đến 5.', href: '/luyen-de' }],
    traps: ['chon-sai-do-phuc-tap', 'de-quy-qua-sau'],
    notes: [],
  },
  {
    id: 'hsg-quoc-gia',
    name: 'Kỳ thi chọn học sinh giỏi quốc gia',
    short: 'HSG quốc gia',
    levels: ['thpt'],
    status: 'tham-khao',
    summary: 'Tham khảo cho cấp độ 5 (chuyên sâu).',
    facts: [unknown('Thể lệ năm hiện hành')],
    topics: ['quy-hoach-dong', 'do-thi', 'duong-di-ngan-nhat'],
    plan: [{ title: 'Chuyên sâu', detail: 'Các bài độ khó 5.', href: '/luyen-de' }],
    traps: ['chon-sai-do-phuc-tap'],
    notes: [],
  },
];

export const CONTEST_LABEL = Object.fromEntries(CONTESTS.map((c) => [c.id, c.short])) as Record<
  ContestKey,
  string
>;

export const CONTEST_STATUS_LABEL: Record<ContestProfile['status'], string> = {
  'dang-to-chuc': 'Đang tổ chức',
  'luu-tru': 'Lưu trữ',
  'tham-khao': 'Tham khảo nâng cao',
};

export const getContest = (id: string) => CONTESTS.find((c) => c.id === id);
