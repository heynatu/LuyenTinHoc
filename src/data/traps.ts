/**
 * Thư viện bẫy (mục 4.9). Mỗi bẫy: dấu hiệu, mức thiệt hại, giải thích, code sai và code đúng.
 * Code dùng String.raw để giữ nguyên ký tự như "\n" trong Python. Test tests/unit/traps.test.ts
 * biên dịch mọi đoạn code bằng Python để chắc chắn không có lỗi cú pháp.
 */
const py = String.raw;

export const TRAP_GROUPS = {
  'doc-ghi': 'Đọc ghi dữ liệu và nộp bài',
  'toc-do': 'Tốc độ của Python',
  'cau-truc': 'List, xâu, từ điển',
  'so-hoc': 'Số học và số thực',
  bien: 'Trường hợp biên và đọc đề',
  'phien-ban': 'Phiên bản Python trên máy chấm',
  'chien-thuat': 'Chiến thuật phòng thi',
} as const;

export type TrapGroup = keyof typeof TRAP_GROUPS;

export type Trap = {
  slug: string;
  title: string;
  group: TrapGroup;
  /** mat-trang: có thể mất toàn bộ điểm bài; mat-mot-phan: mất một số test. */
  severity: 'mat-trang' | 'mat-mot-phan';
  signs: string;
  explain: string;
  wrong?: string;
  right?: string;
  /** Dữ liệu vào để thử code ở phòng lập trình. */
  stdin?: string;
};

export const TRAPS: Trap[] = [
  // ------------------------------------------------------------ Đọc ghi
  {
    slug: 'sai-ten-file',
    title: 'Sai tên file dữ liệu vào hoặc kết quả',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs:
      'Chạy trên máy mình đúng nhưng bài được 0 điểm; máy chấm báo không tìm thấy file kết quả.',
    explain:
      'Máy chấm đọc đúng tên file trong đề, ví dụ BAI1.INP và BAI1.OUT. Gõ sai một chữ, sai đuôi, hoặc sai chữ hoa chữ thường (máy chấm chạy Linux phân biệt hoa thường) là mất cả bài. Hãy chép tên file từ đề vào hằng số ở đầu chương trình.',
    wrong: py`with open("bai1.inp") as f:
    n = int(f.read())
with open("BAI1.OUT.txt", "w") as f:
    f.write(str(n * 2))`,
    right: py`TEN_VAO, TEN_RA = "BAI1.INP", "BAI1.OUT"  # chép đúng từ đề
with open(TEN_VAO) as f:
    n = int(f.read())
with open(TEN_RA, "w") as f:
    f.write(str(n * 2) + "\n")`,
  },
  {
    slug: 'doc-ban-phim-khi-de-yeu-cau-file',
    title: 'Đề yêu cầu đọc file nhưng chương trình đọc bàn phím',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'Chương trình đứng yên chờ nhập và bị dừng vì quá thời gian ở mọi test.',
    explain:
      'Khi đề ghi "Dữ liệu vào từ file BAI1.INP", máy chấm không gõ gì vào bàn phím. input() sẽ chờ mãi. Đọc đề kỹ phần dữ liệu vào và kết quả; nếu đề dùng file thì mở file.',
    wrong: py`n = int(input())
print(n * n)`,
    right: py`with open("BAI1.INP") as f:
    n = int(f.read())
with open("BAI1.OUT", "w") as f:
    f.write(str(n * n) + "\n")`,
  },
  {
    slug: 'in-loi-nhac',
    title: 'In thêm lời nhắc như "Nhap n:"',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'Kết quả đúng nhưng mọi test đều bị chấm sai.',
    explain:
      'Máy chấm so sánh output với đáp án. Mọi chữ in thêm như "Nhap n:" hay "Ket qua la" đều làm output khác đáp án. Không truyền chuỗi vào input() và chỉ in đúng những gì đề yêu cầu.',
    wrong: py`n = int(input("Nhap n: "))
print("Ket qua la", n * 2)`,
    right: py`n = int(input())
print(n * 2)`,
    stdin: '21\n',
  },
  {
    slug: 'doc-theo-token',
    title: 'Dữ liệu nằm trên nhiều dòng hoặc nhiều số trên một dòng',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'ValueError: invalid literal for int() hoặc EOFError ở một số test.',
    explain:
      'Đề ghi "dòng thứ hai gồm n số" nhưng có test xuống dòng giữa chừng, hoặc ngược lại. Cách an toàn nhất: đọc toàn bộ dữ liệu một lần rồi tách theo khoảng trắng, sau đó lấy lần lượt từng số.',
    wrong: py`n = int(input())
a = [int(input()) for _ in range(n)]  # sai nếu n số nằm trên một dòng
print(sum(a))`,
    right: py`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
print(sum(a))`,
    stdin: '4\n1 2\n3 4\n',
  },
  {
    slug: 'ky-tu-xuong-dong-windows',
    title: 'Ký tự \\r ở cuối dòng khi xử lý xâu',
    group: 'doc-ghi',
    severity: 'mat-mot-phan',
    signs: 'So sánh xâu luôn sai, độ dài xâu lớn hơn 1 so với mắt thấy.',
    explain:
      'File tạo trên Windows kết thúc dòng bằng \\r\\n. Đọc bằng f.readline() hoặc tách bằng split("\\n") có thể giữ lại \\r. Dùng strip() hoặc split() không đối số để bỏ mọi khoảng trắng thừa.',
    wrong: py`lines = open("BAI1.INP").read().split("\n")
ten = lines[0]          # có thể là "Pleiku\r"
print(ten == "Pleiku")`,
    right: py`lines = open("BAI1.INP").read().splitlines()
ten = lines[0].strip()
print(ten == "Pleiku")`,
  },
  {
    slug: 'quen-dong-file',
    title: 'File kết quả rỗng vì chương trình dừng giữa chừng',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'File .OUT có nhưng rỗng ở các test có lỗi, hoặc ghi thiếu dòng cuối.',
    explain:
      'Dữ liệu ghi vào file được giữ trong bộ đệm và chỉ thật sự ghi khi đóng file. Nếu chương trình bị lỗi trước khi đóng, phần còn trong bộ đệm bị mất. Dùng with open(...) để file luôn được đóng, và gom kết quả rồi ghi một lần.',
    wrong: py`f = open("BAI1.OUT", "w")
for i in range(3):
    f.write(str(i) + "\n")
x = 1 // 0  # lỗi ở đây: phần đã ghi có thể chưa vào file`,
    right: py`ket_qua = [str(i) for i in range(3)]
with open("BAI1.OUT", "w") as f:
    f.write("\n".join(ket_qua) + "\n")`,
  },
  {
    slug: 'in-debug',
    title: 'Quên xóa lệnh in để gỡ lỗi',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'Trên máy mình thấy thêm vài dòng kiểm tra, nộp bài được 0 điểm.',
    explain:
      'Các dòng print dùng để kiểm tra trung gian vẫn nằm trong output khi chấm. Ghi thông tin gỡ lỗi ra sys.stderr (máy chấm không đọc), hoặc đặt sau một biến DEBUG = False.',
    wrong: py`a = [3, 1, 2]
print("da doc xong", a)
print(max(a))`,
    right: py`import sys

DEBUG = False
a = [3, 1, 2]
if DEBUG:
    print("da doc xong", a, file=sys.stderr)
print(max(a))`,
  },
  {
    slug: 'sai-thu-muc-nop-bai',
    title: 'Lưu bài sai thư mục hoặc sai đuôi file',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'Sau khi thi, bài không có trong danh sách chấm.',
    explain:
      'Phòng thi thường yêu cầu lưu bài vào thư mục mang số báo danh, tên chương trình đúng như đề (ví dụ BAI1.PY). Lưu thành bai1.py.txt, untitled.py hay để ở Desktop là máy chấm không tìm thấy. Đầu giờ thi tạo đủ file đúng tên; cuối giờ kiểm tra lại đuôi file.',
  },
  {
    slug: 'sai-dinh-dang-output',
    title: 'In cả danh sách thay vì các số cách nhau bởi dấu cách',
    group: 'doc-ghi',
    severity: 'mat-trang',
    signs: 'Output có dấu ngoặc vuông và dấu phẩy: [1, 2, 3].',
    explain:
      'print(a) với a là list in ra cả ngoặc và dấu phẩy. Đề thường yêu cầu các số cách nhau bởi một dấu cách: dùng print(*a) hoặc " ".join(map(str, a)).',
    wrong: py`a = [5, 2, 8]
print(sorted(a))`,
    right: py`a = [5, 2, 8]
print(*sorted(a))`,
  },
  // ------------------------------------------------------------ Tốc độ
  {
    slug: 'doc-du-lieu-cham',
    title: 'input() chậm khi dữ liệu có hàng trăm nghìn dòng',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Thuật toán đúng độ phức tạp nhưng vẫn quá thời gian ở các test lớn.',
    explain:
      'Gọi input() 10⁵ đến 10⁶ lần tốn đáng kể thời gian. Đọc toàn bộ dữ liệu một lần bằng sys.stdin.buffer.read().split() nhanh hơn nhiều lần.',
    wrong: py`n = int(input())
tong = 0
for _ in range(n):
    tong += int(input())
print(tong)`,
    right: py`import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
print(sum(map(int, data[1:1 + n])))`,
    stdin: '3\n4\n5\n6\n',
  },
  {
    slug: 'print-trong-vong-lap',
    title: 'Gọi print trong vòng lặp lớn',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Bài có nhiều truy vấn (10⁵ dòng kết quả) bị quá thời gian.',
    explain:
      'Mỗi lần print có chi phí riêng. Gom kết quả vào một list rồi in một lần bằng "\\n".join(...).',
    wrong: py`q = 5
for i in range(q):
    print(i * i)`,
    right: py`import sys

q = 5
out = [str(i * i) for i in range(q)]
sys.stdout.write("\n".join(out) + "\n")`,
  },
  {
    slug: 'cong-chuoi-trong-vong-lap',
    title: 'Cộng xâu trong vòng lặp',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Xây xâu kết quả dài 10⁵ ký tự rất chậm.',
    explain:
      'Xâu trong Python không sửa được; mỗi phép s = s + c có thể tạo một xâu mới. Gom các phần vào list rồi "".join(list) ở cuối.',
    wrong: py`s = ""
for i in range(5):
    s = s + str(i)
print(s)`,
    right: py`parts = []
for i in range(5):
    parts.append(str(i))
print("".join(parts))`,
  },
  {
    slug: 'pop-dau-danh-sach',
    title: 'list.pop(0) và insert(0, x) là O(n)',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'BFS hoặc mô phỏng hàng đợi chạy chậm khi dữ liệu lớn.',
    explain:
      'Lấy phần tử đầu list phải dời mọi phần tử còn lại. Dùng collections.deque: popleft() và appendleft() đều O(1).',
    wrong: py`q = [1]
while q:
    u = q.pop(0)
    if u < 5:
        q.append(u + 1)
print(u)`,
    right: py`from collections import deque

q = deque([1])
while q:
    u = q.popleft()
    if u < 5:
        q.append(u + 1)
print(u)`,
  },
  {
    slug: 'in-trong-list',
    title: 'Kiểm tra x in list là O(n)',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Đếm số phần tử đã gặp bằng list rất chậm khi n lớn.',
    explain:
      'x in danh_sach phải duyệt cả list. Dùng set hoặc dict: kiểm tra x in tap_hop trung bình O(1).',
    wrong: py`a = [3, 1, 3, 2, 1]
da_gap = []
for x in a:
    if x not in da_gap:
        da_gap.append(x)
print(len(da_gap))`,
    right: py`a = [3, 1, 3, 2, 1]
print(len(set(a)))`,
  },
  {
    slug: 'de-quy-qua-sau',
    title: 'Đệ quy quá sâu gây RecursionError',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs:
      'RecursionError: maximum recursion depth exceeded ở test lớn (đồ thị dạng đường thẳng, n lớn).',
    explain:
      'Python mặc định chỉ cho khoảng 1000 tầng đệ quy. Tăng giới hạn bằng sys.setrecursionlimit có thể làm chương trình tràn ngăn xếp và dừng đột ngột. Cách chắc chắn: chuyển sang vòng lặp với ngăn xếp tự quản.',
    wrong: py`def tong(n):
    return 0 if n == 0 else n + tong(n - 1)

print(tong(100000))`,
    right: py`def tong(n):
    s = 0
    while n > 0:
        s += n
        n -= 1
    return s

print(tong(100000))`,
  },
  {
    slug: 'code-toan-cuc-cham',
    title: 'Vòng lặp ở phạm vi toàn cục chậm hơn trong hàm',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Cùng một thuật toán, viết trong hàm main() chạy nhanh hơn hẳn.',
    explain:
      'Trong CPython, truy cập biến cục bộ của hàm nhanh hơn biến toàn cục. Đặt toàn bộ xử lý vào def main() rồi gọi main() thường nhanh hơn 10 đến 30%.',
    wrong: py`tong = 0
for i in range(1000):
    tong += i * i
print(tong)`,
    right: py`def main():
    tong = 0
    for i in range(1000):
        tong += i * i
    print(tong)


main()`,
  },
  {
    slug: 'chon-sai-do-phuc-tap',
    title: 'Dùng thuật toán O(n²) khi n tới 10⁵',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'Đúng các test nhỏ, quá thời gian toàn bộ test lớn.',
    explain:
      'Python làm được khoảng 10⁷ phép tính đơn giản mỗi giây. n = 10⁵ thì O(n²) là 10¹⁰ phép: không thể kịp. Đọc ràng buộc trước khi chọn thuật toán; xem bảng chọn thuật toán theo n trong cẩm nang.',
    wrong: py`a = [5, 3, 8, 1]
dem = 0
for i in range(len(a)):
    for j in range(len(a)):
        if a[j] < a[i]:
            dem += 1
print(dem)`,
    right: py`a = [5, 3, 8, 1]
# Đếm cặp (i, j) có a[j] < a[i]: sắp xếp rồi mỗi phần tử biết số phần tử nhỏ hơn
from bisect import bisect_left
b = sorted(a)
print(sum(bisect_left(b, x) for x in a))`,
  },
  {
    slug: 'sap-xep-lap-lai',
    title: 'Sắp xếp lại dãy trong mỗi truy vấn',
    group: 'toc-do',
    severity: 'mat-mot-phan',
    signs: 'q truy vấn, mỗi lần gọi sorted() hoặc tính lại tổng từ đầu.',
    explain:
      'Nếu dãy không đổi giữa các truy vấn, hãy chuẩn bị một lần (sắp xếp, mảng cộng dồn) rồi trả lời mỗi truy vấn nhanh. q lần O(n log n) có thể thành O(n log n + q log n).',
  },
  // ------------------------------------------------------------ Cấu trúc
  {
    slug: 'mang-hai-chieu-dung-chung',
    title: 'Tạo mảng hai chiều bằng [[0] * m] * n',
    group: 'cau-truc',
    severity: 'mat-trang',
    signs: 'Gán một ô mà cả cột thay đổi theo.',
    explain:
      'Phép nhân list lặp lại cùng một list con n lần: mọi dòng là một đối tượng. Dùng list comprehension để mỗi dòng là một list riêng.',
    wrong: py`f = [[0] * 3] * 2
f[0][0] = 5
print(f)  # [[5, 0, 0], [5, 0, 0]]`,
    right: py`f = [[0] * 3 for _ in range(2)]
f[0][0] = 5
print(f)  # [[5, 0, 0], [0, 0, 0]]`,
  },
  {
    slug: 'gan-khong-sao-chep',
    title: 'b = a không sao chép danh sách',
    group: 'cau-truc',
    severity: 'mat-mot-phan',
    signs: 'Sửa b làm a thay đổi theo.',
    explain:
      'Phép gán chỉ tạo thêm một tên cho cùng một list. Muốn bản sao, dùng b = a[:] hoặc b = a.copy().',
    wrong: py`a = [3, 1, 2]
b = a
b.sort()
print(a)  # a cũng bị sắp xếp`,
    right: py`a = [3, 1, 2]
b = a[:]
b.sort()
print(a, b)`,
  },
  {
    slug: 'tham-so-mac-dinh-la-list',
    title: 'Tham số mặc định là list',
    group: 'cau-truc',
    severity: 'mat-mot-phan',
    signs: 'Gọi hàm lần hai còn dữ liệu của lần một.',
    explain:
      'Giá trị mặc định chỉ được tạo một lần khi định nghĩa hàm. Dùng None rồi tạo list mới bên trong hàm.',
    wrong: py`def them(x, ds=[]):
    ds.append(x)
    return ds

print(them(1), them(2))  # [1, 2] [1, 2]`,
    right: py`def them(x, ds=None):
    if ds is None:
        ds = []
    ds.append(x)
    return ds

print(them(1), them(2))  # [1] [2]`,
  },
  {
    slug: 'sua-list-khi-duyet',
    title: 'Xóa phần tử của list trong lúc đang duyệt nó',
    group: 'cau-truc',
    severity: 'mat-mot-phan',
    signs: 'Một số phần tử bị bỏ sót không được xét.',
    explain:
      'Xóa phần tử làm các phần tử sau dồn lên, vòng for bỏ qua phần tử kế tiếp. Tạo list mới bằng list comprehension.',
    wrong: py`a = [2, 4, 5, 6]
for x in a:
    if x % 2 == 0:
        a.remove(x)
print(a)  # [4, 5]`,
    right: py`a = [2, 4, 5, 6]
a = [x for x in a if x % 2 != 0]
print(a)  # [5]`,
  },
  {
    slug: 'xau-bat-bien',
    title: 'Gán vào một ký tự của xâu',
    group: 'cau-truc',
    severity: 'mat-trang',
    signs: "TypeError: 'str' object does not support item assignment.",
    explain: 'Xâu không sửa được tại chỗ. Chuyển sang list ký tự, sửa, rồi ghép lại.',
    wrong: py`s = "gia lai"
s[0] = "G"
print(s)`,
    right: py`s = "gia lai"
t = list(s)
t[0] = "G"
print("".join(t))`,
  },
  {
    slug: 'sap-xep-xau-so',
    title: 'Sắp xếp số dưới dạng xâu',
    group: 'cau-truc',
    severity: 'mat-trang',
    signs: '"10" đứng trước "9" sau khi sắp xếp.',
    explain:
      'Xâu so sánh theo từng ký tự từ trái sang, nên "10" < "9". Chuyển sang số nguyên trước khi sắp xếp (hoặc dùng key=int).',
    wrong: py`a = "9 10 2".split()
print(sorted(a))  # ['10', '2', '9']`,
    right: py`a = list(map(int, "9 10 2".split()))
print(sorted(a))  # [2, 9, 10]`,
  },
  // ------------------------------------------------------------ Số học
  {
    slug: 'round-ngan-hang',
    title: 'round() làm tròn kiểu ngân hàng',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: 'round(2.5) cho 2, round(3.5) cho 4; kết quả lệch 1 ở các test có phần lẻ đúng 0.5.',
    explain:
      'Python làm tròn số .5 về số chẵn gần nhất. Nếu đề yêu cầu "làm tròn lên khi phần lẻ từ 0.5", dùng Decimal với ROUND_HALF_UP, hoặc với số dương dùng int(x + 0.5) khi chắc không có sai số số thực.',
    wrong: py`print(round(2.5), round(3.5))  # 2 4`,
    right: py`from decimal import Decimal, ROUND_HALF_UP

def lam_tron(x, chu_so=0):
    mau = Decimal(1).scaleb(-chu_so)
    return Decimal(str(x)).quantize(mau, rounding=ROUND_HALF_UP)

print(lam_tron(2.5), lam_tron(3.5), lam_tron(2.675, 2))  # 3 4 2.68`,
  },
  {
    slug: 'chia-nguyen-so-am',
    title: '// và % với số âm',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: 'Kết quả khác lời giải C++ hoặc Pascal khi có số âm.',
    explain:
      'Python làm tròn xuống: -7 // 2 = -4 và -7 % 3 = 2 (dư luôn cùng dấu với số chia). C++ cho -3 và -1. Nếu đề định nghĩa phép chia khác, xử lý dấu riêng.',
    wrong: py`print(-7 // 2, -7 % 3)  # -4 2 trong Python`,
    right: py`a, b = -7, 2
thuong = abs(a) // abs(b) * (1 if a * b >= 0 else -1)  # cắt về 0 như C++
print(thuong)  # -3`,
  },
  {
    slug: 'so-sanh-so-thuc',
    title: 'So sánh số thực bằng ==',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: '0.1 + 0.2 == 0.3 cho False.',
    explain:
      'Số thực lưu xấp xỉ. So sánh bằng sai số nhỏ, hoặc tốt hơn: đưa bài toán về số nguyên (nhân lên 10ᵏ, so sánh tích chéo thay cho thương).',
    wrong: py`print(0.1 + 0.2 == 0.3)`,
    right: py`print(abs((0.1 + 0.2) - 0.3) < 1e-9)
# so sánh a / b với c / d bằng số nguyên: a * d với c * b (b, d > 0)
print(1 * 3 == 1 * 3)`,
  },
  {
    slug: 'sqrt-so-lon',
    title: 'math.sqrt sai với số nguyên lớn',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: 'Kiểm tra số chính phương sai với số cỡ 10¹⁶ trở lên.',
    explain:
      'math.sqrt trả về số thực, mất chính xác với số lớn. Dùng math.isqrt(n) (Python 3.8 trở lên) cho căn bậc hai nguyên chính xác.',
    wrong: py`import math

n = (10**8 + 1) ** 2 - 1
print(int(math.sqrt(n)))  # có thể ra 100000001`,
    right: py`import math

n = (10**8 + 1) ** 2 - 1
print(math.isqrt(n))  # 100000000`,
  },
  {
    slug: 'so-thuc-lon',
    title: 'Đổi số nguyên lớn sang số thực',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: 'Kết quả lệch ở các chữ số cuối khi số lớn hơn khoảng 9·10¹⁵.',
    explain:
      'Số thực chỉ giữ chính xác số nguyên tới 2⁵³. Phép / luôn trả về số thực. Với số nguyên lớn, giữ mọi phép tính ở số nguyên: dùng //, %, isqrt.',
    wrong: py`a = 10**18 + 1
print(int(a / 1))  # 1000000000000000000`,
    right: py`a = 10**18 + 1
print(a // 1)  # 1000000000000000001`,
  },
  {
    slug: 'chia-ra-so-thuc',
    title: 'Phép / luôn cho số thực',
    group: 'so-hoc',
    severity: 'mat-trang',
    signs: 'Output là 3.0 thay vì 3.',
    explain: 'Trong Python 3, 6 / 2 bằng 3.0. Khi cần số nguyên, dùng 6 // 2.',
    wrong: py`n = 6
print(n / 2)`,
    right: py`n = 6
print(n // 2)`,
  },
  {
    slug: 'quen-lay-du',
    title: 'Quên lấy dư ở từng bước',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs:
      'Python không tràn số nhưng chương trình chậm dần vì số quá lớn; hoặc kết quả chưa chia lấy dư.',
    explain:
      'Đề yêu cầu "in kết quả chia lấy dư cho 10⁹ + 7" thì lấy dư ở mọi bước cộng và nhân, để số luôn nhỏ. Lũy thừa dùng pow(a, b, m).',
    wrong: py`MOD = 10**9 + 7
f = 1
for i in range(1, 20001):
    f = f * i
print(f % MOD)`,
    right: py`MOD = 10**9 + 7
f = 1
for i in range(1, 20001):
    f = f * i % MOD
print(f)`,
  },
  {
    slug: 'so-1-khong-nguyen-to',
    title: 'Coi 1 là số nguyên tố',
    group: 'so-hoc',
    severity: 'mat-mot-phan',
    signs: 'Sai test có số 1 hoặc số 0.',
    explain:
      'Số nguyên tố là số tự nhiên lớn hơn 1 chỉ có hai ước 1 và chính nó. 0 và 1 không phải số nguyên tố.',
    wrong: py`def la_nt(n):
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print(la_nt(1))  # True: sai`,
    right: py`def la_nt(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True

print(la_nt(1), la_nt(97))  # False True`,
  },
  {
    slug: 'dinh-dang-so-thuc',
    title: 'In số thực sai số chữ số thập phân',
    group: 'so-hoc',
    severity: 'mat-trang',
    signs: 'Đề yêu cầu 2 chữ số sau dấu phẩy, chương trình in 3.3333333333333335.',
    explain: 'Dùng định dạng: f"{x:.2f}". Lưu ý phần thập phân dùng dấu chấm, không dùng dấu phẩy.',
    wrong: py`x = 10 / 3
print(x)`,
    right: py`x = 10 / 3
print(f"{x:.2f}")`,
  },
  // ------------------------------------------------------------ Biên, đọc đề
  {
    slug: 'truong-hop-bien',
    title: 'Quên trường hợp biên',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs: 'Sai hoặc lỗi chạy khi n = 1, dãy rỗng, mọi phần tử bằng nhau, số âm, giá trị lớn nhất.',
    explain:
      'Người ra đề luôn có test biên. Trước khi nộp, tự thử: n nhỏ nhất, n lớn nhất, tất cả bằng nhau, toàn số âm, kết quả bằng 0, không có đáp án.',
    wrong: py`a = []
print(sum(a) / len(a))  # ZeroDivisionError`,
    right: py`a = []
print(sum(a) / len(a) if a else 0)`,
  },
  {
    slug: 'lech-chi-so',
    title: 'Lệch chỉ số 0 và 1, sai cận của range',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs: 'IndexError, hoặc thiếu phần tử đầu, cuối.',
    explain:
      'Đề đánh số từ 1, list Python đánh số từ 0. range(a, b) không gồm b. Quyết định một quy ước ngay từ đầu và ghi chú trong code; với cách đánh số từ 1, có thể thêm một phần tử giả ở đầu list.',
    wrong: py`a = [10, 20, 30]
n = len(a)
for i in range(1, n + 1):
    print(a[i])  # IndexError khi i = n`,
    right: py`a = [0] + [10, 20, 30]  # thêm phần tử giả để đánh số từ 1 như đề
n = 3
for i in range(1, n + 1):
    print(a[i])`,
  },
  {
    slug: 'khoi-tao-max-bang-0',
    title: 'Khởi tạo giá trị lớn nhất bằng 0',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs: 'Dãy toàn số âm cho kết quả 0.',
    explain:
      'Khởi tạo bằng phần tử đầu tiên, hoặc bằng -float("inf") / số rất nhỏ hơn mọi giá trị có thể.',
    wrong: py`a = [-5, -2, -9]
lon_nhat = 0
for x in a:
    lon_nhat = max(lon_nhat, x)
print(lon_nhat)  # 0: sai`,
    right: py`a = [-5, -2, -9]
lon_nhat = a[0]
for x in a[1:]:
    lon_nhat = max(lon_nhat, x)
print(lon_nhat)  # -2`,
  },
  {
    slug: 'nhieu-test-quen-khoi-tao',
    title: 'Nhiều bộ dữ liệu trong một file mà quên khởi tạo lại',
    group: 'bien',
    severity: 'mat-trang',
    signs: 'Bộ đầu đúng, các bộ sau sai vì dùng lại biến cũ.',
    explain:
      'Đề có T bộ test thì mọi biến đếm, mảng đánh dấu phải được tạo lại trong mỗi bộ. Viết hàm giai(...) xử lý một bộ để biến tự tạo lại.',
    wrong: py`tong = 0
for bo in ([1, 2], [3]):
    for x in bo:
        tong += x
    print(tong)  # 3 rồi 6: sai`,
    right: py`def giai(bo):
    return sum(bo)

for bo in ([1, 2], [3]):
    print(giai(bo))  # 3 rồi 3`,
  },
  {
    slug: 'day-con-lien-tiep',
    title: 'Nhầm "dãy con" với "dãy con liên tiếp"',
    group: 'bien',
    severity: 'mat-trang',
    signs: 'Lời giải đúng ý mình nhưng sai ví dụ của đề.',
    explain:
      'Dãy con liên tiếp (đoạn con) gồm các phần tử kề nhau. Dãy con (không nói liên tiếp) được bỏ bớt phần tử ở giữa. Hai bài khác hẳn nhau; luôn chạy tay ví dụ của đề để kiểm tra cách hiểu.',
  },
  {
    slug: 'khong-vuot-qua',
    title: 'Nhầm "không vượt quá" với "nhỏ hơn"',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs: 'Sai đúng các test có giá trị bằng ngưỡng.',
    explain:
      '"Không vượt quá k" là ≤ k; "nhỏ hơn k" là < k; "ít nhất" là ≥. Gạch chân các cụm này khi đọc đề.',
    wrong: py`k = 5
a = [3, 5, 7]
print(sum(1 for x in a if x < k))  # đề: không vượt quá k`,
    right: py`k = 5
a = [3, 5, 7]
print(sum(1 for x in a if x <= k))`,
  },
  {
    slug: 'do-thi-khong-lien-thong',
    title: 'Coi đồ thị luôn liên thông, không có cạnh lặp',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs:
      'Sai khi có đỉnh không đến được, có hai cạnh nối cùng cặp đỉnh, hoặc cạnh nối một đỉnh với chính nó.',
    explain:
      'Đề không nói đồ thị liên thông thì phải xử lý đỉnh không đến được (in -1 hoặc theo đề). Cạnh lặp với trọng số khác nhau: Dijkstra vẫn đúng nếu xét mọi cạnh.',
  },
  {
    slug: 'tran-bo-nho',
    title: 'Tạo mảng quá lớn',
    group: 'bien',
    severity: 'mat-mot-phan',
    signs: 'MemoryError hoặc bị dừng vì vượt giới hạn bộ nhớ.',
    explain:
      'Một list 10⁸ số nguyên trong Python tốn vài GB. Chỉ lưu những gì cần: lưu theo dòng hiện tại và dòng trước trong quy hoạch động, dùng bytearray cho mảng đánh dấu.',
    wrong: py`n = 10**8
la_nt = [True] * (n + 1)`,
    right: py`n = 10**6
la_nt = bytearray([1]) * (n + 1)  # mỗi phần tử 1 byte
la_nt[0] = la_nt[1] = 0
print(len(la_nt))`,
  },
  // ------------------------------------------------------------ Phiên bản
  {
    slug: 'python-cu-tren-may-cham',
    title: 'Dùng tính năng mới hơn phiên bản Python trên máy chấm',
    group: 'phien-ban',
    severity: 'mat-trang',
    signs: 'Chạy đúng trên máy nhà, máy chấm báo SyntaxError hoặc AttributeError.',
    explain:
      'Máy ở phòng thi có thể cài Python cũ. Tránh match/case (3.10), math.lcm (3.9), itertools.pairwise (3.10), list[int] trong chú thích kiểu (3.9), str.removeprefix (3.9), tham số key của bisect (3.10). Đầu giờ thi, chạy python --version để biết.',
    wrong: py`import math

print(math.lcm(4, 6))  # cần Python 3.9`,
    right: py`import math

def bcnn(a, b):
    return a // math.gcd(a, b) * b

print(bcnn(4, 6))  # chạy được từ Python 3.5`,
  },
  {
    slug: 'thu-vien-ngoai',
    title: 'Dùng thư viện ngoài như numpy',
    group: 'phien-ban',
    severity: 'mat-trang',
    signs: 'ModuleNotFoundError trên máy chấm.',
    explain:
      'Máy chấm thường chỉ có thư viện chuẩn. Dùng sys, math, collections, heapq, bisect, itertools, functools.',
  },
  // ------------------------------------------------------------ Chiến thuật
  {
    slug: 'bo-qua-subtask',
    title: 'Bỏ qua điểm của subtask dễ',
    group: 'chien-thuat',
    severity: 'mat-mot-phan',
    signs: 'Mất cả bài vì cố làm lời giải tối ưu nhưng không xong.',
    explain:
      'Đề chia ràng buộc thành các nhóm, ví dụ 60% test có n ≤ 1000. Viết lời giải đơn giản lấy chắc phần đó trước, nộp, rồi mới tối ưu. Nhiều bạn đạt giải nhờ cộng dồn điểm subtask.',
  },
  {
    slug: 'khong-doi-chieu-trau',
    title: 'Không viết lời giải trâu để đối chiếu',
    group: 'chien-thuat',
    severity: 'mat-mot-phan',
    signs: 'Lời giải tối ưu đúng ví dụ nhưng sai test ẩn.',
    explain:
      'Viết thêm một lời giải chậm nhưng chắc đúng (thử mọi khả năng), một chương trình sinh test ngẫu nhiên nhỏ, rồi so sánh hai lời giải trên hàng trăm test. Cẩm nang có mẫu script chạy được trên Windows.',
  },
  {
    slug: 'khong-doc-het-de',
    title: 'Không đọc hết đề trước khi làm',
    group: 'chien-thuat',
    severity: 'mat-mot-phan',
    signs: 'Sa đà vào bài khó đầu tiên, hết giờ chưa làm bài dễ ở cuối.',
    explain:
      'Dành 10 phút đầu đọc hết các bài, ước lượng độ khó, xếp thứ tự làm. Bài khó nhất không phải lúc nào cũng đứng cuối đề.',
  },
  {
    slug: 'khong-thu-test-lon',
    title: 'Không thử dữ liệu lớn nhất',
    group: 'chien-thuat',
    severity: 'mat-mot-phan',
    signs: 'Mọi test nhỏ đúng, quá thời gian khi chấm.',
    explain:
      'Tự sinh một test có n bằng giới hạn lớn nhất (bằng một đoạn Python ngắn) và đo thời gian chạy. Nếu gần giới hạn, tối ưu phần đọc dữ liệu và vòng lặp trong cùng.',
    right: py`import random

n = 100000
with open("BAI1.INP", "w") as f:
    f.write(str(n) + "\n")
    f.write(" ".join(str(random.randint(-10**9, 10**9)) for _ in range(n)) + "\n")`,
  },
  {
    slug: 'khong-luu-bai',
    title: 'Không lưu bài thường xuyên',
    group: 'chien-thuat',
    severity: 'mat-trang',
    signs: 'Máy treo hoặc mất điện cuối giờ, mất bài.',
    explain:
      'Bấm Ctrl+S sau mỗi thay đổi quan trọng. Khi bài đã đạt các test tự thử, sao lưu một bản sang tên khác trước khi tối ưu tiếp.',
  },
];
