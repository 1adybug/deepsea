---
"@1adybug/coordinate": patch
---

补全 CoordBase 输入类型支持；修复圆交点求解在同经度、同纬度与退化条件下的除零问题，校验有限非负距离，对无解条件返回空数组。
