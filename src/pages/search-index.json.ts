/**
 * Chỉ mục tìm kiếm toàn trang, sinh lúc build thành /search-index.json. Trình duyệt tải lười khi
 * mở hộp tìm kiếm lần đầu (src/components/layout/SearchDialog.astro).
 */
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { CONTESTS } from '../data/contests';
import { MOCK_EXAMS } from '../data/mock-exams';
import { PUZZLES } from '../data/puzzles';
import { SQL_DATABASES } from '../data/sql';
import { TOPICS } from '../data/taxonomy';
import { TRAPS } from '../data/traps';
import { getLessons, getProblems, lessonUrl, problemUrl, trapUrl } from '../lib/content';
import type { SearchDoc } from '../lib/search';
import { ALGORITHMS } from '../lib/viz/registry';

export const GET: APIRoute = async () => {
  const docs: SearchDoc[] = [];
  const add = (doc: Omit<SearchDoc, 'id'>) => docs.push({ id: docs.length, ...doc });

  for (const l of await getLessons()) {
    add({
      title: l.data.title,
      url: lessonUrl(l.id),
      kind: 'Bài học',
      text: `${l.data.description} ${l.data.objectives.join(' ')}`,
    });
  }
  for (const p of await getProblems()) {
    add({
      title: p.data.title,
      url: problemUrl(p.id),
      kind: 'Luyện đề',
      text: `${p.data.summary} ${p.data.topics.map((t) => TOPICS[t]).join(' ')} ${p.data.io.program}`,
    });
  }
  for (const a of ALGORITHMS)
    add({ title: a.title, url: `/mo-phong/${a.slug}`, kind: 'Mô phỏng', text: a.summary });
  for (const t of TRAPS) add({ title: t.title, url: trapUrl(t.slug), kind: 'Bẫy', text: t.signs });
  for (const h of await getCollection('handbook')) {
    add({
      title: h.data.title,
      url: `/cam-nang/${h.id}`,
      kind: 'Cẩm nang',
      text: h.data.description,
    });
  }
  for (const z of PUZZLES)
    add({ title: z.title, url: `/tu-duy/${z.id}`, kind: 'Câu đố', text: z.prompt });
  for (const c of CONTESTS)
    add({ title: c.name, url: `/ky-thi/${c.id}`, kind: 'Kỳ thi', text: c.summary });
  for (const e of MOCK_EXAMS)
    add({ title: e.title, url: `/thi-thu/${e.id}`, kind: 'Thi thử', text: e.description });
  for (const d of SQL_DATABASES)
    add({ title: `SQL: ${d.title}`, url: `/sql/${d.id}`, kind: 'SQL', text: d.summary });
  const pages: [string, string, string][] = [
    [
      'Phòng lập trình Python',
      '/lap-trinh',
      'Chạy Python trên trình duyệt, đọc ghi file, theo dõi từng dòng',
    ],
    ['Phòng thực hành SQL', '/sql', 'SELECT WHERE GROUP BY JOIN cơ sở dữ liệu'],
    ['Tiến độ của bạn', '/tien-do', 'Huy hiệu, xuất nhập tiến độ, lịch sử thi thử'],
    ['Dành cho giáo viên', '/giao-vien', 'Giao bài, in đề, tải bộ test Themis'],
  ];
  for (const [title, url, text] of pages) add({ title, url, kind: 'Trang', text });

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
