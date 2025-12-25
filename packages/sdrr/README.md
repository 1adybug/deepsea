# sdrr

`sdrr` 是一个命令行工具：根据你项目里的 `app/` 目录结构（`layout.*` / `page.*` 等约定），自动生成 `components/Router.tsx`，用来创建 `react-router` 的 `createBrowserRouter` 配置。

它适合“文件即路由”的开发方式：你只维护 `app/` 里的页面与布局文件，路由表由 `sdrr` 自动更新。

## 与 Next.js 16 的对标关系

`sdrr` 的目录与文件命名约定**对标 Next.js 16 的 App Router（`app/` 目录）文件路由**：尽量使用同样的“路由段（segment）”规则（如路由分组、动态段、catch-all 等），但最终会生成 `react-router` 的路由配置（`createBrowserRouter`）。

由于 `react-router` 与 Next.js 的运行时能力不同，部分 Next 约定没有等价实现：`sdrr` 会在检测到这些目录命名时直接抛错，避免生成语义错误的路由。

### 对比表（Next.js 16 App Router vs sdrr）

| Next.js 16（App Router）约定     | sdrr 行为（react-router 映射）                             | 备注                                                   |
| -------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| `app/` 作为路由根                | 扫描当前工作目录下的 `app/` 并生成 `components/Router.tsx` | 在 monorepo 里通常先 `cd` 到应用包根目录再执行         |
| `page.(ts/tsx/js/jsx)`           | 生成 `index: true` 的子路由组件（目录级页面）              | 同名文件选择：`.lazy` 优先，其次 `tsx > jsx > ts > js` |
| `layout.(ts/tsx/js/jsx)`         | 生成父 route 的 `Component`（布局组件）                    | 典型 layout 需要渲染 `<Outlet />`                      |
| 路由分组 `(group)`               | 生成 `path` 为空的“pathless route”                         | 不会出现在 URL 中                                      |
| 动态段 `[id]`                    | 映射为 `:id`                                               | 与 Next 的动态段语义对齐                               |
| catch-all `[...slug]`            | 映射为 `:slug/*`（内部用两层 route 生成）                  | `slug` 是第一个段；剩余段在 `params["*"]`              |
| optional catch-all `[[...slug]]` | 同时生成 `/`（index）与 `:slug/*` 两种匹配                 | 与 Next 的“可选”语义对齐                               |
| `error.(ts/tsx/js/jsx)`          | 映射为 route 的 `ErrorBoundary`                            | Next 的 `error.js` 是错误边界概念，近似映射            |
| `not-found.(ts/tsx/js/jsx)`      | 生成 `path: "*"` 的兜底子路由                              | 用于该布局/段下的 404 兜底                             |
| `@slot`（并行路由）              | 不支持，直接抛错                                           | `react-router` 缺少命名 slot/outlet 的等价能力         |
| `(.)/(..)/(...)`（拦截路由）     | 不支持，直接抛错                                           | `react-router` 无等价语义                              |

## 前置要求

- Node.js：本包按 `node >= 22` 构建
- React：建议 React 18+
- `react-router`：需要支持 Data Router 的版本（例如 `^6.4.0` 或 `^7.x`）

## 安装

```bash
pnpm add -D sdrr
# 或
npm i -D sdrr
```

也可以临时运行（不安装到项目）：

```bash
pnpm dlx sdrr build
# 或
npx sdrr build
```

## 快速开始

`sdrr` 默认把“你执行命令时所在目录”当作项目根目录，并且：

- 从 `app/` 读取路由文件
- 生成/覆盖 `components/Router.tsx`
- 自动写入/更新 `.vscode/settings.json`，把 `components/Router.tsx` 加到 `files.exclude`（避免干扰编辑）

在 monorepo 场景下，通常需要先 `cd` 到具体应用包的根目录再运行。

### 1) 准备目录与最小页面

确保以下目录存在（尤其是 `components/`，`sdrr` 不会自动创建它）：

```text
.
├─ app
│  ├─ layout.tsx
│  └─ page.tsx
└─ components
```

最小示例：

`app/layout.tsx`

```tsx
import { Outlet } from "react-router"

export default function Layout() {
    return <Outlet />
}
```

`app/page.tsx`

```tsx
export default function Home() {
    return <div>Home</div>
}
```

### 2) 生成路由文件

仅生成一次（不启动任何开发命令）：

```bash
sdrr build
```

生成完成后会得到 `components/Router.tsx`，你可以在入口里直接渲染它：

```tsx
import Router from "./components/Router"

export default function App() {
    return <Router />
}
```

## 命令行用法

`sdrr` 目前提供一个子命令：`build`。

### `sdrr build [command...]`

运行规则：

- 每次执行都会先扫描 `app/` 并重新生成 `components/Router.tsx`
- 如果你没有传入 `command`，生成完就退出
- 如果你传入了 `command`，会在生成路由后再执行该命令（用于把“生成路由”串到你的 dev/build 流程里）

示例：

```bash
# 只生成路由
sdrr build

# 生成路由后再执行 vite build
sdrr build vite build
```

### Watch 模式

当 `build` 的最后一个参数是 `--watch` 或 `-w` 时，`sdrr` 会进入 watch 模式：

- 监听 `app/` 目录变更并自动重生成 `components/Router.tsx`
- 同时启动你的开发命令
- 任意一方退出会结束另一方进程

注意：`-w/--watch` 必须放在最后，并且前面必须有“要运行的命令”。

```bash
sdrr build vite dev -w
# 或
sdrr build pnpm dev --watch
```

## 路由约定（`app/` 目录规则）

`sdrr` 会递归扫描 `app/`，并在每个目录下识别以下文件：

- 页面：`page.(ts|tsx|js|jsx)`、`page.lazy.(ts|tsx|js|jsx)`
- 布局：`layout.(ts|tsx|js|jsx)`、`layout.lazy.(ts|tsx|js|jsx)`
- 错误边界：`error.(ts|tsx|js|jsx)`、`error.lazy.(ts|tsx|js|jsx)`（映射到 `react-router` 的 `ErrorBoundary`）
- 404：`not-found.(ts|tsx|js|jsx)`、`not-found.lazy.(ts|tsx|js|jsx)`（会生成一个 `path: "*"` 的兜底子路由）

补充规则：

- 如果文件存在但内容为空/全是空白，会被当作“未提供”而忽略
- 如果同一目录下同时存在多个同名候选文件（例如 `page.ts`、`page.tsx`、`page.lazy.tsx`），选择优先级为：`.lazy` 版本优先；其次按后缀名优先级 `tsx > jsx > ts > js`
- `action.ts` / `loader.ts` / `shouldRevalidate.ts` 只会在同目录存在 `page.*` 时才会被关联到该 route

### URL path 生成规则

目录名如何映射到路由：

- 根目录：`app/` 对应 `/`
- 普通目录：`app/users` 对应 `/users`
- 动态参数：`app/users/[id]` 对应 `/users/:id`
- catch-all：`app/docs/[...slug]` 对应 `/docs/:slug/*`（`slug` 为第一个段，剩余部分在 `params["*"]` 中）
- optional catch-all：`app/docs/[[...slug]]` 同时匹配 `/docs` 与 `/docs/:slug/*`
- 分组目录：`app/(auth)/login` 中的 `(auth)` 不会生成 URL 段（pathless route）

与 Next.js 16 App Router 一致的限制（已对齐）：

- `[...slug]` 与 `[[...slug]]` 目录不允许再包含“可路由的子目录”（否则会抛错），因为它们已经吃掉了剩余路径段
- `@slot`（并行路由）与 `(.)/(..)/(...)`（拦截路由）目前在 `react-router` 下没有等价实现：如果目录名出现这些约定，`sdrr` 会直接抛错提示不支持

### layout 与 page 的组合方式

同一目录下：

- 同时存在 `layout.*` 和 `page.*`
    - 该目录会生成一个带 `path` 的布局 route
    - `page.*` 会作为该布局的 `index: true` 子路由
    - 子目录路由会作为该布局的 children
- 只有 `page.*`
    - 如果该目录下没有子目录路由：会生成一个普通 route
    - 如果该目录下还有子目录路由：会生成一个父 route（`path` 为目录名），并将 `page.*` 作为其 `index: true` 子路由，同时把子目录路由挂到该父 route 的 `children` 下（从而支持如 `/user/a` 这类嵌套路由）
- 只有 `layout.*`
    - 会生成一个“无 path 的布局包装层”（pathless route），更适合放在分组目录 `(xxx)` 下用于包裹子路由

### 一个更完整的目录示例

```text
app
├─ layout.tsx
├─ page.tsx
├─ users
│  ├─ page.tsx
│  ├─ [id]
│  │  └─ page.tsx
│  └─ settings
│     ├─ layout.tsx
│     ├─ page.tsx
│     └─ profile
│        └─ page.tsx
└─ (auth)
   ├─ layout.tsx
   ├─ login
   │  └─ page.tsx
   └─ register
      └─ page.lazy.tsx
```

大致对应的 URL：

- `/`：`app/page.tsx`（作为 `app/layout.tsx` 的 index route）
- `/users`：`app/users/page.tsx`
- `/users/:id`：`app/users/[id]/page.tsx`
- `/users/settings`：`app/users/settings/page.tsx`（作为 `app/users/settings/layout.tsx` 的 index route）
- `/users/settings/profile`：`app/users/settings/profile/page.tsx`（嵌套在 `settings/layout.tsx` 下）
- `/login`、`/register`：`(auth)` 是分组目录，不会出现在 URL 上；`register` 使用 `.lazy` 会走按需加载

## Data Router：loader / action / shouldRevalidate

当目录下存在 `page.*` 时，你可以添加以下文件并导出同名函数：

```text
app/posts
├─ page.tsx
├─ loader.ts
├─ action.ts
└─ shouldRevalidate.ts
```

要求：

- `loader.ts` 导出 `loader`
- `action.ts` 导出 `action`
- `shouldRevalidate.ts` 导出 `shouldRevalidate`

`sdrr` 会把它们挂到对应 route 的 `loader/action/shouldRevalidate` 字段上。

## `.lazy`：按需加载组件

当文件名以 `.lazy` 结尾（例如 `page.lazy.tsx` / `layout.lazy.tsx`）时，`sdrr` 会用 `React.lazy(() => import(...))` 方式引入组件。

你需要在渲染 `Router` 时提供 `Suspense`：

```tsx
import { Suspense } from "react"
import Router from "./components/Router"

export default function App() {
    return (
        <Suspense fallback={null}>
            <Router />
        </Suspense>
    )
}
```

## 与 `react-router` 的集成提醒

- 生成的 `components/Router.tsx` 内部使用 `createBrowserRouter` + `RouterProvider`：你的入口处不需要、也不应该再包一层 `<BrowserRouter>`。
- `layout.*` 通常需要渲染 `<Outlet />` 才能让子路由显示出来。

## 路径别名 `@` 的要求

生成的 `components/Router.tsx` 会以 `@/app/...` 的形式导入模块，因此你需要让你的构建工具/TS 配置能解析 `@`：

`tsconfig.json` 示例（把 `@` 指向当前目录）：

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        }
    }
}
```

如果你的项目习惯把源码放在 `src/`，也可以把 `@` 指向 `src`，同时确保你执行 `sdrr` 时的工作目录与实际的 `app/`、`components/` 所在位置保持一致（`sdrr` 所有路径都是相对当前工作目录计算的）。

## 建议的 npm scripts

```jsonc
{
    "scripts": {
        "router:gen": "sdrr build",
        "dev": "sdrr build vite dev -w",
        "build": "sdrr build vite build",
    },
}
```

## 注意事项

- `components/Router.tsx` 会被覆盖生成：不要手改，改动请放到 `app/` 里
- `.vscode/settings.json` 会被读取并更新：如果你的 `settings.json` 不是合法 JSON，可能会导致生成失败
- 路由导入名会根据目录名自动生成并去重：当不同分支存在同名目录时，可能出现 `xxx2/xxx3` 的导入变量名（不影响运行）
