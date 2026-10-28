# @1adybug/typescript-config

[English](README.md) | [简体中文](README.zh-CN.md)

用于严格共享设置、库、React 库和浏览器应用的内部 TypeScript 预设。

## 能力

- 提供 base.json、library.json、react-library.json 和 app.json，启用严格类型检查和 Bundler 模块解析。

## 安装与运行环境

```sh
pnpm add -D @1adybug/typescript-config@workspace:*
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```json
{
    "extends": "@1adybug/typescript-config/react-library.json",
    "compilerOptions": { "rootDir": "src" },
    "include": ["src"]
}
```

## 公开 API

| 入口                   | 用途             |
| ---------------------- | ---------------- |
| `./base.json`          | 导出的工作区资源 |
| `./library.json`       | 导出的工作区资源 |
| `./react-library.json` | 导出的工作区资源 |
| `./app.json`           | 导出的工作区资源 |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

这是私有工作区工具。消费项目需要自行设置 include、rootDir 和环境类型声明。app.json 启用 noEmit，库预设启用声明生成；项目特殊需求可通过本地配置覆盖。

## 测试与开发

```sh
pnpm --filter @1adybug/typescript-config test
```

通过编译器验证全部预设的继承、消费方覆盖和真实严格空值检查诊断。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

私有工作区工具，不发布到 npm。
