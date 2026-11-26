import { expect, test, type Page } from '@playwright/test';

/** Phòng lập trình Python chạy dưới đúng header CSP của vercel.json (serve-dist). */

test.describe.configure({ mode: 'serial' });
test.skip(({ isMobile }) => isMobile, 'Pyodide nặng: kiểm tra trên desktop là đủ cho logic');

async function setCode(page: Page, code: string) {
  const content = page.locator('[data-python-lab] .cm-content').first();
  await content.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Delete');
  await content.fill(code);
}

async function run(page: Page) {
  await page.getByRole('button', { name: 'Chạy chương trình' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const store: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = store;
    document.addEventListener('securitypolicyviolation', (e) =>
      store.push(`${e.violatedDirective}: ${e.blockedURI}`),
    );
  });
});

test('chạy print, đọc dữ liệu vào, không vi phạm CSP', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/lap-trinh');
  await setCode(page, 'a, b = map(int, input().split())\nprint(a + b, a * b)');
  await page.getByLabel('Dữ liệu vào', { exact: true }).fill('3 5');
  await run(page);
  const output = page.locator('[data-lab-output]');
  await expect(output).toHaveText('8 15\n', { timeout: 60_000 });
  await expect(page.locator('[data-lab-status]')).toContainText('Chạy xong');
  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
  expect(errors).toEqual([]);
});

test('vòng lặp vô hạn bị dừng sau 3 giây, trang vẫn dùng được', async ({ page }) => {
  await page.goto('/lap-trinh');
  await setCode(page, 'while True:\n    pass');
  await run(page);
  await expect(page.locator('[data-lab-status]')).toContainText('quá 3 giây', { timeout: 60_000 });
  await setCode(page, 'print("vẫn chạy")');
  await run(page);
  await expect(page.locator('[data-lab-output]')).toHaveText('vẫn chạy\n', { timeout: 60_000 });
});

test('mẫu đọc nhanh sys.stdin.buffer chạy được', async ({ page }) => {
  await page.goto('/lap-trinh');
  await setCode(
    page,
    'import sys\ndata = sys.stdin.buffer.read().split()\nprint(sum(map(int, data[1:])))',
  );
  await page.getByLabel('Dữ liệu vào', { exact: true }).fill('4\n1 2 3 4');
  await run(page);
  await expect(page.locator('[data-lab-output]')).toHaveText('10\n', { timeout: 60_000 });
});

test('lỗi được giải thích bằng tiếng Việt, có số dòng', async ({ page }) => {
  await page.goto('/lap-trinh');
  await setCode(page, 'a = [1, 2, 3]\nprint(a[3])');
  await run(page);
  const error = page.locator('[data-lab-error]');
  await expect(error).toContainText('Lỗi ở dòng 2', { timeout: 60_000 });
  await expect(error).toContainText('Chỉ số vượt ngoài danh sách');
});

test('đọc ghi file: đúng tên thì đọc được file kết quả, sai tên thì báo lỗi phòng thi', async ({
  page,
}) => {
  await page.goto('/lap-trinh');
  await page.getByRole('switch', { name: 'Đọc ghi file như phòng thi' }).check();
  await page.getByLabel('Dữ liệu vào', { exact: true }).fill('2\n4 9');
  await setCode(
    page,
    'data = open("BAI1.INP").read().split()\nopen("BAI1.OUT", "w").write(str(max(map(int, data[1:]))))',
  );
  await run(page);
  await expect(page.locator('[data-lab-file-output]')).toContainText('9', { timeout: 60_000 });
  await setCode(page, 'data = open("BAI1.INP").read().split()\nopen("bai1.out", "w").write("9")');
  await run(page);
  await expect(page.locator('[data-lab-error]')).toContainText('Không tìm thấy file BAI1.OUT', {
    timeout: 60_000,
  });
});

test('theo dõi từng dòng hiện bước và biến', async ({ page }) => {
  await page.goto('/lap-trinh');
  await setCode(page, 'x = 1\nfor i in range(3):\n    x = x * 2\nprint(x)');
  await page.getByRole('button', { name: 'Theo dõi từng dòng' }).click();
  await expect(page.locator('[data-lab-trace-label]')).toContainText('Bước 1/', {
    timeout: 60_000,
  });
  await page.getByRole('button', { name: 'Bước sau' }).click();
  await expect(page.locator('[data-lab-trace-vars]')).toContainText('x');
  await page.locator('[data-lab-trace-range]').fill(String(9));
  await expect(page.locator('[data-lab-trace-out]')).toContainText('8');
});
