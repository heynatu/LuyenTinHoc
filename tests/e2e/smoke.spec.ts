import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  { path: '/', heading: /Hiểu thuật toán/ },
  { path: '/gioi-thieu', heading: 'Giới thiệu' },
  { path: '/chinh-sach-bao-mat', heading: 'Chính sách bảo mật' },
  { path: '/dieu-khoan', heading: 'Điều khoản sử dụng' },
];

/** Ghi lại lỗi console, lỗi trang và vi phạm CSP. */
function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  return problems;
}

async function cspViolations(page: Page) {
  return page.evaluate(() => (window as unknown as { __csp?: string[] }).__csp ?? []);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const store: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = store;
    document.addEventListener('securitypolicyviolation', (event) => {
      store.push(`${event.violatedDirective}: ${event.blockedURI}`);
    });
  });
});

for (const { path, heading } of PAGES) {
  test(`trang ${path} tải được, đúng tiêu đề, không lỗi`, async ({ page }) => {
    const problems = collectProblems(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute(
      'content',
      /script-src 'self' 'wasm-unsafe-eval' 'sha256-/,
    );
    expect(await cspViolations(page)).toEqual([]);
    expect(problems).toEqual([]);
  });

  test(`trang ${path} không cuộn ngang`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('đường dẫn không tồn tại hiện trang 404 tùy biến', async ({ page }) => {
  const response = await page.goto('/khong-ton-tai');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không tìm thấy trang này');
  await expect(page.getByRole('link', { name: 'Về trang chủ' }).first()).toBeVisible();
});

test('đổi giao diện sáng tối và nhớ sau khi tải lại', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Mở menu' }).click();
  const toggle = page.locator('[data-theme-toggle]:visible').first();
  await expect(page.locator('html')).toHaveAttribute('data-theme-pref', 'system');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-pref', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('cấp học được nhớ sau khi tải lại', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Mở menu' }).click();
  await page.locator('[data-level-select]:visible').first().selectOption('thcs');
  await page.reload();
  await expect(page.locator('[data-level-select]').first()).toHaveValue('thcs');
});

test('link bỏ qua tới nội dung chính xuất hiện khi bấm Tab', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Bàn phím vật lý chỉ kiểm tra trên desktop');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Bỏ qua tới nội dung chính' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test('menu di động mở, đóng bằng Escape và trả focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Menu di động chỉ có dưới 1024px');
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toHaveAttribute('data-open', 'true');
  await expect(page.locator('#mobile-menu').getByText('Mô phỏng')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('vùng bấm trên di động đủ 44px', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Chỉ kiểm tra trên di động');
  await page.goto('/');
  const sizes = await page.locator('header a, header button, main a').evaluateAll((els) =>
    els
      .filter((el) => (el as HTMLElement).offsetParent !== null)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent?.trim().slice(0, 30), h: Math.round(r.height) };
      }),
  );
  for (const size of sizes) expect(size.h, size.text).toBeGreaterThanOrEqual(44);
});
