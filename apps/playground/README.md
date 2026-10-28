# Playground

基于 React 19、Rsbuild 和 Tailwind CSS 的私有调试应用。在仓库根目录执行 `pnpm dev`，先按依赖顺序构建工作区库，再启动应用并监听变化。

```sh
pnpm dev
pnpm build --filter=@1adybug/playground...
pnpm --filter @1adybug/playground preview
```

`pnpm --filter @1adybug/playground dev` 只启动应用本身，需要依赖库已经构建。仓库布局和完整命令见根目录 [README](../../README.md)。
