# 微服务 Micro Server

把一个大系统拆成多个小服务，每个服务独立开发、部署、扩容、维护。

每个服务只做一件事，例如：

+ 用户服务
+ 订单服务
+ 支付服务
+ 商品服务
+ 通知服务

这些服务通过 API / 消息队列 互相通信。

## 优势

+ 独立部署
+ 技术多样性
+ 弹性扩展

# Monorepo

单一代码仓库 一种代码组织方式：
多个项目、服务、包共享同一个 Git 仓库，而不是分散在多个 repo（Polyrepo）。

## 常见场景：
+ 多个 Node.js  包（utils、sdk、api-client…）
+ 前后端同仓（Next.js + API）
+ 多个微服务共享基础设施代码
+ 大型团队的多模块协作

## 选型

pnpm + TurboRepo

适合：前后端同仓、多个 Node 包、需要缓存加速的团队
+ pnpm：硬链接 + workspace，依赖管理极快
+ TurboRepo：任务编排、缓存、并行构建、增量构建

### 1. 初始化与安装

```bash [init]
mkdir my-monorepo
cd my-monorepo
pnpm init -y

mkdir apps packages
mkdir -p apps/web
mkdir -p packages/utils
mkdir -p packages/config

# -w (--workspace-root) 强制安装到根目录
pnpm add turbo -D -w
pnpm add typescript -D -w
```

### 2. 目录结构

```text [目录结构]
my-monorepo/
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  .gitignore

  apps/
    web/
      package.json
      tsconfig.json
      src/index.ts

  packages/
    utils/
      package.json
      tsconfig.json
      src/index.ts
      src/sum.ts
    config/
      package.json
      tsconfig.json
      src/index.ts
```

### 3. 根目录配置

::: code-group

```json [package.json]
{
  "name": "my-monorepo",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "latest"
  }
}
```

```yaml [pnpm-workspace.yaml]
packages:
  - "apps/*"
  - "packages/*"
```

```json [turbo.json]
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

```json [tsconfig.base.json]
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@utils/*": ["packages/utils/src/*"],
      "@config/*": ["packages/config/src/*"]
    }
  }
}
```

```text [.gitignore]
node_modules
dist
.env
```

:::

### 4. apps 配置
#### apps/web

::: code-group

```json [package.json]
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@utils": "workspace:*",
    "@config": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

```json [tsconfig.json]
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

```ts [src/index.ts]
import { sum } from "@utils/sum";
import { APP_NAME } from "@config/index";

console.log(`[${APP_NAME}] web app started`);
console.log("sum(1, 2) =", sum(1, 2));
```
:::

### 5. packages 配置

#### 5.1 packages/utils

::: code-group

```json [package.json]
{
  "name": "@utils",
  "version": "0.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  }
}
```

```json [tsconfig.json]
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

```js [src/index.ts]
export * from "./sum";
```

```js [src/sum.ts]
export const sum = (a: number, b: number) => a + b;
```
:::

#### 5.2 packages/config


::: code-group
```json [package.json]
{
  "name": "@config",
  "version": "0.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  }
}
```

```js [tsconfig.json]
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

```js [src/index.ts]
export const APP_NAME = "MyMonorepoApp";
```
:::

### 6.运行与验证

```bash
pnpm install
pnpm build

# 一次性启动所有 dev（web + packages）：
pnpm turbo run dev 
# or 启动单个 web 服务
pnpm turbo run dev --filter=web
```
