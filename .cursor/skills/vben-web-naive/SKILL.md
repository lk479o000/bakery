---
name: vben-web-naive
description: >-
  Vben Admin 5.x web-naive app in this repo (vue-vben-admin/apps/web-naive).
  Covers framework components (Page, Modal, Form, Vxe grid), i18n key prefixes,
  bakery routes, and Naive UI. Use when editing web-naive, Vben layouts, router
  modules under apps/web-naive, or bakery views/API.
---

# Vben web-naive（本项目）

官方组件与概念见 [Vben 组件介绍](https://doc.vben.pro/components/introduction.html) 与站内各组件页（Page、Modal、Form、[Vxe Table 表格](https://doc.vben.pro/components/introduction.html) 等）。本 skill 只记 **本仓库里容易踩坑的差异**。

## 运行与入口

- 在 `vue-vben-admin` 下：`pnpm --filter @vben/web-naive dev`
- 源码：`vue-vben-admin/apps/web-naive/src/`
- 路径别名：`#/*` → `src/*`

## 国际化

- 应用文案：`src/locales/langs/<语言>/*.json`；`loadLocalesMapFromDir` 会把 **文件名当作一层命名空间**（如 `page.json` → 键前缀 `page.`）。
- 路由 `meta.title` 须与 JSON 一致，例如 `page.bakery.banner`，不要写 `bakery.banner`。

## 表格（Vxe）

- `src/adapter/vxe-table.ts` 导出的是 **`useVbenVxeGrid`**（来自 `@vben/plugins/vxe-table`）。
- 业务里若使用 **`useVbenTable`**，实现见 `src/adapter/use-vben-table.ts`（对 `useVbenVxeGrid` 的封装），从 `#/adapter/vxe-table` 一并导出。
- 列表页模板里用 **`<Grid />`**（或 `PascalCase` 组件名），不要用 `<table />`（会变成原生 HTML 表）。

## 路由与布局（重要）

- 带 **子路由的菜单分组** 若父级没有 component，`@vben/access` 在挂到根路由时可能删掉父级 `component`，导致 matched 链上出现无组件父节点，进而 Router 更新报错（如 `null` 上读 `component`）。
- **做法**：父级使用仅含 `<RouterView />` 的布局（如 `layouts/route-view.vue`），并在 `meta` 上设置 **`keepParentView: true`**；`packages/effects/access/src/accessible.ts` 中已对带该标记的父路由 **保留** `component`。面包店模块见 `router/routes/modules/bakery.ts`。

## Naive UI

- `useDialog`（如 `use-vben-table` 里的确认框）需在应用根提供 **`NDialogProvider`**（`src/app.vue` 已包裹 `RouterView`）。

## 弹窗 + 表单（面包店 CRUD 统一规范）

列表页里 **`useVbenModal` 内嵌 `useVbenForm`**（新建/编辑）时按同一套写，避免底部出现「提交 / 重置」与「确认 / 取消」两套按钮，并保证「确认」会触发表单校验与提交。

1. **`useVbenForm`**：设置 **`showDefaultActions: false`**，由弹窗底部按钮驱动提交。
2. **`useVbenModal`**：设置 **`fullscreenButton: false`**；**`onCancel`** 里 `modalApi.close()`（变量名与页面一致）；**`onConfirm`** 里 `await formApi.validateAndSubmitForm()`（与内嵌表单对应的 `formApi` 一致）。
3. **`handleSubmit`**：仍写在 `useVbenForm` 里，负责调 API、`message`、关弹窗、`tableAction.refresh()` 等；**`onOpenChange`** 里 `resetForm` + `setValues` 的初始化逻辑保持不变。

参考实现：同应用内 **`src/views/demos/form/modal.vue`**（官方内嵌表单示例）。已按此规范对齐的面包店页面：`views/bakery/` 下的 **banner、category、coupon、product、recharge、store**，以及 **order**（更新状态弹窗）、**user**（余额充值弹窗）。纯展示、无表单的弹窗（如订单详情、用户详情）不在此列。

## 参考文档（站外）

- [组件总览与说明](https://doc.vben.pro/components/introduction.html)
- [国际化（指南）](https://doc.vben.pro/guide/in-depth/locale.html)
