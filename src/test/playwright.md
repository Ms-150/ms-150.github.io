# playwright

实现了可靠的网络自动化，用于测试、脚本编写和人工智能 代理。

[https://playwright.dev/](https://playwright.dev/)

## install

::: code-group

```bash [npm]
npm init playwright@latest
```

```bash [pnpm]
pnpm create playwright
```

:::

```diff
+ playwright.config.ts         # Test configuration
+ tests/
+ example.spec.ts            # Minimal example test
```

## usage

::: code-group

```ts [playwright.config.ts]

webServer: {
  command: 'npm run docs:dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

```bash [testing]
# 运行默认 tests/example.spec.ts
npx playwright test
# or
npx playwright test [--headed] [tests/blog.spec.ts]
# --headed 有头模式
# tests/blog.spec.ts 针对特定文件
```

```bash [codegen]
# 录制测试代码
npx playwright codegen localhost:3000
npx playwright codegen localhost:3000 -o tests/search-feature.spec.ts
# -o / --output 指定代码写入路径 会直接覆盖
```

```bash [debug]
# 交互式 UI 模式
npx playwright test --ui
```

```bash [report]
# 生成临时报告
npx playwright show-report
```
:::

## main api

### 1. 定位器 (Locators) —— 核心中的核心

 Playwright 抛弃了脆弱的 CSS 选择器，转而推荐用户视角的语义化定位。

::: code-group

```ts [getByRole()]
// 通过 HTML 角色定位（如按钮、标题、链接）
page.getByRole('button', { name: '提交' })
```

```ts [getByText()]
// 通过可见文本定位
page.getByText('登录成功')
```

```ts [getByPlaceholder()]
// 通过输入框的占位符定位
page.getByPlaceholder('请输入手机号')
```

```ts [getByLabel()]
// 通过关联的 <label> 文本定位
page.getByLabel('用户名：').fill('hi');
```

:::

### 2. 动作指令 (Actions) —— 自动等待
动作函数都是异步的，并且在执行前会自动检查元素是否可见、是否可点击（Actionability Check）。

::: code-group

```ts [fill] 
// 输入 比 type 更快，直接模拟输入完成
await page.getByRole('textbox').fill('hi')
```

```ts [click] 
// 点击
await page.getByText('确认').click()
```

```ts [check / uncheck]
// 勾选 / 取消
await page.getByLabel('同意协议').check()

await page.getByLabel('同意协议').uncheck()
```

```ts [press]
// 键盘按键
await page.press('body', 'Control+K')
```

:::

### 3. 断言 (Assertions) —— 质量把关
使用增强版的 expect。它的特点是“自动重试”：如果断言失败，它会等待一段时间直到条件达成，而不是直接报错。

::: code-group

```ts [toBeVisible()]
// 可见性
await expect(page.getByText('搜索结果')).toBeVisible()
```

```ts [toContainText()]
// 内容包含
await expect(page.locator('.status')).toContainText('已完成')
```

```ts [toHaveURL()]
// URL 检查
await expect(page).toHaveURL(/.*dashboard/)
```

```ts [toHaveValue()]
// 属性检查：（常用于表单验证）。
const input = page.locator('#username');

await expect(input).toHaveValue('Gemini_Flash');
```

:::

### 4. 页面控制 (Navigation & Context)

::: code-group

```ts [goto]
// 跳转
await page.goto('/') // 使用配置文件里的 baseURL
```

```ts [waitForResponse]
// 等待网络请求
const responsePromise = page.waitForResponse(response => 
  response.url().includes('/api/export') && response.status() === 200
);
```

```ts [screenshot]
// 截图/录屏
await page.screenshot({ path: 'debug.png' })
```

:::


## example

采用 POM (Page Object Model) 模式

将页面元素定位与测试逻辑分离。

+ Page 类：封装定位器和交互动作。
+ Spec 文件：只负责描述测试步骤和断言。

```bash
tests/
├── models/
│   ├── BasePage.ts      # 基础基类：封装通用逻辑
│   └── GooglePage.ts    # 页面对象：封装定位器与业务动作
└── search.spec.ts       # 测试脚本：仅描述业务流程
```

::: code-group

```ts [BasePage.ts]
import { type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  // 封装通用的跳转方法
  async navigate(url: string = 'https://www.google.com') {
    await this.page.goto(url);
  }
}
```

```ts [GooglePage.ts]
import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GooglePage extends BasePage {
  // 定义私有定位器，保证封装性
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    // 使用语义化更好的角色定位器
    this.searchInput = page.getByRole('combobox', { name: '查找' });
    this.searchButton = page.getByRole('button', { name: 'Google 搜索' }).first();
  }

  // 封装业务动作：执行搜索流程
  async searchFor(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.keyboard.press('Enter'); // 模拟回车
  }
}
```

```ts [search.spec.ts]
import { test, expect } from '@playwright/test';
import { GooglePage } from './models/GooglePage';

test.describe('Google 搜索验证', () => {
  
  test('用户可以成功执行搜索', async ({ page }) => {
    const googlePage = new GooglePage(page);

    // 1. 访问首页
    await googlePage.navigate();

    // 2. 调用封装好的业务动作
    await googlePage.searchFor('Playwright testing');

    // 3. 断言结果：断言逻辑通常保留在 spec 文件中
    await expect(page).toHaveTitle(/Playwright testing/);
  });
});
```

:::
