import { expect, test, type Page } from '@playwright/test';

/** Luyện đề, chấm thử, SQL, câu đố, tìm kiếm, tiến độ, thi thử: chạy dưới header CSP của vercel.json. */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const store: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = store;
    document.addEventListener('securitypolicyviolation', (e) =>
      store.push(`${e.violatedDirective}: ${e.blockedURI}`),
    );
  });
});

const cspViolations = (page: Page) =>
  page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);

test('kho đề: tìm không dấu và lọc theo cấp độ', async ({ page }) => {
  await page.goto('/luyen-de');
  const visible = page.locator('[data-problem]:visible');
  const total = await visible.count();
  expect(total).toBeGreaterThanOrEqual(20);
  await page.getByRole('searchbox').fill('nguyen to trong doan');
  await expect(visible).toHaveCount(1);
  await expect(visible.first()).toContainText('Số nguyên tố trong đoạn');
  await page.getByRole('button', { name: 'Bỏ mọi bộ lọc' }).click();
  await expect(visible).toHaveCount(total);
  await page.locator('[data-filter="difficulty"]').selectOption('4');
  const level4 = await visible.count();
  expect(level4).toBeGreaterThan(0);
  expect(level4).toBeLessThan(total);
  await page.getByRole('searchbox').fill('khong co bai nao nhu the nay');
  await expect(page.getByText('Không có bài nào khớp bộ lọc')).toBeVisible();
  expect(await cspViolations(page)).toEqual([]);
});

test('trang bài: lời giải ẩn tới khi bấm, ví dụ và tên file hiện đúng', async ({ page }) => {
  await page.goto('/luyen-de/tong-uoc');
  await expect(page.getByRole('heading', { level: 1, name: 'Tổng các ước' })).toBeVisible();
  await expect(page.getByText('TONGUOC.PY, TONGUOC.INP, TONGUOC.OUT')).toBeVisible();
  await page.getByRole('tab', { name: 'Lời giải' }).click();
  const body = page.locator('[data-solution-body]');
  await expect(body).toBeHidden();
  await page.getByRole('button', { name: 'Xem lời giải' }).click();
  await expect(body).toBeVisible();
  await expect(body).toContainText('Đã kiểm định');
  await expect(body.locator('pre').first()).toBeVisible();
  const zip = page.getByRole('link', { name: 'Tải bộ test dạng Themis' });
  const res = await page.request.get((await zip.getAttribute('href'))!);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('zip');
});

test.describe('chấm thử với Python thật', () => {
  test.skip(({ isMobile }) => isMobile, 'Pyodide nặng: kiểm tra trên desktop là đủ');
  test.describe.configure({ mode: 'serial' });

  const solution = [
    'from math import isqrt',
    'with open("TONGUOC.INP") as f:',
    '    n = int(f.read())',
    't = c = 0',
    'for i in range(1, isqrt(n) + 1):',
    '    if n % i == 0:',
    '        t += i + (n // i if n // i != i else 0)',
    '        c += 1 if n // i == i else 2',
    'with open("TONGUOC.OUT", "w") as f:',
    '    f.write(f"{t}\\n{c}\\n")',
  ].join('\n');

  test('lời giải đúng đạt 100% và được lưu vào tiến độ', async ({ page }) => {
    await page.addInitScript(
      (code) => localStorage.setItem('tdt:v1:bai:tong-uoc:code', code),
      solution,
    );
    await page.goto('/luyen-de/tong-uoc');
    await page.getByRole('button', { name: 'Chấm thử' }).click();
    await expect(page.locator('[data-judge-status]')).toHaveText('Đúng hết các test.', {
      timeout: 120_000,
    });
    await expect(page.locator('[data-judge-summary]')).toContainText('100%');
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('tdt:v1:progress') ?? '{}'),
    );
    expect(stored.problems['tong-uoc'].best).toBe(100);
    expect(await cspViolations(page)).toEqual([]);
  });

  test('đọc bàn phím khi đề yêu cầu file: báo lỗi từng test bằng chữ', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('tdt:v1:bai:tong-uoc:code', 'n = int(input())\nprint(n)'),
    );
    await page.goto('/luyen-de/tong-uoc');
    await page.getByRole('button', { name: 'Chấm thử' }).click();
    await expect(page.locator('[data-judge-status]')).toContainText('Chấm xong', {
      timeout: 120_000,
    });
    await expect(page.locator('[data-judge-results] li').first()).toContainText(
      /Lỗi khi chạy|Không tìm thấy file kết quả/,
    );
    await expect(page.locator('[data-judge-summary]')).toContainText('0/');
  });
});

test('phòng SQL: chạy truy vấn và chấm một bài', async ({ page }) => {
  await page.goto('/sql/thu-vien');
  await page.locator('[data-sql-pick="tv-ten-sach"]').click();
  const content = page.locator('[data-sql-editor] .cm-content');
  await content.click();
  await content.fill('SELECT ten_sach, tac_gia FROM sach;');
  await page.getByRole('button', { name: 'Chạy', exact: true }).click();
  await expect(page.locator('[data-sql-output] tbody tr')).toHaveCount(12, { timeout: 30_000 });
  await page.getByRole('button', { name: 'Kiểm tra bài' }).click();
  await expect(page.locator('[data-sql-status]')).toContainText('Đúng', { timeout: 30_000 });
  await content.fill('SELECT ten_sach FROM sach;');
  await page.getByRole('button', { name: 'Kiểm tra bài' }).click();
  await expect(page.locator('[data-sql-status]')).toContainText('cột');
  expect(await cspViolations(page)).toEqual([]);
});

test('câu đố: thẻ nhị phân, sắp xếp bước và robot giải được bằng bàn phím hoặc nút', async ({
  page,
}) => {
  await page.goto('/tu-duy/nhi-phan-so-5');
  await page.locator('[data-card="0"]').click();
  await page.locator('[data-card="2"]').click();
  await expect(page.locator('[data-binary-bits]')).toHaveText('101');
  await page.getByRole('button', { name: 'Kiểm tra' }).click();
  await expect(page.locator('[data-feedback]')).toContainText('Chính xác');

  await page.goto('/tu-duy/thu-tu-doi-cho');
  for (let guard = 0; guard < 10; guard += 1) {
    const order = await page
      .locator('[data-step]')
      .evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.step)));
    const wrong = order.findIndex((v, i) => v !== i);
    if (wrong === -1) break;
    const from = order.indexOf(wrong);
    await page.locator(`[data-step="${wrong}"] [data-move="-1"]`).click();
    expect(from).toBeGreaterThan(wrong);
  }
  await page.getByRole('button', { name: 'Kiểm tra thứ tự' }).click();
  await expect(page.locator('[data-feedback]')).toContainText('Chính xác');

  await page.goto('/tu-duy/robot-vong-qua-tang-da');
  const steps = page.locator('[data-robot-steps]');
  await steps.selectOption('1');
  await page.locator('[data-robot-add="U"]').click();
  await steps.selectOption('4');
  await page.locator('[data-robot-add="R"]').click();
  await steps.selectOption('1');
  await page.locator('[data-robot-add="D"]').click();
  await page.getByRole('button', { name: 'Chạy chương trình' }).click();
  await expect(page.locator('[data-feedback]')).toContainText('Robot đã tới đích', {
    timeout: 10_000,
  });
  await page.goto('/tu-duy');
  await expect(page.locator('[data-puzzle-done="robot-vong-qua-tang-da"]')).toBeVisible();
});

test('tìm kiếm toàn trang mở bằng phím / và tìm không dấu', async ({ page, isMobile }) => {
  await page.goto('/cam-nang');
  if (isMobile) await page.getByRole('button', { name: 'Tìm kiếm (phím /)' }).click();
  else await page.keyboard.press('/');
  const input = page.getByRole('combobox', { name: 'Từ khóa tìm kiếm' });
  await expect(input).toBeFocused();
  await input.fill('dijkstra');
  await expect(
    page.getByRole('listbox', { name: 'Kết quả tìm kiếm' }).getByRole('option').first(),
  ).toContainText('Dijkstra');
  await input.fill('bay sai ten file');
  await expect(
    page.getByRole('listbox', { name: 'Kết quả tìm kiếm' }).getByRole('option').first(),
  ).toContainText('Sai tên file');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/bay-thuong-gap\/sai-ten-file$/);
});

test('tiến độ: màn hình bắt đầu khi trống, nhập file sai báo lỗi cụ thể', async ({ page }) => {
  await page.goto('/tien-do');
  await expect(page.getByText('Bắt đầu từ đây')).toBeVisible();
  await page.locator('[data-progress-import]').setInputFiles({
    name: 'sai.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"v": 2}'),
  });
  await expect(page.locator('[data-progress-message]')).toContainText('không đúng định dạng');
  const good = JSON.stringify({
    v: 1,
    lessons: { 'thpt/ham-trong-python': { at: '2026-11-20T08:00:00Z' } },
    quizzes: {},
    problems: {},
    exams: [],
    puzzles: {},
    sql: {},
    days: [],
  });
  await page
    .locator('[data-progress-import]')
    .setInputFiles({ name: 'tot.json', mimeType: 'application/json', buffer: Buffer.from(good) });
  await expect(page.locator('[data-progress-stats]')).toContainText('Bài học đã học');
  await expect(page.getByText('Bắt đầu từ đây')).toBeHidden();
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(robots).toContain('noindex');
});

test('thi thử: đồng hồ chạy và giữ nguyên khi tải lại trang', async ({ page }) => {
  await page.goto('/thi-thu/tin-hoc-tre-thcs-1');
  await page.getByRole('button', { name: 'Bắt đầu làm bài' }).click();
  const clock = page.locator('[data-exam-clock]');
  await expect(clock).toHaveText(/^(1:29:\d\d|1:30:00)$/);
  await page.reload();
  await expect(page.locator('[data-exam-work]')).toBeVisible();
  await expect(clock).toHaveText(/^1:(29|30):\d\d$/);
  await expect(page.getByRole('tab', { name: 'Bài 4' })).toBeVisible();
});

test('mục lục bài học, học tiếp và ô tiếp tục học dùng tiến độ đã lưu', async ({
  page,
  isMobile,
}) => {
  const progress = JSON.stringify({
    v: 1,
    lessons: { 'thpt/python-vao-ra-du-lieu': { at: '2026-11-20T08:00:00Z' } },
    quizzes: {},
    problems: { 'dem-cap-tong': { best: 50, tests: 14, at: '2026-11-21T08:00:00Z' } },
    exams: [],
    puzzles: {},
    sql: {},
    days: [],
  });
  await page.addInitScript((p) => {
    if (!localStorage.getItem('tdt:v1:progress')) localStorage.setItem('tdt:v1:progress', p);
  }, progress);

  await page.goto('/hoc/thpt');
  await expect(page.locator('[data-resume-count]')).toContainText('Đã học 1/');
  await expect(page.locator('[data-resume-label]')).toHaveText('Học tiếp');

  await page.goto('/hoc/thpt/re-nhanh-va-vong-lap');
  if (!isMobile) {
    const outline = page.locator('aside [data-outline]');
    await expect(outline.locator('[data-outline-count]')).toContainText('Đã học 1/');
    await expect(outline.locator('[aria-current="page"]')).toContainText('rẽ nhánh');
  }
  await page.locator('[data-next-lesson]').click();
  await expect(page).not.toHaveURL(/re-nhanh-va-vong-lap$/);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('tdt:v1:progress') ?? '{}'),
  );
  expect(stored.lessons['thpt/re-nhanh-va-vong-lap']).toBeTruthy();

  await page.goto('/');
  const box = page.locator('[data-continue]');
  await expect(box).toBeVisible();
  await expect(box.locator('[data-continue-problem]')).toContainText('Đếm cặp');
});

test('người mới không thấy ô tiếp tục học', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-continue]')).toBeHidden();
});
