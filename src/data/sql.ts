/**
 * Phòng thực hành SQL (mục 4.5): 3 cơ sở dữ liệu mẫu tiếng Việt, dữ liệu hư cấu, và bài tập.
 * Lệnh CREATE TABLE sinh từ mô tả bảng nên sơ đồ trên trang luôn khớp với cơ sở dữ liệu thật.
 * tests/unit/sql.test.ts chạy mọi lời giải mẫu bằng sql.js để chắc chắn không lỗi.
 */

export type Column = {
  name: string;
  type: 'INTEGER' | 'TEXT' | 'REAL';
  pk?: boolean;
  ref?: string;
  note?: string;
};
export type Table = {
  name: string;
  label: string;
  columns: Column[];
  rows: (string | number | null)[][];
};
export type SqlDatabase = { id: string; title: string; summary: string; tables: Table[] };

export type SqlExercise = {
  id: string;
  db: string;
  title: string;
  prompt: string;
  solution: string;
  /** Bài sửa dữ liệu: so sánh kết quả câu truy vấn này sau khi chạy lệnh của người học và lời giải. */
  check?: string;
  ordered?: boolean;
  level: 1 | 2 | 3;
};

const q = (v: string | number | null) =>
  v === null ? 'NULL' : typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`;

export function schemaSql(db: SqlDatabase): string {
  const parts: string[] = ['PRAGMA foreign_keys = ON;'];
  for (const t of db.tables) {
    const pk = t.columns.filter((c) => c.pk).map((c) => c.name);
    const cols = t.columns.map(
      (c) => `  ${c.name} ${c.type}${c.pk && pk.length === 1 ? ' PRIMARY KEY' : ''}`,
    );
    if (pk.length > 1) cols.push(`  PRIMARY KEY (${pk.join(', ')})`);
    for (const c of t.columns.filter((x) => x.ref)) {
      const [table, col] = c.ref!.split('.');
      cols.push(`  FOREIGN KEY (${c.name}) REFERENCES ${table}(${col})`);
    }
    parts.push(`CREATE TABLE ${t.name} (\n${cols.join(',\n')}\n);`);
    for (const row of t.rows)
      parts.push(`INSERT INTO ${t.name} VALUES (${row.map(q).join(', ')});`);
  }
  return parts.join('\n');
}

export const SQL_DATABASES: SqlDatabase[] = [
  {
    id: 'thu-vien',
    title: 'Thư viện trường',
    summary: 'Học sinh, sách và phiếu mượn sách của thư viện một trường THPT.',
    tables: [
      {
        name: 'hoc_sinh',
        label: 'Học sinh',
        columns: [
          { name: 'ma_hs', type: 'TEXT', pk: true },
          { name: 'ho_ten', type: 'TEXT' },
          { name: 'lop', type: 'TEXT' },
        ],
        rows: [
          ['HS01', 'Nguyễn Minh An', '11A1'],
          ['HS02', 'Trần Thu Hà', '11A1'],
          ['HS03', 'Lê Quốc Bảo', '11A2'],
          ['HS04', 'Phạm Ngọc Diệp', '10A3'],
          ['HS05', 'Võ Thành Đạt', '11A1'],
          ['HS06', 'Đặng Khánh Linh', '12A1'],
          ['HS07', 'Huỳnh Gia Huy', '10A3'],
          ['HS08', 'Bùi Phương Thảo', '11A2'],
        ],
      },
      {
        name: 'sach',
        label: 'Sách',
        columns: [
          { name: 'ma_sach', type: 'TEXT', pk: true },
          { name: 'ten_sach', type: 'TEXT' },
          { name: 'tac_gia', type: 'TEXT' },
          { name: 'the_loai', type: 'TEXT' },
          { name: 'nam_xb', type: 'INTEGER' },
        ],
        rows: [
          ['S01', 'Lập trình Python cho người mới', 'Hoàng Văn Nam', 'Tin học', 2021],
          ['S02', 'Cấu trúc dữ liệu và giải thuật', 'Nguyễn Thị Lan', 'Tin học', 2019],
          ['S03', 'Truyện ngắn quê hương', 'Trần Văn Sơn', 'Văn học', 2015],
          ['S04', 'Toán rời rạc nhập môn', 'Phan Quốc Khánh', 'Toán học', 2020],
          ['S05', 'Cơ sở dữ liệu thực hành', 'Lê Thị Mai', 'Tin học', 2023],
          ['S06', 'Thơ tuổi học trò', 'Đỗ Minh Châu', 'Văn học', 2018],
          ['S07', 'Hình học không gian', 'Phan Quốc Khánh', 'Toán học', 2022],
          ['S08', 'Lịch sử Tây Nguyên', 'Nguyễn Hữu Phúc', 'Lịch sử', 2017],
          ['S09', 'Thiết kế web với HTML và CSS', 'Hoàng Văn Nam', 'Tin học', 2024],
          ['S10', 'Biển và đảo Việt Nam', 'Trịnh Bá Tùng', 'Địa lý', 2021],
          ['S11', 'Giải tích nâng cao', 'Vũ Đức Thịnh', 'Toán học', 2016],
          ['S12', 'Tuyển tập ca dao', 'Đỗ Minh Châu', 'Văn học', 2020],
        ],
      },
      {
        name: 'phieu_muon',
        label: 'Phiếu mượn',
        columns: [
          { name: 'ma_phieu', type: 'INTEGER', pk: true },
          { name: 'ma_hs', type: 'TEXT', ref: 'hoc_sinh.ma_hs' },
          { name: 'ma_sach', type: 'TEXT', ref: 'sach.ma_sach' },
          { name: 'ngay_muon', type: 'TEXT', note: 'dạng YYYY-MM-DD' },
          { name: 'ngay_tra', type: 'TEXT', note: 'NULL nếu chưa trả' },
        ],
        rows: [
          [1, 'HS01', 'S01', '2025-09-08', '2025-09-20'],
          [2, 'HS02', 'S03', '2025-09-10', '2025-09-25'],
          [3, 'HS01', 'S02', '2025-09-22', null],
          [4, 'HS03', 'S01', '2025-09-23', '2025-10-05'],
          [5, 'HS05', 'S05', '2025-10-01', null],
          [6, 'HS06', 'S04', '2025-10-03', '2025-10-17'],
          [7, 'HS02', 'S06', '2025-10-06', '2025-10-13'],
          [8, 'HS07', 'S01', '2025-10-09', null],
          [9, 'HS08', 'S09', '2025-10-14', '2025-10-28'],
          [10, 'HS03', 'S05', '2025-10-20', '2025-11-02'],
          [11, 'HS01', 'S09', '2025-11-03', null],
          [12, 'HS04', 'S10', '2025-11-05', '2025-11-12'],
        ],
      },
    ],
  },
  {
    id: 'quan-ly-diem',
    title: 'Quản lý điểm',
    summary: 'Học sinh, môn học và điểm tổng kết từng học kỳ của một khối lớp.',
    tables: [
      {
        name: 'hoc_sinh',
        label: 'Học sinh',
        columns: [
          { name: 'ma_hs', type: 'TEXT', pk: true },
          { name: 'ho_ten', type: 'TEXT' },
          { name: 'lop', type: 'TEXT' },
          { name: 'gioi_tinh', type: 'TEXT' },
        ],
        rows: [
          ['HS01', 'Nguyễn Hoàng Anh', '11A1', 'Nam'],
          ['HS02', 'Lê Thị Bích Ngọc', '11A1', 'Nữ'],
          ['HS03', 'Trần Đức Duy', '11A1', 'Nam'],
          ['HS04', 'Phạm Thùy Trang', '11A2', 'Nữ'],
          ['HS05', 'Võ Minh Khoa', '11A2', 'Nam'],
          ['HS06', 'Ngô Thanh Tâm', '11A2', 'Nữ'],
        ],
      },
      {
        name: 'mon_hoc',
        label: 'Môn học',
        columns: [
          { name: 'ma_mon', type: 'TEXT', pk: true },
          { name: 'ten_mon', type: 'TEXT' },
        ],
        rows: [
          ['TOAN', 'Toán'],
          ['TIN', 'Tin học'],
          ['VAN', 'Ngữ văn'],
        ],
      },
      {
        name: 'diem',
        label: 'Điểm',
        columns: [
          { name: 'ma_hs', type: 'TEXT', pk: true, ref: 'hoc_sinh.ma_hs' },
          { name: 'ma_mon', type: 'TEXT', pk: true, ref: 'mon_hoc.ma_mon' },
          { name: 'hoc_ky', type: 'INTEGER', pk: true },
          { name: 'diem', type: 'REAL' },
        ],
        rows: [
          ['HS01', 'TOAN', 1, 8.5],
          ['HS01', 'TIN', 1, 9.0],
          ['HS01', 'VAN', 1, 7.0],
          ['HS02', 'TOAN', 1, 7.5],
          ['HS02', 'TIN', 1, 8.0],
          ['HS02', 'VAN', 1, 8.5],
          ['HS03', 'TOAN', 1, 6.0],
          ['HS03', 'TIN', 1, 7.5],
          ['HS03', 'VAN', 1, 6.5],
          ['HS04', 'TOAN', 1, 9.0],
          ['HS04', 'TIN', 1, 9.5],
          ['HS04', 'VAN', 1, 8.0],
          ['HS05', 'TOAN', 1, 5.5],
          ['HS05', 'TIN', 1, 7.0],
          ['HS05', 'VAN', 1, 6.0],
          ['HS06', 'TOAN', 1, 8.0],
          ['HS06', 'TIN', 1, 6.5],
          ['HS06', 'VAN', 1, 9.0],
          ['HS01', 'TOAN', 2, 9.0],
          ['HS01', 'TIN', 2, 9.5],
          ['HS01', 'VAN', 2, 7.5],
          ['HS02', 'TOAN', 2, 8.0],
          ['HS02', 'TIN', 2, 8.5],
          ['HS02', 'VAN', 2, 8.0],
          ['HS03', 'TOAN', 2, 6.5],
          ['HS03', 'TIN', 2, 8.0],
          ['HS03', 'VAN', 2, 7.0],
          ['HS04', 'TOAN', 2, 9.5],
          ['HS04', 'TIN', 2, 9.0],
          ['HS04', 'VAN', 2, 8.5],
          ['HS05', 'TOAN', 2, 6.0],
          ['HS05', 'TIN', 2, 7.5],
          ['HS05', 'VAN', 2, 6.5],
          ['HS06', 'TOAN', 2, 7.5],
          ['HS06', 'TIN', 2, 7.0],
          ['HS06', 'VAN', 2, 9.0],
        ],
      },
    ],
  },
  {
    id: 'van-phong-pham',
    title: 'Cửa hàng văn phòng phẩm',
    summary: 'Mặt hàng, khách hàng và đơn hàng của một cửa hàng văn phòng phẩm gần trường.',
    tables: [
      {
        name: 'mat_hang',
        label: 'Mặt hàng',
        columns: [
          { name: 'ma_mh', type: 'TEXT', pk: true },
          { name: 'ten_mh', type: 'TEXT' },
          { name: 'loai', type: 'TEXT' },
          { name: 'don_gia', type: 'INTEGER', note: 'đồng' },
          { name: 'ton_kho', type: 'INTEGER' },
        ],
        rows: [
          ['MH01', 'Bút bi xanh', 'Bút', 4500, 120],
          ['MH02', 'Bút chì 2B', 'Bút', 3500, 80],
          ['MH03', 'Vở 96 trang', 'Vở', 9500, 200],
          ['MH04', 'Vở 200 trang', 'Vở', 17000, 60],
          ['MH05', 'Thước kẻ 20 cm', 'Dụng cụ', 6000, 45],
          ['MH06', 'Máy tính cầm tay', 'Dụng cụ', 495000, 7],
          ['MH07', 'Bút dạ quang', 'Bút', 8500, 0],
          ['MH08', 'Giấy kiểm tra', 'Giấy', 12500, 150],
          ['MH09', 'Compa', 'Dụng cụ', 23000, 0],
          ['MH10', 'Bìa hồ sơ', 'Giấy', 5500, 0],
        ],
      },
      {
        name: 'khach_hang',
        label: 'Khách hàng',
        columns: [
          { name: 'ma_kh', type: 'TEXT', pk: true },
          { name: 'ten_kh', type: 'TEXT' },
          { name: 'khu_vuc', type: 'TEXT' },
        ],
        rows: [
          ['KH01', 'Nguyễn Văn Hùng', 'Quy Nhơn'],
          ['KH02', 'Trần Thị Mỹ', 'Pleiku'],
          ['KH03', 'Lê Hoàng Phúc', 'Quy Nhơn'],
          ['KH04', 'Phan Thị Hồng', 'An Khê'],
          ['KH05', 'Đinh Công Sang', 'Pleiku'],
        ],
      },
      {
        name: 'don_hang',
        label: 'Đơn hàng',
        columns: [
          { name: 'ma_dh', type: 'INTEGER', pk: true },
          { name: 'ma_kh', type: 'TEXT', ref: 'khach_hang.ma_kh' },
          { name: 'ngay_dat', type: 'TEXT' },
        ],
        rows: [
          [1, 'KH01', '2025-09-03'],
          [2, 'KH02', '2025-09-05'],
          [3, 'KH01', '2025-09-12'],
          [4, 'KH03', '2025-09-20'],
          [5, 'KH05', '2025-10-02'],
        ],
      },
      {
        name: 'chi_tiet',
        label: 'Chi tiết đơn hàng',
        columns: [
          { name: 'ma_dh', type: 'INTEGER', pk: true, ref: 'don_hang.ma_dh' },
          { name: 'ma_mh', type: 'TEXT', pk: true, ref: 'mat_hang.ma_mh' },
          { name: 'so_luong', type: 'INTEGER' },
        ],
        rows: [
          [1, 'MH01', 10],
          [1, 'MH03', 5],
          [2, 'MH06', 1],
          [2, 'MH05', 2],
          [3, 'MH02', 6],
          [3, 'MH01', 4],
          [3, 'MH08', 3],
          [4, 'MH03', 10],
          [4, 'MH04', 2],
          [5, 'MH07', 3],
          [5, 'MH01', 5],
        ],
      },
    ],
  },
];

export const SQL_EXERCISES: SqlExercise[] = [
  // ---------------------------------------------------------------- Thư viện
  {
    id: 'tv-ten-sach',
    db: 'thu-vien',
    level: 1,
    title: 'Tên sách và tác giả',
    prompt: 'Liệt kê tên sách và tác giả của mọi cuốn sách (hai cột: ten_sach, tac_gia).',
    solution: 'SELECT ten_sach, tac_gia FROM sach;',
  },
  {
    id: 'tv-sach-moi',
    db: 'thu-vien',
    level: 1,
    title: 'Sách mới',
    prompt:
      'Liệt kê ten_sach, nam_xb của các sách xuất bản từ năm 2020 trở đi, năm mới nhất trước; cùng năm thì theo tên sách tăng dần.',
    solution:
      'SELECT ten_sach, nam_xb FROM sach WHERE nam_xb >= 2020 ORDER BY nam_xb DESC, ten_sach;',
    ordered: true,
  },
  {
    id: 'tv-lop-11a1',
    db: 'thu-vien',
    level: 1,
    title: 'Học sinh lớp 11A1',
    prompt: 'Liệt kê ma_hs, ho_ten của học sinh lớp 11A1, theo thứ tự mã học sinh tăng dần.',
    solution: "SELECT ma_hs, ho_ten FROM hoc_sinh WHERE lop = '11A1' ORDER BY ma_hs;",
    ordered: true,
  },
  {
    id: 'tv-dem-the-loai',
    db: 'thu-vien',
    level: 2,
    title: 'Số sách mỗi thể loại',
    prompt: 'Với mỗi thể loại, cho biết số đầu sách (hai cột: the_loai, số lượng).',
    solution: 'SELECT the_loai, COUNT(*) FROM sach GROUP BY the_loai;',
  },
  {
    id: 'tv-chua-tra',
    db: 'thu-vien',
    level: 2,
    title: 'Sách chưa trả',
    prompt:
      'Liệt kê họ tên học sinh và tên sách của các phiếu mượn chưa trả (ngay_tra là NULL). Hai cột: ho_ten, ten_sach.',
    solution:
      'SELECT hs.ho_ten, s.ten_sach FROM phieu_muon pm JOIN hoc_sinh hs ON hs.ma_hs = pm.ma_hs JOIN sach s ON s.ma_sach = pm.ma_sach WHERE pm.ngay_tra IS NULL;',
  },
  {
    id: 'tv-chua-muon',
    db: 'thu-vien',
    level: 3,
    title: 'Sách chưa ai mượn',
    prompt: 'Liệt kê ma_sach, ten_sach của các sách chưa từng được mượn lần nào.',
    solution:
      'SELECT ma_sach, ten_sach FROM sach WHERE ma_sach NOT IN (SELECT ma_sach FROM phieu_muon);',
  },
  {
    id: 'tv-them-sach',
    db: 'thu-vien',
    level: 2,
    title: 'Thêm sách mới',
    prompt:
      "Thêm cuốn sách mã S13, tên 'Thuật toán qua ví dụ', tác giả 'Lê Thị Mai', thể loại 'Tin học', năm xuất bản 2025.",
    solution:
      "INSERT INTO sach VALUES ('S13', 'Thuật toán qua ví dụ', 'Lê Thị Mai', 'Tin học', 2025);",
    check: 'SELECT * FROM sach ORDER BY ma_sach;',
  },
  // ---------------------------------------------------------------- Quản lý điểm
  {
    id: 'qld-si-so',
    db: 'quan-ly-diem',
    level: 1,
    title: 'Sĩ số từng lớp',
    prompt: 'Cho biết số học sinh của mỗi lớp (hai cột: lop, số học sinh).',
    solution: 'SELECT lop, COUNT(*) FROM hoc_sinh GROUP BY lop;',
  },
  {
    id: 'qld-tin-gioi',
    db: 'quan-ly-diem',
    level: 2,
    title: 'Điểm Tin học kỳ 1 từ 8',
    prompt: 'Liệt kê ho_ten và điểm môn Tin học ở học kỳ 1 của các học sinh đạt từ 8 trở lên.',
    solution:
      "SELECT hs.ho_ten, d.diem FROM diem d JOIN hoc_sinh hs ON hs.ma_hs = d.ma_hs JOIN mon_hoc m ON m.ma_mon = d.ma_mon WHERE m.ten_mon = 'Tin học' AND d.hoc_ky = 1 AND d.diem >= 8;",
  },
  {
    id: 'qld-trung-binh',
    db: 'quan-ly-diem',
    level: 2,
    title: 'Điểm trung bình học kỳ 1',
    prompt:
      'Với mỗi học sinh, cho biết ma_hs và điểm trung bình các môn ở học kỳ 1, làm tròn 2 chữ số thập phân (dùng ROUND).',
    solution: 'SELECT ma_hs, ROUND(AVG(diem), 2) FROM diem WHERE hoc_ky = 1 GROUP BY ma_hs;',
  },
  {
    id: 'qld-hoc-sinh-gioi',
    db: 'quan-ly-diem',
    level: 3,
    title: 'Trung bình từ 8 trở lên',
    prompt: 'Liệt kê ma_hs của các học sinh có điểm trung bình học kỳ 1 từ 8 trở lên.',
    solution: 'SELECT ma_hs FROM diem WHERE hoc_ky = 1 GROUP BY ma_hs HAVING AVG(diem) >= 8;',
  },
  {
    id: 'qld-mon-cao-nhat',
    db: 'quan-ly-diem',
    level: 3,
    title: 'Môn có điểm trung bình cao nhất',
    prompt: 'Cho biết ten_mon của môn có điểm trung bình học kỳ 2 cao nhất.',
    solution:
      'SELECT m.ten_mon FROM diem d JOIN mon_hoc m ON m.ma_mon = d.ma_mon WHERE d.hoc_ky = 2 GROUP BY m.ma_mon ORDER BY AVG(d.diem) DESC LIMIT 1;',
  },
  {
    id: 'qld-phuc-khao',
    db: 'quan-ly-diem',
    level: 2,
    title: 'Cập nhật điểm phúc khảo',
    prompt:
      'Sau phúc khảo, điểm môn Tin học (ma_mon là TIN) học kỳ 2 của học sinh HS05 được cộng thêm 0,5. Hãy cập nhật.',
    solution:
      "UPDATE diem SET diem = diem + 0.5 WHERE ma_hs = 'HS05' AND ma_mon = 'TIN' AND hoc_ky = 2;",
    check: 'SELECT * FROM diem ORDER BY ma_hs, ma_mon, hoc_ky;',
  },
  // ---------------------------------------------------------------- Văn phòng phẩm
  {
    id: 'vpp-gia-re',
    db: 'van-phong-pham',
    level: 1,
    title: 'Mặt hàng giá dưới 10 000 đồng',
    prompt:
      'Liệt kê ten_mh, don_gia của các mặt hàng có đơn giá dưới 10000 đồng, đơn giá tăng dần.',
    solution: 'SELECT ten_mh, don_gia FROM mat_hang WHERE don_gia < 10000 ORDER BY don_gia;',
    ordered: true,
  },
  {
    id: 'vpp-tong-ban',
    db: 'van-phong-pham',
    level: 2,
    title: 'Tổng số lượng đã bán',
    prompt: 'Với mỗi mặt hàng đã bán được ít nhất một lần, cho biết ma_mh và tổng số lượng đã bán.',
    solution: 'SELECT ma_mh, SUM(so_luong) FROM chi_tiet GROUP BY ma_mh;',
  },
  {
    id: 'vpp-doanh-thu-don',
    db: 'van-phong-pham',
    level: 3,
    title: 'Giá trị từng đơn hàng',
    prompt:
      'Với mỗi đơn hàng, cho biết ma_dh và tổng tiền (số lượng nhân đơn giá, cộng lại), sắp xếp theo ma_dh.',
    solution:
      'SELECT ct.ma_dh, SUM(ct.so_luong * mh.don_gia) FROM chi_tiet ct JOIN mat_hang mh ON mh.ma_mh = ct.ma_mh GROUP BY ct.ma_dh ORDER BY ct.ma_dh;',
    ordered: true,
  },
  {
    id: 'vpp-khach-chua-mua',
    db: 'van-phong-pham',
    level: 3,
    title: 'Khách hàng chưa đặt hàng',
    prompt:
      'Liệt kê ma_kh, ten_kh của các khách hàng chưa có đơn hàng nào (gợi ý: LEFT JOIN hoặc NOT IN).',
    solution:
      'SELECT kh.ma_kh, kh.ten_kh FROM khach_hang kh LEFT JOIN don_hang dh ON dh.ma_kh = kh.ma_kh WHERE dh.ma_dh IS NULL;',
  },
  {
    id: 'vpp-xoa-hang-ton',
    db: 'van-phong-pham',
    level: 3,
    title: 'Dọn mặt hàng hết hàng',
    prompt:
      'Xóa các mặt hàng có tồn kho bằng 0 và chưa từng xuất hiện trong chi tiết đơn hàng nào.',
    solution:
      'DELETE FROM mat_hang WHERE ton_kho = 0 AND ma_mh NOT IN (SELECT ma_mh FROM chi_tiet);',
    check: 'SELECT * FROM mat_hang ORDER BY ma_mh;',
  },
];

export const getSqlDatabase = (id: string) => SQL_DATABASES.find((d) => d.id === id);
