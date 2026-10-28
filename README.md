# Deepsea

基于 pnpm workspace、Turborepo、Rslib / Rsbuild 和 Changesets 的 TypeScript monorepo。保留各 npm 包的独立版本与公开入口。

## 环境与启动

- Node.js 24（最低 24.15.0，推荐使用 `.node-version` 中的版本）
- pnpm 11.10.0（由根 `package.json` 的 `packageManager` 固定）

```sh
npm install --global pnpm@11.10.0
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` 按依赖顺序构建 @1adybug/playground 使用的库，然后启动 Rsbuild。Turborepo 监听库与构建工具的变化，重新构建受影响的包，并重启 @1adybug/playground 服务。新建、删除源码文件也会重新生成相应包的导出入口。开发工具不依赖已构建的业务包，首次克隆可以直接安装和构建，无需 Bun。

## 目录与边界

| 目录                        | 职责                                              |
| --------------------------- | ------------------------------------------------- |
| `apps/playground`           | 私有的组件与工具调试应用，不发布到 npm            |
| `packages/*`                | 独立发布的工具库、React 集成库与 CLI              |
| `packages/xlsx`             | 随仓库保存的 SheetJS 发行文件，保留原始许可和产物 |
| `tooling/build-config`      | 私有的共享 Rslib 配置与确定性导出生成工具         |
| `tooling/typescript-config` | 私有的 TypeScript 基础、库、React 库和应用配置    |
| `scripts`                   | 仓库边界检查、产物清理和可选镜像同步              |
| `.changeset`                | 待发布变更与独立版本策略                          |
| `.github/workflows`         | Windows / Linux CI 与手动发布流程                 |

内部依赖必须显式声明为 `workspace:*`。应用不能被其他包依赖；发布包的运行时依赖和 peer dependencies 不能引用私有工具包。共享版本统一维护在 `pnpm-workspace.yaml` 的 catalog 中，Node 类型依赖使用 24 系列。`pnpm check:workspace` 检查这些边界。

## 常用命令

| 命令                                               | 用途                                             |
| -------------------------------------------------- | ------------------------------------------------ |
| `pnpm dev`                                         | 监听并开发 @1adybug/playground 及其依赖          |
| `pnpm dev:all`                                     | 监听所有库与 @1adybug/playground                 |
| `pnpm build`                                       | 按依赖顺序构建所有库和应用，缓存 `dist`          |
| `pnpm build:packages`                              | 仅构建发布包及其依赖                             |
| `pnpm build --filter=@1adybug/react-router-cli...` | 构建 sdrr 及其所有依赖                           |
| `pnpm typecheck`                                   | 先构建依赖，再执行各包的 TypeScript 检查         |
| `pnpm test`                                        | 运行已有路由回归测试与共享工具测试               |
| `pnpm lint`                                        | 使用统一 ESLint 配置检查整个仓库                 |
| `pnpm format` / `pnpm format:check`                | 格式化 / 只检查格式                              |
| `pnpm check`                                       | 执行边界、格式、lint、类型、测试和全量构建门禁   |
| `pnpm clean`                                       | 清理各自维护的库和应用产物，保留 xlsx 的发行文件 |

Turborepo 根据声明的包依赖安排任务；共享工具变化会使下游任务缓存失效。本地缓存存放在 `.turbo`，CI 按操作系统恢复缓存。共享构建只生成一份声明，避免 ESM / CJS 并发写入同一类型文件，声明错误会中止构建。Node 工具库保留双格式，CLI 生成 ESM。

`pnpm-lock.yaml` 纳入版本管理，CI 使用 frozen lockfile，依赖变更必须同时更新锁文件。安装是显式步骤，任务执行期间不触发隐式安装，避免并行任务同时改写 node_modules。依赖升级范围见 [DEPENDENCIES.md](./DEPENDENCIES.md)，当前测试范围见 [TESTING.md](./TESTING.md)。

## 版本与发布

```sh
pnpm changeset
# 在变更 PR 中提交生成的 .changeset/*.md

pnpm version:packages
# 在版本 PR 中审核并提交版本号、CHANGELOG 与 pnpm-lock.yaml

pnpm release
# 完整验证后，只发布尚未发布的包版本
```

Changesets 使用独立版本，内部依赖变更按 patch 传播；私有应用和工具包不参与版本和 tag。发布包只携带运行源码和发行文件，共享的私有构建配置不进入 npm 产物。

GitHub 的 **Release** 工作流只接受 `main` 上的手动触发，先执行完整门禁，再发布包并推送版本 tag。使用前需在仓库中配置 `npm` environment 和 `NPM_TOKEN` secret；可在该 environment 设置审核人。CI 不自动执行发布。镜像同步独立执行 `pnpm sync:registry`，不属于发布的必需步骤。

新增包和依赖的约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 旧名称兼容

实现包统一命名为 `@1adybug/*`，旧名称放在 `compat/`，仅依赖并转发对应实现。新代码使用作用域包，旧项目可以逐步替换 import。默认导出、公开子路径、CLI 命令和持久化键保持兼容。完整映射和迁移步骤见 [MIGRATION.md](./MIGRATION.md)。
