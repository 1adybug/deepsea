# 测试与构建验证

`pnpm test` 执行全部包的真实测试；`pnpm test:types` 使用 TypeScript 检查测试代码和编译期断言，避免只转译不检查类型。`pnpm check` 同时运行仓库边界、格式、ESLint、源码和测试类型检查、测试、构建及公开入口检查。

| 包                         | 当前回归范围                                                                  |
| -------------------------- | ----------------------------------------------------------------------------- |
| @1adybug/components        | 文件读取、Unicode / Base64、多文件顺序和异步禁用状态                          |
| @1adybug/tools             | 分页边界、远程分页、存储代理与去重通知                                        |
| @1adybug/store             | 状态合并 / 替换、订阅取消、React 更新和相同值去重                             |
| sdnext                     | 共享模块路径、命名与生成文件幂等性                                            |
| sdrr                       | 默认 / 自定义错误边界和静态目录与动态路由关系                                 |
| @1adybug/antd              | Zod 规则、样式合并、日期区间、真实表单 selector 订阅                          |
| @1adybug/array             | 66 个操作、标准边界语义、缺失原生实现、原型隔离、按需安装、生产打包及类型契约 |
| @1adybug/coordinate        | 输入规范化、非法输入和 WGS84 / GCJ02 / BD09 往返转换                          |
| @1adybug/heroui            | 共享字段投影、校验状态、日期和时间默认值                                      |
| @1adybug/hooks             | 多订阅存储状态同步、函数式更新和查询参数保留                                  |
| @1adybug/next              | Next 导航 push / replace、编码和更新后的选项                                  |
| @1adybug/node              | 递归复制、多输入复制、保留源文件和失败传播                                    |
| @1adybug/react             | 嵌套节点判定和表格原始值转换                                                  |
| @1adybug/react-router      | 真实 MemoryRouter 内查询参数更新与其他参数保留                                |
| @1adybug/tailwind          | 通过 Tailwind 3 / PostCSS 实际编译工具类                                      |
| @1adybug/tanstack-form     | 错误判断、字段上下文绑定和事件转发                                            |
| @1adybug/tanstack-query    | 真实 QueryClient 查询缓存、参数 key、refine 和 mutation 回调顺序              |
| @1adybug/types             | 类型相等、never、可选字段、联合与交集的编译期契约                             |
| @1adybug/xlsx              | 随附 ESM / CJS 的 XLSX 二进制往返                                             |
| @1adybug/playground        | 使用实际工作区组件的渲染与卸载                                                |
| @1adybug/build-config      | 干净包内实际 CLI 构建、ESM / CJS 消费、声明生成、类型错误导致失败、导出幂等性 |
| @1adybug/typescript-config | TypeScript 实际解析各共享 preset 的继承设置                                   |

浏览器相关测试使用 jsdom 与 Testing Library。@1adybug/playground 测试为 jsdom 缺失的 ResizeObserver 提供观察器替身；Next 路由通过导航接口替身验证调用契约。上述测试不代表真实浏览器布局、视频播放、网络请求或所有导出 API 的完整覆盖。

新增缺陷应优先添加能复现真实问题的回归用例。测试不放入 `src`，不会出现在自动导出或发布产物中。新增源码文件的监听与生成行为通过根目录 `pnpm dev` 使用同一任务图。

## 兼容层测试

`compat/*` 复用 `tests/compatibility.ts`，每个旧包独立运行 ESM 导出引用检查、CommonJS 模块对象检查及类型契约检查。CLI 通过真实子进程检查旧命令的帮助与版本，hooks 的 ESLint 默认配置和数组类型入口也保留。实现包不复制到兼容层。

Array 兼容层同步镜像实现包的 wildcard exports，并测试 pure、global、virtual、profile 和带 .js 后缀的代表路径。公开入口审计会展开全部 wildcard，逐一验证运行时与声明文件存在。Turborepo 的类型检查和测试依赖本包 build，支持干净检出后的入口验证。
