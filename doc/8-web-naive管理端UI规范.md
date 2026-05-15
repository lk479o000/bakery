# Web-Naive 管理端 UI 约定（面包店模块）

本文档与 Cursor Skill **`.cursor/skills/vben-web-naive/SKILL.md`** 同步说明：在 `vue-vben-admin/apps/web-naive` 中开发面包店后台时的统一交互。

## 弹窗内嵌表单（列表页新建 / 编辑）

当页面同时使用 **`useVbenModal`** 与 **`useVbenForm`** 时：

| 约定 | 说明 |
|------|------|
| 表单 `showDefaultActions` | 设为 **`false`**，隐藏表单默认「提交 / 重置」，避免与弹窗底部按钮重复。 |
| 弹窗 `fullscreenButton` | 设为 **`false`**（按需可改）。 |
| 弹窗 `onCancel` | 调用 **`modalApi.close()`**（与当前页的 modal API 变量名一致）。 |
| 弹窗 `onConfirm` | **`await formApi.validateAndSubmitForm()`**，与「提交」等价并走校验。 |
| 业务提交 | 仍在表单的 **`handleSubmit`** 中写接口调用、提示、关弹窗、刷新表格。 |

官方示例路径（同仓库）：`vue-vben-admin/apps/web-naive/src/views/demos/form/modal.vue`。

## 已对齐的页面

`src/views/bakery/`：**banner、category、coupon、product、recharge、store**；**order**（仅「更新订单状态」弹窗）；**user**（仅「余额充值」弹窗）。仅展示、无表单的弹窗（如订单详情、用户详情）不适用上表。

## 维护说明

新增同类「弹窗 + 表单」CRUD 页时，请按上表实现；修改交互规范时，请同时更新 **本文件** 与 **`.cursor/skills/vben-web-naive/SKILL.md`** 中「弹窗 + 表单」一节，避免文档漂移。
