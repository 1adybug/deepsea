# 贡献约定

## 修改现有包

1. 使用 Node 24 与根目录固定版本的 pnpm，从根目录安装依赖。
2. 根据包依赖关系修改实际负责该逻辑的包，不通过应用侧补偿掩盖库问题。
3. 使用 `pnpm build --filter=<包名>...` 构建目标及其依赖。只运行 `pnpm --filter <包名> build` 时，需自行保证依赖已构建。
4. 执行 `pnpm check`。涉及用户可见行为时，用 `pnpm dev` 在 @1adybug/playground 验证。
5. 对外 API、行为修复和依赖变化执行 `pnpm changeset`，选择受影响的发布包与版本级别。纯文档、CI、私有工具配置变化可以不创建发布记录。

## 新增包

- 应用放在 `apps/`，共享工具放在 `tooling/`，均声明 `private: true`。
- 发布库放在 `packages/`，配置独立的名称、版本、许可、`exports`、`files` 和 `repository.directory`。
- 库的 `devDependencies` 显式声明 `@1adybug/build-config`、`@1adybug/typescript-config`、`@rslib/core` 和 TypeScript。内部依赖统一使用 `workspace:*`。
- TypeScript 配置继承 `@1adybug/typescript-config/library.json` 或 `react-library.json`；`rootDir`、`paths` 与 `include` 必须在包内声明，避免相对路径指向共享配置目录。
- `rslib.config.ts` 从 `@1adybug/build-config` 导入 `getRslibConfig`。Node CLI 使用 `{ target: "node" }`；浏览器库默认生成 ESM 和 CJS。
- 库实现 `build`、`dev`、`typecheck`、`clean` 命令。库的 `dev` 是一次性构建，由根目录的 `turbo watch` 负责监听与按序重建；应用的开发服务使用 persistent task。
- 自动导出包保留 `prebuild` 脚本，使用 `@1adybug/build-config/exports`。生成器按固定顺序导出一级源码目录中的 TS / TSX 文件，排除声明和测试，内容不变时不重写文件。
- 使用共享配置的 `tsconfig.json` 不加入发布文件白名单；消费者通过 `dist` 中的类型声明获取类型，无需安装仓库私有工具。
- 有真实测试时添加 `test` 命令，TS 测试使用 Vitest，纯 Node 工具可使用 `node --test`。不添加空测试或永远成功的占位命令。

## 依赖和自动检查

通过 `pnpm --filter <包名> add <依赖>` 添加依赖。多包共用的版本优先放入 workspace catalog；React 等宿主框架在库中作为 peer dependency，在应用中作为运行依赖。公开类型声明引用的工作区包必须声明为运行依赖或 peer dependency，不能仅放在开发依赖中。

提交依赖变更时同时提交 `pnpm-lock.yaml`。安装脚本的授权统一放在根 workspace 的 `allowBuilds` 中。不要在子包另建 lockfile 或加入局部包管理器设置。

Git 提交前通过 Husky 调用本地 `pnpm exec lint-staged` 格式化暂存文件。合并门禁为 `.github/workflows/ci.yml` 中 Windows 和 Linux 的 `pnpm check`，实际工作流结果以 GitHub 执行为准。

## 包名与兼容层

新的应用、库和私有工具均使用 `@1adybug/*`。旧名称只允许出现在 `compat/`；实现包不得依赖兼容包。兼容包只依赖一个对应实现，通过 `compatibility` 元数据生成转发文件。修改兼容子路径和默认导出后，必须通过兼容测试及其类型检查，见 [MIGRATION.md](./MIGRATION.md)。
