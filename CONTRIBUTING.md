# Đóng góp nội dung

Đọc `CLAUDE.md` (quy tắc dự án) trước. Hai nguyên tắc quan trọng nhất cho nội dung:

1. **Không bịa dữ kiện.** Đề thật, năm thi, thể lệ, số liệu phải có nguồn trong `docs/SOURCES.md`. Thiếu thì để `{{CẦN XÁC MINH}}`.
2. **Lời giải phải qua kiểm định** (`npm run verify:content`) trước khi hiện trên web. Bài chưa kiểm định hoặc `sol.py` đã sửa mà chưa kiểm định lại sẽ tự bị ẩn khi build.

Sau mỗi thay đổi: `npm run check:all` và `npm run test:e2e`.

## Thêm một bài vào kho đề

Tạo thư mục `src/content/problems/<id>/` (id viết thường, không dấu, nối bằng dấu gạch nối):

| File                         | Nội dung                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `index.md`                   | Frontmatter (schema trong `src/content.config.ts`) và đề bài: Đề bài, Dữ liệu vào, Kết quả                  |
| `editorial.md`               | `timeComplexity`, `memoryComplexity`, `partial`; thân: Phân tích, Giả mã (một khối `pseudo`), Mở rộng       |
| `sol.py`                     | Lời giải 100%, Python 3.8 trở lên, chỉ thư viện chuẩn, có `main()`, nhãn `# [Lx]` trỏ tới dòng x của giả mã |
| `brute.py`                   | Lời giải trâu viết theo cách **khác hẳn** `sol.py`, chỉ cần đúng với test nhỏ                               |
| `gen.py`                     | Hàm `sinh(rng, co)` trả về một test dạng chuỗi; `BIEN` (test biên viết tay); `KE_HOACH` (số test mỗi cỡ)    |
| `sub1.py` (tùy chọn)         | Lời giải từng phần, khai báo trong `partial` của editorial                                                  |
| `vi-du/1.inp`, `vi-du/1.out` | Ví dụ trong đề; lời giải thích ví dụ đặt ở `sampleNotes`                                                    |

Quy ước bắt buộc trong frontmatter của `index.md` (script kiểm định đọc đúng dạng một dòng này):

```yaml
io: { mode: file, input: TENBAI.INP, output: TENBAI.OUT, program: TENBAI.PY }
limits: { timeMs: 1000, memoryMb: 256 }
compare: tokens
```

- `mode: stdio` nếu đề dùng vào ra chuẩn. `compare`: `tokens` (mặc định), `lines` hoặc `float`.
- Giá trị YAML có dấu hai chấm theo sau là dấu cách (`: `) phải đặt trong nháy đơn, nếu không build sẽ lỗi.
- Nhãn nguồn: đề tự soạn dùng `kind: original`, `year: null`, `round: null`. Không bao giờ gắn năm thi cho đề tự soạn (schema chặn).
- `traps` và `algorithms` phải trỏ tới bẫy và thuật toán có thật (build báo lỗi nếu sai).

Gen phải sinh test nhỏ cho cỡ `nho` (để `brute.py` chạy kịp 300 vòng), và test đúng giới hạn cho cỡ `lon`. Tests JSON của mỗi bài tối đa 2 MB; test lớn hơn tự động chỉ có trong gói zip Themis. Muốn bộ chấm trên web có một test lớn, thêm cỡ `lon` vừa 2 MB và cỡ `cuc-dai` đúng giới hạn (xem `dem-so-nho-hon/gen.py`).

Kiểm định:

```powershell
npm run verify:content -- <id>
```

Script chạy ví dụ, đối chiếu với lời giải trâu, sinh test, đo thời gian, kiểm tra cú pháp Python 3.8 và nhãn giả mã, rồi ghi `verify.json`, `public/judge/<id>/tests.json` và gói zip. Commit cả các file này. Không bao giờ sửa chúng bằng tay.

Trên máy có `ruff` và `vermin` (`python -m pip install -r requirements-dev.txt`), script dùng chúng; CI bắt buộc có. Thiếu thì script dùng kiểm tra dự phòng.

## Nhập đề chính thức

1. Đặt file đề gốc vào `source-materials/` (thư mục này không được đưa lên web) kèm ghi chú: đơn vị ra đề, kỳ thi, năm học, vòng thi.
2. Thêm dòng nguồn vào `docs/SOURCES.md`.
3. Tạo bài như trên với `kind: official` (giữ nguyên đề) hoặc `kind: adapted` (đã đổi câu chữ, số liệu), điền `year`, `round`, `reference`.
4. Viết lời giải mới, kiểm định như mọi bài. Quyền tác giả đề thuộc đơn vị ra đề.

## Thêm bài học

File `src/content/lessons/<cap>/<id>.md`, frontmatter theo schema `lessons`. Mỗi bài có mục tiêu, 4 câu trắc nghiệm đủ bốn mức (nhận biết, thông hiểu, vận dụng, vận dụng cao), ví dụ code `python title="…"`, giả mã `pseudo`, callout `> [!MEO]`, `> [!BAY]`, `> [!LUU-Y]`, `> [!VI-DU]`, và mục Tự luyện. Link nội bộ viết dạng tuyệt đối (`/luyen-de/tong-uoc`); `npm run check:links` báo link chết.

## Thêm câu đố, bài SQL, bài cẩm nang, đề thi thử

- Câu đố: `src/data/puzzles.ts` (tự biên soạn, không chép Bebras). Unit test kiểm tra câu robot giải được bằng `answer`.
- SQL: `src/data/sql.ts`. Bảng mô tả bằng cột và dòng; lời giải được unit test chạy bằng sql.js.
- Cẩm nang: `src/content/handbook/<id>.md`.
- Thi thử: `src/data/mock-exams.ts`, chỉ ghép bài đã kiểm định.

## Lời văn

Tiếng Việt có dấu, xưng "bạn", thuật ngữ khớp sách giáo khoa. Trong câu chữ giao diện không dùng dấu gạch nối, không in nghiêng, không chấm than. Thông báo bình tĩnh, nói rõ cái gì sai và làm gì tiếp.
