# 测试指南

[English](TESTING.md) | [简体中文](TESTING.zh-CN.md)

所有 40 个工作区包都有可执行测试任务。运行时测试、类型契约、构建消费与兼容入口检查分别验证不同边界，不能互相替代。

## 命令

```sh
pnpm test
pnpm test:types
pnpm test:coverage
pnpm check

# Focus on one package after building its prerequisites
pnpm --filter @1adybug/components... build
pnpm --filter @1adybug/components test
pnpm --filter @1adybug/components test:types
```

## 测试矩阵

| 包                                                              | 主要验证场景                                                                                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@1adybug/array`](packages/array/tests)                        | 逐项覆盖 ArrayFunctions、稀疏数组、类数组、species、参数转换、无效输入、原型安装、纯函数与全局隔离、生成入口解析及打包。                                             |
| [`@1adybug/tools`](packages/tools/tests)                        | 解析器、枚举映射、对象与集合引用、树遍历、分页边界、中间件顺序、验证失败、存储事件、Cookie、下载、工作表转换、受控随机边界和帧取消。                                 |
| [`@1adybug/types`](packages/types/tests)                        | 全部导出的类型工具：正反类型相等断言、联合类型可选性、JSON 结构、严格键、只读赋值错误、查询与表单转换、元组边界和参数可选性。                                        |
| [`@1adybug/store`](packages/store/tests)                        | 惰性初始化、合并与替换、Object.is 无效更新、选择器、订阅、服务端渲染、自定义编解码、损坏数据、异步恢复竞争与存储失败。                                               |
| [`@1adybug/hooks`](packages/hooks/tests)                        | 各 Hook 的状态、引用与生命周期契约，重复查询值、存储区域、依赖变化、监听器更新、拖拽与长按取消、观察器清理、播放重试、ETag 变化和媒体监测。                          |
| [`@1adybug/react`](packages/react/tests)                        | 基本值、嵌套可迭代对象、无效值、标记转义、bigint 转换和无效子节点诊断。                                                                                              |
| [`@1adybug/components`](packages/components/tests)              | 全部公开组件及辅助函数：DOM 与属性行为、测量、交互、引用、定时器、文件失败、剪贴板、图表更新与销毁、媒体恢复与清理。第三方渲染引擎和 WebRTC 协商在集成边界使用替身。 |
| [`@1adybug/coordinate`](packages/coordinate/tests)              | 构造函数重载、格式错误、固定转换参考值、转换往返、距离对称与范围、线段接触、自相交及区域包含与排除。                                                                 |
| [`@1adybug/node`](packages/node/tests)                          | 真实临时文件复制与二进制流保存、缺失路径与写入失败、源流错误、子进程退出与错误、命令输出编码、归档内容，以及无需安装 7-Zip 的参数构造测试。                          |
| [`@1adybug/antd`](packages/antd/tests)                          | 选择过滤及失效值处理、搜索回调、Theme 范围、表单订阅、树勾选与无输入污染的选择、滚动测量、Schema 失败、日期边界与渲染工作表。                                        |
| [`@1adybug/heroui`](packages/heroui/tests)                      | 每个字段适配器的空值、取值、变更、失焦与错误契约，枚举工厂及字段绑定、清空选择、嵌套 Provider 隔离、日期及范围引用、Toast 生命周期和更新通知。                       |
| [`@1adybug/tanstack-form`](packages/tanstack-form/tests)        | 字段注入、组件映射、上下文刷新、变更及失焦与额外属性转发，以及空错误与有效错误数组。                                                                                 |
| [`@1adybug/tanstack-query`](packages/tanstack-query/tests)      | 真实 QueryClient 缓存、参数变化、选择、初始与禁用状态、错误引用、Client 覆盖、派生配置、查询 Hook 注入和变更成功、错误与结束回调顺序。                               |
| [`@1adybug/next`](packages/next/tests)                          | 参数编码、路由变化后的函数式更新、setter 引用、push 与 replace 选项、查询状态委托，以及模拟 Next 导航边界下的 Navigate 行为。                                        |
| [`@1adybug/react-router`](packages/react-router/tests)          | 真实 MemoryRouter 更新、其他参数保留、重复值解析、删除、替换和注入适配器选项。                                                                                       |
| [`@1adybug/react-router-cli`](packages/react-router-cli/tests)  | 临时项目中的路由生成、自定义路径、别名、错误边界、惰性及数据路由、优先级、稳定修改时间、监听合并与恢复、Vite 重载及销毁、Rsbuild 生命周期。                          |
| [`@1adybug/next-cli`](packages/next-cli/tests)                  | 独立临时项目的 Action 与路由生成、注册表排序、相对与别名导入、忽略资源、旧产物移除、目录清理、无变化时修改时间和 CLI 帮助及版本。                                    |
| [`@1adybug/tailwind`](packages/tailwind/tests)                  | 通过真实 PostCSS 与 Tailwind 编译验证各工具类、背景尺寸主题扩展和变体生成。                                                                                          |
| [`@1adybug/xlsx`](tests/xlsx.test.mjs)                          | 覆盖 ESM 与 CommonJS：二进制及多格式往返、地址边界、工作表编辑、元数据、CSV 与 HTML 转义、文件读写、流输出、格式化和复合文档容器。                                   |
| [`@1adybug/build-config`](tooling/build-config/tests)           | 独立包构建和 ESM/CJS 消费、声明错误失败、构建目标与 React 检测、导出过滤和稳定输出。                                                                                 |
| [`@1adybug/typescript-config`](tooling/typescript-config/tests) | 通过编译器验证全部预设的继承、消费方覆盖和真实严格空值检查诊断。                                                                                                     |
| compat/*                                                        | 每个包的转发代码、声明、依赖与 peer、ESM/CJS 引用、CLI 和代表性通配入口                                                                                              |
| apps/playground                                                 | 真实工作区组件挂载、DOM 与观察器释放                                                                                                                                 |

## 类型测试

Vitest 中的 expectTypeOf 在运行时不验证类型；pnpm test:types 使用 TypeScript 编译所有测试和类型用例，并验证 @ts-expect-error。类型工具应包含正确推导和错误用法，组件泛型需覆盖值类型、选择模式和回调参数。

## 覆盖率

pnpm test:coverage 为自有 TypeScript 包及 playground 生成 package/coverage/index.html 和 coverage-summary.json。报告包含未执行的源码，排除声明文件及自动生成的 Array 转发入口。XLSX 第三方实现和私有 MJS 工具使用 Node 测试；兼容包通过独立入口测试验证，不重复统计实现覆盖率。覆盖率是查漏工具，不是测试质量或完整性的充分证明。

## 隔离与验证边界

文件与生成器测试使用独立临时目录并清理产物，进程测试设置超时；时间与随机边界使用受控输入。React 测试卸载组件并检查监听器、定时器和观察器释放。网络、剪贴板、图表引擎和媒体协商在外部边界使用替身，库自身的状态和适配逻辑仍真实执行。自动化不替代视觉排版、真实浏览器媒体、实际服务、跨设备或无障碍人工验收。

## 添加测试

先确定公开对象的输入、状态变化、结果和副作用，再选择能区分正确与错误实现的场景。覆盖合理边界、失败传播、更新和清理；只对真正不同的输入语义使用参数化用例。共享别名验证引用和类型，复用实际实现的行为测试。每次修复至少保留一个在原缺陷上失败的回归测试。避免仅导入检查、重复实现算法或为数量重复相同断言。
