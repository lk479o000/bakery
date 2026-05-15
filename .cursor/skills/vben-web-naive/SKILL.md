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

## 参考文档（站外）

- [组件总览与说明](https://doc.vben.pro/components/introduction.html)
- [国际化（指南）](https://doc.vben.pro/guide/in-depth/locale.html)
