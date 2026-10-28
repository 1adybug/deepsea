---
"@1adybug/xlsx": patch
---

修复 writeFileAsync(path, workbook, callback) 省略选项时的回调重载，同时更新 ESM、CommonJS 与三个浏览器构建，并补充跨格式读写回归测试。
