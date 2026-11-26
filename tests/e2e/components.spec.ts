import { expect, test } from '@playwright/test';

/** Kiểm tra component trên trang /thiet-ke: bàn phím, trợ năng, không lỗi. */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const store: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = store;
    document.addEventListener('securitypolicyviolation', (e) =>
      store.push(`${e.violatedDirective}: ${e.blockedURI}`),
    );
  });
});

test('trang thiết kế tải được, noindex, không có trong sitemap, không lỗi', async ({
  page,
  request,
}) => {
  const problems: string[] = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
  page.on('pageerror', (e) => problems.push(e.message));
  const response = await page.goto('/thiet-ke');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hệ thống thiết kế');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
  expect(problems).toEqual([]);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('thiet-ke');
  expect(sitemap).toContain('gioi-thieu');
});

test('Tabs: mũi tên, Home, End đổi tab và panel', async ({ page }) => {
  await page.goto('/thiet-ke');
  const tablist = page.getByRole('tablist', { name: 'Nội dung bài tập' });
  const first = tablist.getByRole('tab', { name: 'Đề bài' });
  const second = tablist.getByRole('tab', { name: 'Gợi ý' });
  const third = tablist.getByRole('tab', { name: 'Lời giải' });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(first).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#demo-tabs-panel-goi-y')).toBeVisible();
  await expect(page.locator('#demo-tabs-panel-de-bai')).toBeHidden();
  await page.keyboard.press('End');
  await expect(third).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(first).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(third).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(first).toHaveAttribute('aria-selected', 'true');
});

test('Accordion mở bằng bàn phím', async ({ page }) => {
  await page.goto('/thiet-ke');
  const summary = page.locator('summary', { hasText: 'Tiến độ học được lưu ở đâu?' });
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(summary.locator('xpath=..')).toHaveAttribute('open', '');
  await expect(page.getByText('Trong bộ nhớ của trình duyệt trên chính máy bạn.')).toBeVisible();
});

test('Dialog: mở, focus bên trong, Escape đóng và trả focus', async ({ page }) => {
  await page.goto('/thiet-ke');
  const opener = page.getByRole('button', { name: 'Nộp bài thi thử' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Nộp bài thi thử?' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('Dialog: nút Nộp bài đóng hộp thoại và báo toast', async ({ page }) => {
  await page.goto('/thiet-ke');
  await page.getByRole('button', { name: 'Nộp bài thi thử' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Nộp bài', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('#toast-polite')).toContainText('Đã nộp bài.');
});

test('Toast lỗi vào vùng assertive và đóng được', async ({ page }) => {
  await page.goto('/thiet-ke');
  await page.getByRole('button', { name: 'Toast lỗi' }).click();
  const region = page.locator('#toast-assertive');
  await expect(region).toContainText('Chương trình chạy quá 3 giây');
  await region.getByRole('button', { name: 'Đóng thông báo' }).click();
  await expect(region.locator('.ui-toast')).toHaveCount(0);
});

test('Tooltip hiện khi focus, gắn aria-describedby, Escape ẩn', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Kiểm tra bằng bàn phím trên desktop');
  await page.goto('/thiet-ke');
  const trigger = page.getByRole('button', { name: 'Đặt lại dữ liệu' }).last();
  await expect(trigger).toHaveAttribute('aria-describedby', 'tip-reset');
  await trigger.focus();
  const tip = page.locator('#tip-reset');
  await expect.poll(() => tip.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await page.keyboard.press('Escape');
  await expect.poll(() => tip.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
});

test.describe('sao chép code', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('nút Sao chép code chép đúng nội dung và báo toast', async ({ page }) => {
    await page.goto('/thiet-ke');
    await page.getByRole('button', { name: 'Sao chép code' }).first().click();
    await expect(page.locator('#toast-polite')).toContainText('Đã sao chép code');
    // Clipboard của Windows lưu xuống dòng dạng CRLF: chuẩn hóa trước khi so.
    const raw = await page.evaluate(() => navigator.clipboard.readText());
    const text = raw.split('\r\n').join('\n');
    expect(
      text.startsWith('import sys\n\n\ndef main():\n    data = sys.stdin.buffer.read().split()'),
    ).toBe(true);
  });
});

test('Switch và Radio dùng được bằng bàn phím', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Kiểm tra bằng bàn phím trên desktop');
  await page.goto('/thiet-ke');
  const sw = page.getByRole('switch', { name: 'Hiện số dòng' });
  await sw.focus();
  await page.keyboard.press('Space');
  await expect(sw).toBeChecked();
  const first = page.getByRole('radio', { name: 'Theo từng số, từng từ' });
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Đúng từng dòng' })).toBeChecked();
});

test('Ô nhập lỗi có aria-invalid và đọc được thông báo lỗi', async ({ page }) => {
  await page.goto('/thiet-ke');
  const input = page.locator('#demo-input-error');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription(/phải là BAI1\.INP/);
  await expect(page.locator('#demo-input-default')).toHaveAccessibleDescription(/Gõ đúng tên file/);
});

test('Vòng tiến độ có giá trị cho trình đọc màn hình', async ({ page }) => {
  await page.goto('/thiet-ke');
  const ring = page.getByRole('progressbar', { name: 'Chủ đề Mảng: 35% số bài' });
  await expect(ring).toHaveAttribute('aria-valuenow', '35');
});
