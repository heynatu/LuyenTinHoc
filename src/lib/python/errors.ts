/**
 * Đọc lỗi Python và giải thích bằng tiếng Việt (mục 2.5.7 của SUPER_PROMPT).
 * Mỗi lỗi: tên dễ hiểu, giải thích ngắn, gợi ý sửa, bẫy liên quan trong thư viện bẫy.
 */
import type { PyError } from './protocol';

/** Tách loại lỗi, thông điệp và dòng lỗi trong main.py từ traceback của Python. */
export function parsePythonError(type: string, traceback: string): PyError {
  const lines = traceback.trim().split('\n');
  let line: number | null = null;
  for (const match of traceback.matchAll(/File "main\.py", line (\d+)/g)) line = Number(match[1]);
  const last = lines.at(-1) ?? type;
  const message = last.startsWith(type) ? last.slice(type.length).replace(/^:\s*/, '') : last;
  return { type, message, line };
}

export type ErrorHelp = { title: string; explain: string; hint: string; trap?: string };

const HELP: Record<string, ErrorHelp> = {
  SyntaxError: {
    title: 'Lỗi cú pháp',
    explain: 'Python không đọc được câu lệnh ở dòng này.',
    hint: 'Kiểm tra dấu hai chấm cuối if, for, while, def; ngoặc mở và đóng; dấu nháy của xâu.',
  },
  IndentationError: {
    title: 'Thụt lề không đúng',
    explain: 'Các lệnh trong cùng một khối phải thụt lề như nhau.',
    hint: 'Dùng 4 dấu cách cho mỗi mức thụt lề, không trộn phím Tab với dấu cách.',
  },
  TabError: {
    title: 'Trộn Tab và dấu cách',
    explain: 'Một khối lệnh vừa thụt bằng Tab vừa thụt bằng dấu cách.',
    hint: 'Thụt lề toàn bộ bằng dấu cách (4 dấu cách mỗi mức).',
  },
  NameError: {
    title: 'Dùng tên chưa có',
    explain: 'Chương trình dùng một biến hoặc hàm chưa được tạo.',
    hint: 'Kiểm tra chính tả (Python phân biệt chữ hoa, chữ thường) và gán giá trị cho biến trước khi dùng.',
  },
  UnboundLocalError: {
    title: 'Biến cục bộ chưa có giá trị',
    explain:
      'Trong hàm, biến được dùng trước khi gán, hoặc trùng tên với biến toàn cục bị gán lại.',
    hint: 'Gán giá trị đầu cho biến trong hàm, hoặc truyền giá trị qua tham số thay vì dùng biến toàn cục.',
  },
  TypeError: {
    title: 'Sai kiểu dữ liệu',
    explain: 'Phép toán hoặc hàm nhận dữ liệu không đúng kiểu.',
    hint: 'Thường gặp: cộng xâu với số, quên int() khi đọc dữ liệu vào, gọi hàm thiếu tham số.',
  },
  ValueError: {
    title: 'Giá trị không hợp lệ',
    explain: 'Hàm nhận đúng kiểu nhưng giá trị không dùng được, ví dụ int() gặp xâu không phải số.',
    hint: 'Kiểm tra ô Dữ liệu vào: thiếu dòng, thừa dấu cách, hoặc nhiều số trên một dòng thì phải dùng split().',
    trap: 'doc-theo-token',
  },
  IndexError: {
    title: 'Chỉ số vượt ngoài danh sách',
    explain: 'Danh sách n phần tử chỉ có chỉ số từ 0 đến n - 1.',
    hint: 'Kiểm tra cận của range và điều kiện dừng vòng lặp; đề đánh số từ 1 thì phải trừ 1.',
    trap: 'lech-chi-so',
  },
  KeyError: {
    title: 'Khóa không có trong từ điển',
    explain: 'Chương trình đọc một khóa chưa có trong dict.',
    hint: 'Dùng d.get(k, 0) hoặc collections.defaultdict, hoặc kiểm tra k in d trước.',
  },
  ZeroDivisionError: {
    title: 'Chia cho 0',
    explain: 'Phép chia hoặc chia lấy dư có số chia bằng 0.',
    hint: 'Kiểm tra trường hợp biên: dãy rỗng, n bằng 0, mẫu số bằng 0.',
    trap: 'truong-hop-bien',
  },
  RecursionError: {
    title: 'Đệ quy quá sâu',
    explain: 'Hàm gọi lại chính nó quá nhiều lần, thường do thiếu điều kiện dừng hoặc dữ liệu lớn.',
    hint: 'Kiểm tra điều kiện dừng; với dữ liệu lớn, chuyển sang vòng lặp hoặc ngăn xếp tự quản.',
    trap: 'de-quy-qua-sau',
  },
  MemoryError: {
    title: 'Hết bộ nhớ',
    explain: 'Chương trình tạo dữ liệu quá lớn.',
    hint: 'Chỉ lưu những gì cần; tránh tạo danh sách hàng chục triệu phần tử.',
    trap: 'tran-bo-nho',
  },
  FileNotFoundError: {
    title: 'Không tìm thấy file',
    explain: 'Chương trình mở một file không có trong thư mục làm việc.',
    hint: 'Tên file phải đúng như đề, kể cả chữ hoa. Bật chế độ Đọc ghi file và nhập đúng tên file.',
    trap: 'sai-ten-file',
  },
  EOFError: {
    title: 'Hết dữ liệu vào',
    explain: 'Chương trình gọi input() nhiều hơn số dòng có trong dữ liệu vào.',
    hint: 'Đề có nhiều số trên một dòng thì đọc một dòng rồi split(), hoặc đọc toàn bộ một lần.',
    trap: 'doc-theo-token',
  },
  AttributeError: {
    title: 'Không có thuộc tính hoặc phương thức này',
    explain: 'Đối tượng không có thuộc tính hay phương thức được gọi.',
    hint: 'Kiểm tra kiểu của biến (list, str, int) và chính tả tên phương thức.',
  },
  ModuleNotFoundError: {
    title: 'Không có thư viện này',
    explain: 'Trên trình duyệt chỉ dùng được thư viện chuẩn của Python, giống phòng thi.',
    hint: 'Dùng thư viện chuẩn: sys, math, collections, heapq, bisect, itertools, functools.',
  },
  OverflowError: {
    title: 'Số thực quá lớn',
    explain: 'Phép tính với số thực (float) vượt giới hạn.',
    hint: 'Giữ phép tính ở số nguyên (dùng // và int) khi có thể.',
    trap: 'so-thuc-lon',
  },
  AssertionError: {
    title: 'Điều kiện assert sai',
    explain: 'Một câu lệnh assert trong chương trình không đúng.',
    hint: 'Đọc lại điều kiện trong assert ở dòng báo lỗi.',
  },
};

export function explainError(error: PyError): ErrorHelp {
  return (
    HELP[error.type] ?? {
      title: error.type,
      explain: 'Chương trình dừng vì một lỗi khi chạy.',
      hint: 'Đọc thông báo lỗi bên dưới và kiểm tra dòng được chỉ ra.',
    }
  );
}
