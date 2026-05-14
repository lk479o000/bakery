# 数据库 ER 图

## 实体关系图

```mermaid
erDiagram
    %% 用户模块
    t_user ||--o{ t_address : "拥有"
    t_user ||--o{ t_cart : "添加"
    t_user ||--o{ t_order : "创建"
    t_user ||--o{ t_user_coupon : "领取"
    t_user ||--o{ t_balance_record : "产生"

    %% 商品模块
    t_category ||--o{ t_product : "包含"
    t_product ||--o{ t_cart : "被加入"
    t_product ||--o{ t_order_item : "包含"

    %% 订单模块
    t_order ||--|{ t_order_item : "包含"

    %% 营销模块
    t_coupon ||--o{ t_user_coupon : "被领取"

    %% 用户表
    t_user {
        varchar id PK "主键"
        varchar openid UK "微信openid"
        varchar nickname "用户昵称"
        varchar avatar "用户头像URL"
        varchar phone "手机号"
        int points "积分余额"
        decimal balance "账户余额"
        tinyint member_level "会员等级"
        timestamp created_at "创建时间"
        timestamp updated_at "更新时间"
    }

    %% 收货地址表
    t_address {
        varchar id PK "主键"
        varchar user_id FK "用户ID"
        varchar name "收货人姓名"
        varchar phone "收货人手机号"
        varchar province "省"
        varchar city "市"
        varchar district "区/县"
        varchar detail "详细地址"
        tinyint is_default "是否默认"
        timestamp created_at "创建时间"
    }

    %% 商品分类表
    t_category {
        varchar id PK "主键"
        varchar name "分类名称"
        varchar icon "分类图标URL"
        int sort "排序号"
        tinyint status "状态"
    }

    %% 商品表
    t_product {
        varchar id PK "主键"
        varchar category_id FK "分类ID"
        varchar name "商品名称"
        varchar description "商品描述"
        decimal price "售价"
        decimal original_price "原价"
        varchar image "商品主图URL"
        int stock "库存数量"
        tinyint status "状态"
        int sort "排序号"
        timestamp created_at "创建时间"
    }

    %% 购物车表
    t_cart {
        varchar id PK "主键"
        varchar user_id FK "用户ID"
        varchar product_id FK "商品ID"
        int quantity "商品数量"
        tinyint selected "是否选中"
        timestamp created_at "创建时间"
    }

    %% 订单表
    t_order {
        varchar id PK "主键"
        varchar user_id FK "用户ID"
        varchar order_no UK "订单编号"
        enum type "订单类型"
        tinyint status "订单状态"
        decimal total_amount "订单总金额"
        decimal discount_amount "优惠金额"
        decimal pay_amount "实付金额"
        enum pay_type "支付方式"
        varchar remark "订单备注"
        timestamp create_time "创建时间"
        timestamp pay_time "支付时间"
    }

    %% 订单商品表
    t_order_item {
        varchar id PK "主键"
        varchar order_id FK "订单ID"
        varchar product_id FK "商品ID"
        varchar product_name "商品名称"
        varchar product_image "商品图片"
        decimal price "商品单价"
        int quantity "商品数量"
    }

    %% 优惠券表
    t_coupon {
        varchar id PK "主键"
        varchar name "优惠券名称"
        enum type "优惠券类型"
        decimal value "优惠值"
        decimal min_amount "最低消费金额"
        timestamp start_time "开始时间"
        timestamp end_time "结束时间"
        int total_count "发放总量"
        int received_count "已领取数量"
        tinyint status "状态"
    }

    %% 用户优惠券表
    t_user_coupon {
        varchar id PK "主键"
        varchar user_id FK "用户ID"
        varchar coupon_id FK "优惠券ID"
        tinyint status "使用状态"
        timestamp receive_time "领取时间"
        timestamp use_time "使用时间"
    }

    %% 轮播图表
    t_banner {
        varchar id PK "主键"
        varchar image "轮播图图片URL"
        varchar link "跳转链接"
        int sort "排序号"
        tinyint status "状态"
    }

    %% 余额记录表
    t_balance_record {
        varchar id PK "主键"
        varchar user_id FK "用户ID"
        enum type "变动类型"
        decimal amount "变动金额"
        decimal balance "变动后余额"
        varchar remark "备注说明"
        timestamp create_time "创建时间"
    }
```

## 表关系说明

### 1. 用户模块关系

| 主表 | 从表 | 关系类型 | 说明 |
|------|------|----------|------|
| t_user | t_address | 1:N | 一个用户可以拥有多个收货地址 |
| t_user | t_cart | 1:N | 一个用户可以添加多个商品到购物车 |
| t_user | t_order | 1:N | 一个用户可以创建多个订单 |
| t_user | t_user_coupon | 1:N | 一个用户可以领取多张优惠券 |
| t_user | t_balance_record | 1:N | 一个用户可以产生多条余额记录 |

### 2. 商品模块关系

| 主表 | 从表 | 关系类型 | 说明 |
|------|------|----------|------|
| t_category | t_product | 1:N | 一个分类可以包含多个商品 |
| t_product | t_cart | 1:N | 一个商品可以被多个用户加入购物车 |
| t_product | t_order_item | 1:N | 一个商品可以出现在多个订单中 |

### 3. 订单模块关系

| 主表 | 从表 | 关系类型 | 说明 |
|------|------|----------|------|
| t_order | t_order_item | 1:N | 一个订单可以包含多个商品项 |

### 4. 营销模块关系

| 主表 | 从表 | 关系类型 | 说明 |
|------|------|----------|------|
| t_coupon | t_user_coupon | 1:N | 一张优惠券可以被多个用户领取 |

## 关联字段汇总

| 从表 | 外键字段 | 关联主表 | 主表字段 |
|------|----------|----------|----------|
| t_address | user_id | t_user | id |
| t_product | category_id | t_category | id |
| t_cart | user_id | t_user | id |
| t_cart | product_id | t_product | id |
| t_order | user_id | t_user | id |
| t_order_item | order_id | t_order | id |
| t_order_item | product_id | t_product | id |
| t_user_coupon | user_id | t_user | id |
| t_user_coupon | coupon_id | t_coupon | id |
| t_balance_record | user_id | t_user | id |

## 模块划分

```
┌─────────────────────────────────────────────────────────────┐
│                         用户模块                             │
│  ┌─────────┐    ┌───────────┐    ┌─────────────────────┐   │
│  │ t_user  │───<│ t_address │    │ t_balance_record    │   │
│  └────┬────┘    └───────────┘    └─────────────────────┘   │
│       │                                                      │
│       │    ┌───────────┐    ┌─────────────┐                 │
│       └───<│ t_cart    │    │ t_user_coupon│                │
│            └─────┬─────┘    └──────┬──────┘                │
│                  │                 │                        │
└──────────────────┼─────────────────┼────────────────────────┘
                   │                 │
┌──────────────────┼─────────────────┼────────────────────────┐
│                  │                 │      营销模块          │
│  商品模块         │                 │  ┌───────────┐        │
│  ┌───────────┐   │                 └─>│ t_coupon  │        │
│  │t_category │───┘                    └───────────┘        │
│  └─────┬─────┘                                              │
│        │                                                    │
│  ┌─────┴─────┐    ┌─────────────┐                          │
│  │ t_product │───<│ t_order_item│                           │
│  └───────────┘    └──────┬──────┘                          │
│                          │                                 │
│  订单模块                 │                                 │
│  ┌───────────┐           │                                 │
│  │  t_order  │<──────────┘                                 │
│  └───────────┘                                             │
│                                                            │
│  ┌───────────┐                                             │
│  │ t_banner  │                                             │
│  └───────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

## 图例说明

- **PK**: Primary Key - 主键
- **FK**: Foreign Key - 外键
- **UK**: Unique Key - 唯一键
- **1:N**: 一对多关系
- **N:M**: 多对多关系（通过中间表实现）
