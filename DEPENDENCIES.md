# 依赖版本策略

本轮按当前主版本的最新稳定版本更新；0.x 按当前次版本更新，保留现有组件 API。Node 运行时和类型定义保持 24。所有直接外部依赖使用 workspace catalog，应用、库、开发依赖和 peer dependencies 共享同一版本来源。

锁文件固定实际安装结果；后续升级通过修改 catalog 并重新安装完成。Node 类型还通过 overrides 统一约束到 24，避免可选 peer 自动安装到 26。HeroUI 3、Tailwind 4、TypeScript 7、Rslib 1、ESLint 10、Changesets 3 等跨兼容边界迁移不属于本轮范围。

ESLint 9 的上游已标记废弃；本轮按已确认的兼容升级范围保留 9 系列最后版本。SheetJS 是仓库随附发行文件，没有替换为同名公共 npm 包。

| 直接依赖                      | 原基线               | 本轮统一版本 |
| ----------------------------- | -------------------- | ------------ |
| `@1adybug/eslint`             | 0.0.12               | 0.0.17       |
| `@1adybug/prettier`           | 0.0.31               | 0.0.37       |
| `@ant-design/cssinjs`         | 2.1.2                | 2.1.2        |
| `@ant-design/icons`           | 6.2.5                | 6.3.4        |
| `@changesets/cli`             | 2.31.0               | 2.31.1       |
| `@emotion/css`                | 11.13.5              | 11.13.5      |
| `@eslint/js`                  | 9.39.5               | 9.39.5       |
| `@heroui/react`               | 2.8.5                | 2.8.10       |
| `@inquirer/prompts`           | 8.5.2                | 8.7.5        |
| `@internationalized/date`     | 3.12.2               | 3.12.4       |
| `@react-types/shared`         | 3.35.0               | 3.37.0       |
| `@rsbuild/core`               | 2.1.5                | 2.2.14       |
| `@rsbuild/plugin-react`       | 2.1.0                | 2.1.1        |
| `@rsbuild/plugin-svgr`        | 2.0.5                | 2.0.5        |
| `@rsdoctor/rspack-plugin`     | 1.5.18               | 1.6.5        |
| `@rslib/core`                 | 0.23.2               | 0.23.2       |
| `@tanstack/react-form`        | 1.33.2               | 1.33.5       |
| `@tanstack/react-query`       | 5.90.21              | 5.105.0      |
| `@testing-library/dom`        | new test dependency  | 10.4.2       |
| `@testing-library/react`      | new test dependency  | 16.3.3       |
| `@types/js-cookie`            | 3.0.6                | 3.0.6        |
| `@types/node`                 | 24                   | 24.19.2      |
| `@types/react`                | 19.2.17              | 19.3.0       |
| `@types/react-dom`            | 19.2.3               | 19.3.0       |
| `@types/which`                | 3.0.4                | 3.0.4        |
| `antd`                        | 6.4.3                | 6.6.8        |
| `autoprefixer`                | 10.4.22              | 10.6.2       |
| `bowser`                      | 2.14.1               | 2.15.0       |
| `chokidar`                    | 5.0.0                | 5.0.0        |
| `clipboard`                   | 2.0.11               | 2.0.11       |
| `clsx`                        | 2.1.1                | 2.1.1        |
| `commander`                   | 14.0.2               | 14.0.3       |
| `core-js`                     | new Array dependency | 3.51.0       |
| `core-js-pure`                | new Array dependency | 3.51.0       |
| `cross-env`                   | 10.1.0               | 10.1.0       |
| `dayjs`                       | 1.11.21              | 1.11.23      |
| `echarts`                     | 6.1.0                | 6.1.0        |
| `eslint`                      | 9.39.5               | 9.39.5       |
| `eslint-plugin-react-hooks`   | 7.1.1                | 7.1.1        |
| `eslint-plugin-react-refresh` | 0.5.2                | 0.5.7        |
| `fast-deep-equal`             | 3.1.3                | 3.1.3        |
| `framer-motion`               | 12.40.0              | 12.43.0      |
| `get-port-please`             | 3.2.0                | 3.2.0        |
| `globals`                     | 17.6.0               | 17.13.0      |
| `hls.js`                      | 1.6.13               | 1.7.3        |
| `husky`                       | 9.1.7                | 9.1.7        |
| `iconv-lite`                  | 0.7.3                | 0.7.3        |
| `identifier-regex`            | 1.1.0                | 1.1.0        |
| `js-cookie`                   | 3.0.8                | 3.0.8        |
| `jsdom`                       | new test dependency  | 30.1.3       |
| `lint-staged`                 | 17.0.7               | 17.6.0       |
| `next`                        | 16.0.10              | 16.4.3       |
| `postcss`                     | 8.5.18               | 8.5.32       |
| `prettier`                    | 3.9.5                | 3.9.10       |
| `react`                       | 19.2.7               | 19.3.1       |
| `react-dom`                   | 19.2.7               | 19.3.1       |
| `react-router`                | 7.2.0                | 7.18.5       |
| `react-router-dom`            | 7.17.0               | 7.18.5       |
| `robust-point-in-polygon`     | 1.0.3                | 1.0.3        |
| `robust-segment-intersect`    | 1.0.1                | 1.0.1        |
| `smooth-scrollbar`            | 8.8.4                | 8.8.4        |
| `stable-hash`                 | 0.0.6                | 0.0.6        |
| `tailwind-merge`              | 3.6.0                | 3.7.0        |
| `tailwindcss`                 | 3.4.19               | 3.4.19       |
| `tar`                         | 7.5.20               | 7.5.22       |
| `turbo`                       | 2.11.10              | 2.11.10      |
| `typescript`                  | 6.0.3                | 6.0.3        |
| `typescript-eslint`           | 8.63.0               | 8.72.1       |
| `uuid`                        | 14.0.0               | 14.0.3       |
| `vite`                        | 8.0.0                | 8.3.5        |
| `vitest`                      | 5.0.5                | 5.0.5        |
| `which`                       | 7.0.0                | 7.0.0        |
| `zod`                         | 4.4.3                | 4.6.7        |
