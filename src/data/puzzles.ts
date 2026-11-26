/**
 * Câu đố tư duy (mục 4.7). Toàn bộ do trang tự biên soạn, không chép đề Bebras hay nguồn có bản
 * quyền. Mỗi câu chạy trên một động cơ dùng chung (src/lib/puzzles/engines.ts); unit test kiểm tra
 * mọi câu đều giải được và đáp án nằm trong danh sách lựa chọn.
 */
import type { LevelKey } from './taxonomy';
import type { RobotCommand } from '../lib/puzzles/engines';

export const PUZZLE_LEVELS = {
  'khoi-dong': 'Khởi động',
  'vung-vang': 'Vững vàng',
  'thu-thach': 'Thử thách',
  'chuyen-sau': 'Chuyên sâu',
} as const;
export type PuzzleLevel = keyof typeof PUZZLE_LEVELS;

export const SKILLS = {
  'phan-ra': 'Phân rã vấn đề',
  'nhan-dang-mau': 'Nhận dạng mẫu',
  'truu-tuong-hoa': 'Trừu tượng hóa',
  'thiet-ke-thuat-toan': 'Thiết kế thuật toán',
} as const;
export type Skill = keyof typeof SKILLS;

export const ENGINES = {
  robot: 'Lập trình robot',
  binary: 'Thẻ nhị phân',
  order: 'Sắp xếp các bước',
  choice: 'Suy luận, chọn đáp án',
} as const;

type Base = {
  id: string;
  title: string;
  level: PuzzleLevel;
  audience: LevelKey[];
  skill: Skill;
  prompt: string;
  hints: [string, string];
  solution: string;
};

export type RobotPuzzle = Base & {
  engine: 'robot';
  grid: string[];
  maxCommands: number;
  /** Một chương trình đúng, dùng cho unit test và phần lời giải. */
  answer: RobotCommand[];
};
export type BinaryPuzzle = Base & { engine: 'binary'; cards: number[]; target: number };
export type OrderPuzzle = Base & { engine: 'order'; steps: string[]; mono?: boolean };
export type ChoicePuzzle = Base & {
  engine: 'choice';
  code?: string;
  options: string[];
  answer: number;
};
export type Puzzle = RobotPuzzle | BinaryPuzzle | OrderPuzzle | ChoicePuzzle;

const ROBOT_PROMPT =
  'Bấm các nút để ghép chương trình cho robot (mỗi lệnh đi thẳng một số bước), rồi bấm Chạy. Robot phải tới cờ đích';

export const PUZZLES: Puzzle[] = [
  // ------------------------------------------------------------------ Robot
  {
    id: 'robot-den-kho-bau',
    title: 'Đến kho báu',
    engine: 'robot',
    level: 'khoi-dong',
    audience: ['tieu-hoc'],
    skill: 'thiet-ke-thuat-toan',
    prompt: `${ROBOT_PROMPT}. Chỉ được dùng 1 lệnh.`,
    grid: ['.....', 'S...G', '.....'],
    maxCommands: 1,
    answer: [{ dir: 'R', steps: 4 }],
    hints: ['Robot và cờ đích nằm trên cùng một hàng.', 'Đếm số ô từ robot tới cờ.'],
    solution:
      'Sang phải 4 bước. Một lệnh "đi 4 bước" thay cho bốn lệnh "đi 1 bước": đó là ý tưởng của vòng lặp.',
  },
  {
    id: 'robot-vong-qua-tang-da',
    title: 'Vòng qua tảng đá',
    engine: 'robot',
    level: 'khoi-dong',
    audience: ['tieu-hoc'],
    skill: 'phan-ra',
    prompt: `${ROBOT_PROMPT}. Tối đa 3 lệnh.`,
    grid: ['.....', 'S.#.G', '.....'],
    maxCommands: 3,
    answer: [
      { dir: 'U', steps: 1 },
      { dir: 'R', steps: 4 },
      { dir: 'D', steps: 1 },
    ],
    hints: [
      'Không đi xuyên qua tảng đá được. Hãy tách đường đi thành ba đoạn.',
      'Lên một hàng, đi thẳng, rồi xuống lại.',
    ],
    solution:
      'Đi lên 1, sang phải 4, đi xuống 1. Chia một việc khó thành vài việc nhỏ là phân rã vấn đề.',
  },
  {
    id: 'robot-cau-thang',
    title: 'Đường zích zắc',
    engine: 'robot',
    level: 'vung-vang',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'phan-ra',
    prompt: `${ROBOT_PROMPT}. Tối đa 5 lệnh.`,
    grid: ['S#...', '.#.#.', '...#G'],
    maxCommands: 5,
    answer: [
      { dir: 'D', steps: 2 },
      { dir: 'R', steps: 2 },
      { dir: 'U', steps: 2 },
      { dir: 'R', steps: 2 },
      { dir: 'D', steps: 2 },
    ],
    hints: [
      'Đường đi có hình chữ S, mỗi đoạn thẳng là một lệnh.',
      'Đoạn đầu tiên đi xuống 2 bước.',
    ],
    solution: 'Đi xuống 2, sang phải 2, đi lên 2, sang phải 2, đi xuống 2.',
  },
  {
    id: 'robot-hai-ngoi-sao',
    title: 'Nhặt hai ngôi sao',
    engine: 'robot',
    level: 'vung-vang',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'thiet-ke-thuat-toan',
    prompt: `${ROBOT_PROMPT} và nhặt hết các ngôi sao (đi qua ô có sao là nhặt được). Tối đa 4 lệnh.`,
    grid: ['S..*.', '.###.', '.*..G'],
    maxCommands: 4,
    answer: [
      { dir: 'R', steps: 4 },
      { dir: 'D', steps: 2 },
      { dir: 'L', steps: 3 },
      { dir: 'R', steps: 3 },
    ],
    hints: [
      'Robot được đi qua cờ đích rồi quay lại; chỉ cần dừng ở cờ.',
      'Nhặt ngôi sao ở hàng trên trước, xuống tới cờ, rồi đi lấy ngôi sao còn lại.',
    ],
    solution:
      'Sang phải 4, xuống 2, sang trái 3, sang phải 3. Đi qua đích rồi quay lại vẫn hợp lệ: đọc kỹ luật để thấy lời giải ngắn hơn.',
  },
  {
    id: 'robot-me-cung-nho',
    title: 'Mê cung nhỏ',
    engine: 'robot',
    level: 'thu-thach',
    audience: ['thcs'],
    skill: 'thiet-ke-thuat-toan',
    prompt: `${ROBOT_PROMPT}. Tối đa 4 lệnh.`,
    grid: ['S..#..', '##.#.#', '......', '.####.', 'G.....'],
    maxCommands: 4,
    answer: [
      { dir: 'R', steps: 2 },
      { dir: 'D', steps: 2 },
      { dir: 'L', steps: 2 },
      { dir: 'D', steps: 2 },
    ],
    hints: [
      'Có hai đường tới cờ: một đường vòng bên phải và một đường bên trái.',
      'Đường bên trái ngắn hơn: sau khi xuống hàng giữa, quay sang trái.',
    ],
    solution: 'Sang phải 2, xuống 2, sang trái 2, xuống 2. Đường vòng bên phải cần 5 lệnh.',
  },
  {
    id: 'robot-ba-ngoi-sao',
    title: 'Ba ngôi sao',
    engine: 'robot',
    level: 'chuyen-sau',
    audience: ['thcs', 'thpt'],
    skill: 'thiet-ke-thuat-toan',
    prompt: `${ROBOT_PROMPT} và nhặt hết các ngôi sao. Tối đa 4 lệnh.`,
    grid: ['S...*', '.###.', '*...G', '.###.', '*....'],
    maxCommands: 4,
    answer: [
      { dir: 'D', steps: 4 },
      { dir: 'R', steps: 4 },
      { dir: 'U', steps: 4 },
      { dir: 'D', steps: 2 },
    ],
    hints: [
      'Hai ngôi sao bên trái nằm trên cùng một cột với robot.',
      'Đi một vòng quanh bản đồ: cột trái, hàng dưới, cột phải lên tận ngôi sao cuối cùng, rồi quay xuống cờ.',
    ],
    solution: 'Xuống 4, sang phải 4, lên 4, xuống 2. Đi theo vòng ngoài thì mỗi cạnh là một lệnh.',
  },
  // ------------------------------------------------------------------ Thẻ nhị phân
  {
    id: 'nhi-phan-so-5',
    title: 'Ba tấm thẻ',
    engine: 'binary',
    level: 'khoi-dong',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'truu-tuong-hoa',
    prompt:
      'Mỗi tấm thẻ có một số chấm. Lật mặt có chấm của một số thẻ sao cho tổng số chấm bằng 5.',
    cards: [4, 2, 1],
    target: 5,
    hints: ['Thử thẻ lớn nhất trước: 4 có vượt quá 5 không?', '5 = 4 + 1.'],
    solution:
      'Lật thẻ 4 và thẻ 1. Viết thẻ lật là 1, thẻ úp là 0: 5 viết trong hệ nhị phân là 101.',
  },
  {
    id: 'nhi-phan-so-13',
    title: 'Bốn tấm thẻ',
    engine: 'binary',
    level: 'vung-vang',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'truu-tuong-hoa',
    prompt: 'Lật các thẻ để tổng số chấm bằng 13.',
    cards: [8, 4, 2, 1],
    target: 13,
    hints: ['Bắt đầu từ thẻ 8: còn lại 13 − 8 = 5.', '5 ghép từ những thẻ nào?'],
    solution: '13 = 8 + 4 + 1, nhị phân là 1101.',
  },
  {
    id: 'nhi-phan-so-22',
    title: 'Năm tấm thẻ',
    engine: 'binary',
    level: 'thu-thach',
    audience: ['thcs'],
    skill: 'truu-tuong-hoa',
    prompt: 'Lật các thẻ để tổng số chấm bằng 22.',
    cards: [16, 8, 4, 2, 1],
    target: 22,
    hints: [
      'Mỗi thẻ lớn hơn tổng tất cả các thẻ nhỏ hơn nó. Vì vậy thẻ lớn nhất nhỏ hơn 22 chắc chắn phải lật.',
      '22 − 16 = 6.',
    ],
    solution: '22 = 16 + 4 + 2, nhị phân là 10110.',
  },
  {
    id: 'nhi-phan-so-19',
    title: 'Số 19',
    engine: 'binary',
    level: 'thu-thach',
    audience: ['thcs'],
    skill: 'truu-tuong-hoa',
    prompt: 'Lật các thẻ để tổng số chấm bằng 19.',
    cards: [16, 8, 4, 2, 1],
    target: 19,
    hints: ['Lật thẻ 16 trước.', '19 − 16 = 3 = 2 + 1.'],
    solution:
      '19 = 16 + 2 + 1, nhị phân là 10011. Cách lấy thẻ lớn nhất còn vừa luôn đúng với thẻ nhị phân.',
  },
  // ------------------------------------------------------------------ Sắp xếp các bước
  {
    id: 'thu-tu-rua-tay',
    title: 'Các bước rửa tay',
    engine: 'order',
    level: 'khoi-dong',
    audience: ['tieu-hoc'],
    skill: 'phan-ra',
    prompt:
      'Sắp xếp các bước rửa tay theo đúng thứ tự. Dùng nút lên, xuống để di chuyển từng bước.',
    steps: [
      'Làm ướt hai bàn tay bằng nước sạch',
      'Xoa xà phòng khắp hai bàn tay',
      'Chà kỹ các kẽ ngón tay và móng tay',
      'Rửa sạch xà phòng dưới vòi nước',
      'Lau khô tay bằng khăn sạch',
    ],
    hints: ['Bước cuối cùng là làm khô tay.', 'Phải có xà phòng trên tay rồi mới chà kẽ ngón.'],
    solution:
      'Làm ướt, xoa xà phòng, chà kỹ, rửa sạch, lau khô. Một thuật toán là dãy các bước theo đúng thứ tự.',
  },
  {
    id: 'thu-tu-doi-cho',
    title: 'Đổi chỗ hai cốc nước',
    engine: 'order',
    level: 'vung-vang',
    audience: ['thcs'],
    skill: 'thiet-ke-thuat-toan',
    prompt:
      'Muốn đổi giá trị của hai biến a và b, cần một biến tạm. Sắp xếp ba lệnh gán theo đúng thứ tự.',
    steps: ['tam ← a', 'a ← b', 'b ← tam'],
    mono: true,
    hints: [
      'Giống đổi nước giữa hai cốc: phải đổ cốc a sang cốc trống trước.',
      'Nếu gán a ← b trước tiên, giá trị cũ của a sẽ mất.',
    ],
    solution: 'tam ← a, rồi a ← b, rồi b ← tam. Trong Python có thể viết gọn a, b = b, a.',
  },
  {
    id: 'thu-tu-tim-max',
    title: 'Tìm số lớn nhất',
    engine: 'order',
    level: 'vung-vang',
    audience: ['thcs'],
    skill: 'thiet-ke-thuat-toan',
    prompt: 'Sắp xếp các dòng giả mã để được thuật toán tìm số lớn nhất của dãy A gồm n số.',
    steps: [
      'NHẬP n và dãy A',
      'lon_nhat ← A[0]',
      'VỚI i TỪ 1 ĐẾN n - 1 LÀM',
      '    NẾU A[i] > lon_nhat THÌ lon_nhat ← A[i]',
      'HẾT VỚI',
      'XUẤT lon_nhat',
    ],
    mono: true,
    hints: ['Khởi tạo lon_nhat trước khi vào vòng lặp.', 'Dòng thụt lề nằm giữa VỚI và HẾT VỚI.'],
    solution:
      'Nhập, khởi tạo bằng phần tử đầu, duyệt các phần tử còn lại và cập nhật, in kết quả. Khởi tạo bằng A[0] chứ không phải 0 để đúng cả khi dãy toàn số âm.',
  },
  {
    id: 'thu-tu-nhi-phan',
    title: 'Tìm kiếm nhị phân',
    engine: 'order',
    level: 'thu-thach',
    audience: ['thcs', 'thpt'],
    skill: 'thiet-ke-thuat-toan',
    prompt: 'Sắp xếp các dòng giả mã tìm vị trí của x trong dãy A tăng dần gồm n số (chỉ số từ 0).',
    steps: [
      'lo ← 0; hi ← n - 1',
      'TRONG KHI lo ≤ hi LÀM',
      '    giua ← (lo + hi) div 2',
      '    NẾU A[giua] = x THÌ TRẢ VỀ giua',
      '    NẾU A[giua] < x THÌ lo ← giua + 1 NGƯỢC LẠI hi ← giua - 1',
      'HẾT KHI',
      'TRẢ VỀ -1',
    ],
    mono: true,
    hints: [
      'Phải tính giua trước khi so sánh A[giua].',
      'Trả về −1 chỉ khi vòng lặp kết thúc mà không tìm thấy.',
    ],
    solution:
      'Khởi tạo hai đầu, lặp khi đoạn còn khác rỗng, lấy phần tử giữa, so sánh, thu hẹp nửa đoạn. Xem mô phỏng tìm kiếm nhị phân để thấy từng bước.',
  },
  {
    id: 'thu-tu-doc-ghi-file',
    title: 'Chương trình đọc ghi file',
    engine: 'order',
    level: 'chuyen-sau',
    audience: ['thcs', 'thpt'],
    skill: 'phan-ra',
    prompt:
      'Sắp xếp các dòng Python để đọc n từ file BAI.INP và ghi tổng 1 + 2 + … + n ra file BAI.OUT.',
    steps: [
      'with open("BAI.INP") as f:',
      '    n = int(f.read())',
      'ket_qua = n * (n + 1) // 2',
      'with open("BAI.OUT", "w") as f:',
      '    f.write(str(ket_qua))',
    ],
    mono: true,
    hints: ['Phải đọc n trước khi tính.', 'Dòng thụt lề đứng ngay sau dòng with của nó.'],
    solution:
      'Đọc, tính, ghi. Dùng // để kết quả là số nguyên; dùng / sẽ in ra số thực như 15.0 và bị chấm sai.',
  },
  // ------------------------------------------------------------------ Chọn đáp án
  {
    id: 'day-so-nhan-doi',
    title: 'Dãy số nhân đôi',
    engine: 'choice',
    level: 'khoi-dong',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'nhan-dang-mau',
    prompt: 'Số nào điền vào dấu hỏi: 2, 4, 8, 16, ?',
    options: ['18', '24', '32', '20'],
    answer: 2,
    hints: ['So sánh mỗi số với số đứng trước nó.', 'Mỗi số gấp đôi số trước.'],
    solution: '16 × 2 = 32. Đây là các lũy thừa của 2, rất hay gặp trong tin học.',
  },
  {
    id: 'day-so-cong-don',
    title: 'Dãy số kì lạ',
    engine: 'choice',
    level: 'vung-vang',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'nhan-dang-mau',
    prompt: 'Số nào điền vào dấu hỏi: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '16', '12'],
    answer: 1,
    hints: [
      'Không phải cộng thêm một số cố định.',
      'Mỗi số bằng tổng của hai số đứng ngay trước nó.',
    ],
    solution: '5 + 8 = 13. Đây là dãy Fibonacci.',
  },
  {
    id: 'day-hinh-lap-lai',
    title: 'Hình tiếp theo',
    engine: 'choice',
    level: 'khoi-dong',
    audience: ['tieu-hoc'],
    skill: 'nhan-dang-mau',
    prompt:
      'Dãy hình: tam giác, vuông, tròn, tam giác, vuông, tròn, tam giác, vuông, ? Hình nào điền vào dấu hỏi?',
    options: ['Tam giác', 'Vuông', 'Tròn'],
    answer: 2,
    hints: ['Tìm nhóm hình lặp đi lặp lại.', 'Nhóm gồm 3 hình: tam giác, vuông, tròn.'],
    solution: 'Nhóm "tam giác, vuông, tròn" lặp lại, nên sau vuông là tròn.',
  },
  {
    id: 'doc-gia-ma-tong',
    title: 'Đọc giả mã: tổng',
    engine: 'choice',
    level: 'khoi-dong',
    audience: ['thcs'],
    skill: 'truu-tuong-hoa',
    prompt: 'Chương trình sau in ra số nào?',
    code: 's ← 0\nVỚI i TỪ 1 ĐẾN 4 LÀM\n    s ← s + i\nHẾT VỚI\nXUẤT s',
    options: ['4', '10', '15', '24'],
    answer: 1,
    hints: ['Lập bảng giá trị của i và s sau mỗi lần lặp.', 'VỚI i TỪ 1 ĐẾN 4 gồm cả 1 và 4.'],
    solution: 's = 1 + 2 + 3 + 4 = 10.',
  },
  {
    id: 'doc-gia-ma-chia-doi',
    title: 'Đọc giả mã: chia đôi',
    engine: 'choice',
    level: 'vung-vang',
    audience: ['thcs', 'thpt'],
    skill: 'truu-tuong-hoa',
    prompt: 'Chương trình sau in ra số nào?',
    code: 'x ← 20; dem ← 0\nTRONG KHI x > 1 LÀM\n    x ← x div 2\n    dem ← dem + 1\nHẾT KHI\nXUẤT dem',
    options: ['3', '4', '5', '10'],
    answer: 1,
    hints: ['div là chia lấy phần nguyên.', 'x lần lượt là 20, 10, 5, 2, 1.'],
    solution:
      'x đi qua 10, 5, 2, 1: 4 lần chia. Số lần chia đôi tới 1 xấp xỉ log₂ x, lý do tìm kiếm nhị phân rất nhanh.',
  },
  {
    id: 'can-dong-xu',
    title: 'Đồng xu giả',
    engine: 'choice',
    level: 'thu-thach',
    audience: ['thcs', 'thpt'],
    skill: 'thiet-ke-thuat-toan',
    prompt:
      'Có 9 đồng xu giống hệt nhau, trong đó 1 đồng giả nhẹ hơn. Dùng cân đĩa (so sánh hai đĩa), ít nhất bao nhiêu lần cân để chắc chắn tìm ra đồng giả?',
    options: ['1 lần', '2 lần', '3 lần', '4 lần'],
    answer: 1,
    hints: [
      'Mỗi lần cân có ba kết quả: lệch trái, lệch phải, cân bằng.',
      'Chia 9 đồng thành ba nhóm 3 đồng.',
    ],
    solution:
      'Cân nhóm 1 với nhóm 2: biết đồng giả ở nhóm nào trong ba nhóm. Lần hai, cân 1 đồng với 1 đồng trong nhóm đó. Chia ba thay vì chia đôi vì cân có ba kết quả.',
  },
  {
    id: 'suy-luan-mon-hoc',
    title: 'Ai thích Tin học?',
    engine: 'choice',
    level: 'khoi-dong',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'truu-tuong-hoa',
    prompt:
      'An, Bình, Chi mỗi bạn thích đúng một môn khác nhau trong Toán, Tin, Văn. An không thích Toán. Bình thích Văn. Ai thích Tin?',
    options: ['An', 'Bình', 'Chi'],
    answer: 0,
    hints: ['Bình đã có môn Văn, còn Toán và Tin cho An và Chi.', 'An không thích Toán.'],
    solution:
      'An thích Tin, Chi thích Toán. Loại trừ dần các khả năng là cách suy luận dùng nhiều trong lập trình.',
  },
  {
    id: 'ban-do-tham-lam',
    title: 'Chọn đường ngắn ở mỗi ngã rẽ',
    engine: 'choice',
    level: 'thu-thach',
    audience: ['thcs', 'thpt'],
    skill: 'thiet-ke-thuat-toan',
    prompt:
      'Từ A có đường tới B dài 2 km và tới C dài 4 km. Từ B tới D dài 5 km, từ C tới D dài 1 km. Nam luôn chọn đường ngắn nhất ở mỗi ngã rẽ để đi từ A tới D. Đường của Nam dài bao nhiêu, đường ngắn nhất thật sự dài bao nhiêu?',
    options: ['7 km và 7 km', '7 km và 5 km', '5 km và 5 km', '6 km và 5 km'],
    answer: 1,
    hints: ['Ở A, Nam chọn đường 2 km tới B.', 'So sánh A, B, D với A, C, D.'],
    solution:
      'Nam đi A, B, D dài 7 km; đường A, C, D chỉ 5 km. Chọn tốt nhất trước mắt (tham lam) không luôn cho kết quả tốt nhất: cần thuật toán như Dijkstra.',
  },
  {
    id: 'nhi-phan-sang-thap-phan',
    title: 'Số nhị phân',
    engine: 'choice',
    level: 'vung-vang',
    audience: ['thcs', 'thpt'],
    skill: 'truu-tuong-hoa',
    prompt: 'Số 1011 trong hệ nhị phân bằng bao nhiêu trong hệ thập phân?',
    options: ['11', '13', '1011', '9'],
    answer: 0,
    hints: ['Các chữ số từ phải sang trái ứng với 1, 2, 4, 8.', '1011 = 8 + 0 + 2 + 1.'],
    solution: '8 + 2 + 1 = 11. Xem mô phỏng đổi cơ số để thấy từng bước.',
  },
  {
    id: 'so-do-re-nhanh',
    title: 'Đọc sơ đồ rẽ nhánh',
    engine: 'choice',
    level: 'khoi-dong',
    audience: ['tieu-hoc', 'thcs'],
    skill: 'truu-tuong-hoa',
    prompt:
      'Nếu n chia hết cho 3 thì in A; ngược lại, nếu n chia hết cho 2 thì in B; ngược lại in C. Với n = 10, chương trình in gì?',
    options: ['A', 'B', 'C', 'B rồi C'],
    answer: 1,
    hints: ['10 có chia hết cho 3 không?', 'Chỉ một nhánh được chạy.'],
    solution: '10 không chia hết cho 3 nhưng chia hết cho 2, nên in B và dừng.',
  },
  {
    id: 'gap-giay',
    title: 'Gấp tờ giấy',
    engine: 'choice',
    level: 'chuyen-sau',
    audience: ['thcs', 'thpt'],
    skill: 'nhan-dang-mau',
    prompt:
      'Tờ giấy dày 0,1 mm. Mỗi lần gấp đôi, độ dày gấp đôi. Sau 10 lần gấp, tờ giấy dày khoảng bao nhiêu?',
    options: ['1 mm', '2 mm', 'Khoảng 10 cm', 'Khoảng 1 m'],
    answer: 2,
    hints: ['Sau 10 lần, độ dày nhân với 2¹⁰.', '2¹⁰ = 1024.'],
    solution:
      '0,1 × 1024 = 102,4 mm, khoảng 10 cm. Tăng theo lũy thừa rất nhanh: đó là lý do thuật toán O(2ⁿ) chỉ chạy được với n nhỏ.',
  },
  {
    id: 'doan-so-1-100',
    title: 'Đoán số từ 1 đến 100',
    engine: 'choice',
    level: 'chuyen-sau',
    audience: ['thcs', 'thpt'],
    skill: 'thiet-ke-thuat-toan',
    prompt:
      'Bạn nghĩ một số từ 1 đến 100. Mỗi lần mình đoán, bạn trả lời "lớn hơn", "nhỏ hơn" hoặc "đúng". Với cách đoán tốt nhất, cần nhiều nhất bao nhiêu lần đoán để chắc chắn đoán đúng?',
    options: ['5 lần', '7 lần', '10 lần', '50 lần'],
    answer: 1,
    hints: [
      'Mỗi lần đoán số ở giữa khoảng còn lại.',
      'Mỗi lần khoảng còn lại giảm một nửa: 100, 50, 25, 12, 6, 3, 1.',
    ],
    solution: '7 lần, vì 2⁷ = 128 ≥ 100. Đây là tìm kiếm nhị phân.',
  },
];

export const getPuzzle = (id: string) => PUZZLES.find((p) => p.id === id);
