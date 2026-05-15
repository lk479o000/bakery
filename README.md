# 吉世面包小程序

## 项目概述

吉世面包小程序是一个为面包店设计的微信小程序应用，提供在线点单、订单管理、会员服务等功能，帮助面包店提升运营效率和用户体验。

本项目包含三个核心部分：
- **微信小程序前端**：面向消费者的移动端应用
- **后端服务**：提供 API 接口和业务逻辑
- **管理后台**：Vue-Vben-Admin 管理后台系统

## 技术栈

### 微信小程序前端
- 微信小程序原生框架
- TypeScript 4.x
- SCSS

### 后端服务
- Node.js 18+ LTS
- Express 4.x
- TypeScript 4.x
- MySQL 8.0
- Redis 7.x（可选）

### 管理后台（Vue-Vben-Admin）
- Vue 3 + TypeScript
- Vite 8.x
- Naive UI
- Pinia

### 第三方服务
- 微信支付
- 微信登录
- 微信小程序API

## 项目结构

```
bakery/
├── doc/                          # 文档目录
│   ├── 1-页面结构文档.md           # 页面结构说明
│   ├── 2-数据库设计文档.md         # 数据库设计说明
│   ├── 3-ER图.md                  # 数据库ER图
│   ├── 4-接口文档.md               # API接口说明
│   ├── 5-项目目录结构.md           # 项目目录结构
│   ├── 6-技术栈文档.md             # 技术栈说明
│   └── 交互流程说明/               # 各页面交互流程
├── miniprogram/                  # 微信小程序前端
│   ├── pages/                    # 页面目录
│   ├── services/                 # API服务
│   ├── types/                    # TypeScript类型定义
│   ├── utils/                    # 工具函数
│   └── app.ts                    # 应用入口
├── server/                       # 后端服务
│   ├── controllers/              # 控制器
│   ├── middleware/               # 中间件
│   ├── models/                   # 数据模型
│   ├── routes/                   # 路由
│   ├── services/                 # 业务服务
│   └── app.ts                    # 应用入口
├── vue-vben-admin/               # Vue-Vben-Admin 管理后台
│   ├── apps/                     # 应用目录
│   │   └── web-naive/            # Naive UI 版本管理后台
│   ├── packages/                 # 共享包
│   └── playground/               # 演示页面
├── sql/                          # SQL脚本
│   ├── schema.sql                # 数据库表结构
│   └── seed.sql                  # 初始化数据
└── README.md                     # 项目说明
```

## 功能特点

### 核心功能
- **在线点单**：浏览商品、添加购物车、提交订单
- **订单管理**：查看订单列表、订单详情、订单状态
- **会员服务**：会员码、余额充值、余额明细
- **优惠券**：领取优惠券、管理我的优惠券
- **地址管理**：添加、编辑、删除收货地址
- **用户中心**：个人信息管理、联系客服、关于我们

### 技术特点
- **TypeScript**：类型安全，提升代码质量
- **模块化**：清晰的目录结构，便于维护
- **响应式**：适配不同屏幕尺寸
- **性能优化**：合理的代码结构和资源管理

## 快速开始

### 环境要求
- Node.js 18+ LTS
- pnpm 8+（管理后台依赖管理）
- MySQL 8.0+
- 微信开发者工具（小程序开发）

### 1. 后端服务启动

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 配置环境变量（复制示例配置）
cp .env.example .env

# 配置数据库连接信息（编辑 .env 文件）
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=bakery
# DB_USER=root
# DB_PASSWORD=your_password

# 初始化数据库（先创建 bakery 数据库）
mysql -h localhost -u root -p -e "CREATE DATABASE IF NOT EXISTS bakery;"
mysql -h localhost -u root -p bakery < sql/schema.sql
mysql -h localhost -u root -p bakery < sql/seed.sql

# 启动开发服务器
npm run dev
# 服务运行在 http://localhost:8150
```

### 2. 微信小程序前端

1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 在微信开发者工具中编译和预览
4. 在 `miniprogram/utils/request.ts` 中配置后端接口地址

### 3. 管理后台（Vue-Vben-Admin）

#### 前置要求

- Node.js: >= 20.19.0 || >= 22.18.0 || >= 24.0.0
- pnpm: >= 10.0.0

#### 首次部署步骤

```bash
# 进入管理后台目录
cd vue-vben-admin

# 1. 克隆官方模板仓库
# 注意：我们只提交 apps/ 目录下的自定义代码，模板代码需要从官方仓库拉取
git clone --depth=1 https://github.com/vbenjs/vue-vben-admin.git .

# 2. 添加团队仓库作为远程（替换为实际团队仓库地址）
git remote add bakery <团队仓库地址>

# 3. 拉取团队自定义代码
git fetch bakery
git merge bakery/main --allow-unrelated-histories

# 4. 安装依赖
pnpm install

# 5. 启动开发服务器（web-naive 版本）
pnpm dev:naive
# 服务运行在 http://localhost:5888
```

#### 日常开发命令

```bash
# 启动开发服务器
pnpm dev:naive

# 构建生产版本
pnpm build:naive

# 预览生产版本
pnpm preview:naive
```

#### 管理后台配置说明

管理后台默认已配置代理到后端服务：
- 前端地址：`http://localhost:5888`
- 后端接口：`http://localhost:8150`
- 代理配置：`vue-vben-admin/apps/web-naive/vite.config.ts`

**登录测试账号：**
- 用户名：`测试用户1` 或 `13900139001`
- 密码：`123456`

#### 项目结构说明

```
vue-vben-admin/
├── apps/                    # 团队自定义代码（已提交到团队仓库）
│   ├── backend-mock/        # 后端 Mock API
│   │   └── api/bakery/      # 面包店业务接口
│   └── web-naive/           # Naive UI 应用（主要业务）
│       └── src/
│           ├── api/bakery/  # 前端面包店 API
│           └── views/bakery/# 面包店业务页面
├── packages/                # 模板核心包（从官方仓库拉取）
├── internal/                # 内部工具配置（从官方仓库拉取）
├── docs/                    # 模板文档（从官方仓库拉取）
└── playground/              # 模板示例（从官方仓库拉取）
```

#### 注意事项

1. **模板代码不提交**：`packages/`, `internal/`, `docs/`, `playground/` 目录已在 `.gitignore` 中配置，不会提交到团队仓库
2. **只提交自定义代码**：只提交 `apps/` 目录下的团队业务代码
3. **更新模板**：如需更新 vue-vben-admin 模板版本，从官方仓库拉取最新代码后合并到团队分支
4. **详细说明**：请参考 `vue-vben-admin/项目部署指南.md`

## 部署说明

### 前端部署
1. 在微信开发者工具中，点击「上传」按钮
2. 登录微信公众平台，提交审核
3. 审核通过后发布

### 后端部署
1. 构建生产版本：`npm run build`
2. 配置 Nginx 反向代理
3. 使用 PM2 管理进程：`pm2 start dist/app.js`
4. 配置 HTTPS 证书

## 项目文档

- **页面结构文档**：`doc/1-页面结构文档.md`
- **数据库设计文档**：`doc/2-数据库设计文档.md`
- **ER图**：`doc/3-ER图.md`
- **接口文档**：`doc/4-接口文档.md`
- **项目目录结构**：`doc/5-项目目录结构.md`
- **技术栈文档**：`doc/6-技术栈文档.md`
- **交互流程说明**：`doc/交互流程说明/`

## 注意事项

1. **微信小程序开发**：需要有微信小程序开发者账号
2. **后端服务**：需要配置 MySQL 数据库和 Redis（可选）
3. **环境变量**：需要在 `.env` 文件中配置正确的数据库连接信息和微信小程序 appid、secret
4. **部署**：生产环境需要配置 HTTPS 证书
5. **权限**：部分功能需要用户授权，如微信登录、获取手机号等

## 开发团队

- **前端**：使用微信小程序原生框架 + TypeScript
- **后端**：使用 Node.js + Express + TypeScript
- **设计**：响应式设计，适配不同屏幕尺寸

## 许可证

MIT License

---

**吉世面包小程序** - 让面包店运营更高效，用户体验更优质！