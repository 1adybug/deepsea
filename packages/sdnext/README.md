# sdnext

`sdnext` 是一个面向 `Next.js` 项目的轻量生成工具，用来基于 `shared/**` 自动生成 `actions/**`、`app/api/actions/**/route.ts`，以及基于 `actions/**` 生成 `hooks/**`。

## 约定

### shared -> action

`shared/addUser.ts`

```ts
export async function addUser() {}
```

会生成：

`actions/addUser.ts`

```ts
"use server"

import { createResponseFn } from "@/server/createResponseFn"

import { addUser } from "@/shared/addUser"

export const addUserAction = createResponseFn(addUser)
```

### shared -> route

如果源函数显式声明了 `route` 元数据：

```ts
export async function addUser() {}

addUser.route = true
```

或：

```ts
export async function addUser() {}

addUser.route = {}
```

会额外生成：

`app/api/actions/add-user/route.ts`

```ts
import { createRoute } from "@/server/createResponseFn"

import { addUser } from "@/shared/addUser"

export const { POST } = createRoute(addUser)
```

默认情况下，`fn.route` 视为 `false`，不会生成 route。

### actions -> hook

执行 `sdnext hook` 后，会根据 `actions/**` 生成 `hooks/**`。

命名规则：

- `getUser` 默认识别为 `get`
- `queryUser` 默认识别为 `query`
- 其他函数默认识别为 `mutation`

## 命令

### build

```bash
sdnext build next build
```

执行顺序：

1. 同步生成 `actions/**`
2. 根据 `fn.route` 同步生成 `app/api/actions/**`
3. 再执行后续命令

### dev

```bash
sdnext dev next dev
```

行为与 `build` 类似，但会额外监听 `shared/**` 的新增、修改、删除，并实时同步生成物。

### hook

```bash
sdnext hook
```

扫描 `actions/**` 并交互式生成或覆盖 `hooks/**`。

## 路径映射

- `shared/addUser.ts` -> `actions/addUser.ts`
- `shared/addUser.ts` -> `app/api/actions/add-user/route.ts`
- `shared/admin/addUser.ts` -> `actions/admin/addUser.ts`
- `shared/admin/addUser.ts` -> `app/api/actions/admin/add-user/route.ts`

## 说明

- 只处理 `.ts`、`.tsx`、`.js`、`.jsx`
- 生成文件会做幂等比较，内容未变化时不会重复写入
- 删除 `shared` 文件或移除 `fn.route` 后，对应生成物会自动清理
- `sdnext build` 和 `sdnext dev` 会自动把 `actions/**` 与 `app/api/actions/**` 写入 `.vscode/settings.json` 的 `files.exclude`
