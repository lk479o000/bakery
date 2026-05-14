-- 删除数据库（如果存在）
DROP DATABASE IF EXISTS bakery;

-- 创建数据库（指定字符集和排序规则）
CREATE DATABASE bakery 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE bakery;

-- 数据库建表SQL

-- 用户表
CREATE TABLE t_user (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，用户唯一标识',
    openid VARCHAR(64) UNIQUE NOT NULL COMMENT '微信openid',
    nickname VARCHAR(64) COMMENT '用户昵称',
    avatar VARCHAR(255) COMMENT '用户头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    points INT DEFAULT 0 COMMENT '积分余额',
    balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额（元）',
    member_level TINYINT DEFAULT 1 COMMENT '会员等级：1-普通会员',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表';

-- 收货地址表
CREATE TABLE t_address (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，地址唯一标识',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID，关联t_user.id',
    name VARCHAR(32) NOT NULL COMMENT '收货人姓名',
    phone VARCHAR(20) NOT NULL COMMENT '收货人手机号',
    province VARCHAR(32) NOT NULL COMMENT '省',
    city VARCHAR(32) NOT NULL COMMENT '市',
    district VARCHAR(32) NOT NULL COMMENT '区/县',
    detail VARCHAR(255) NOT NULL COMMENT '详细地址',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认地址：0-否，1-是',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引'
) COMMENT='收货地址表';

-- 商品分类表
CREATE TABLE t_category (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，分类唯一标识',
    name VARCHAR(32) NOT NULL COMMENT '分类名称',
    icon VARCHAR(255) COMMENT '分类图标URL',
    sort INT DEFAULT 0 COMMENT '排序号，越小越靠前',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用'
) COMMENT='商品分类表';

-- 商品表
CREATE TABLE t_product (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，商品唯一标识',
    category_id VARCHAR(32) NOT NULL COMMENT '分类ID，关联t_category.id',
    name VARCHAR(64) NOT NULL COMMENT '商品名称',
    description VARCHAR(255) COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '售价（元）',
    original_price DECIMAL(10,2) COMMENT '原价（元）',
    image VARCHAR(255) COMMENT '商品主图URL',
    stock INT DEFAULT 0 COMMENT '库存数量',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
    sort INT DEFAULT 0 COMMENT '排序号，越小越靠前',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_category_id (category_id) COMMENT '分类ID索引'
) COMMENT='商品表';

-- 购物车表
CREATE TABLE t_cart (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，购物车项唯一标识',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID，关联t_user.id',
    product_id VARCHAR(32) NOT NULL COMMENT '商品ID，关联t_product.id',
    quantity INT DEFAULT 1 COMMENT '商品数量',
    selected TINYINT DEFAULT 1 COMMENT '是否选中：0-否，1-是',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_product (user_id, product_id) COMMENT '用户商品唯一索引',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引'
) COMMENT='购物车表';

-- 订单表
CREATE TABLE t_order (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，订单唯一标识',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID，关联t_user.id',
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单编号',
    type ENUM('store','recharge','payment','coupon') DEFAULT 'store' COMMENT '订单类型：store-门店订单，recharge-储值订单，payment-买单订单，coupon-券包订单',
    status TINYINT DEFAULT 0 COMMENT '订单状态：0-待支付，1-已支付，2-制作中，3-待取餐，4-已完成，5-已取消',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额（元）',
    discount_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额（元）',
    pay_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额（元）',
    pay_type ENUM('wechat','balance') COMMENT '支付方式：wechat-微信支付，balance-余额支付',
    remark VARCHAR(255) COMMENT '订单备注',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    pay_time TIMESTAMP NULL COMMENT '支付时间',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_order_no (order_no) COMMENT '订单编号索引'
) COMMENT='订单表';

-- 订单商品表
CREATE TABLE t_order_item (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，订单商品唯一标识',
    order_id VARCHAR(32) NOT NULL COMMENT '订单ID，关联t_order.id',
    product_id VARCHAR(32) NOT NULL COMMENT '商品ID，关联t_product.id',
    product_name VARCHAR(64) NOT NULL COMMENT '商品名称（快照）',
    product_image VARCHAR(255) COMMENT '商品图片（快照）',
    price DECIMAL(10,2) NOT NULL COMMENT '商品单价（元）',
    quantity INT NOT NULL COMMENT '商品数量',
    INDEX idx_order_id (order_id) COMMENT '订单ID索引'
) COMMENT='订单商品表';

-- 优惠券表
CREATE TABLE t_coupon (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，优惠券唯一标识',
    name VARCHAR(64) NOT NULL COMMENT '优惠券名称',
    type ENUM('full_reduction','discount') NOT NULL COMMENT '优惠券类型：full_reduction-满减券，discount-折扣券',
    value DECIMAL(10,2) NOT NULL COMMENT '优惠值：满减券为减免金额，折扣券为折扣率',
    min_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低消费金额（元）',
    start_time TIMESTAMP NOT NULL COMMENT '开始时间',
    end_time TIMESTAMP NOT NULL COMMENT '结束时间',
    total_count INT DEFAULT 0 COMMENT '发放总量',
    received_count INT DEFAULT 0 COMMENT '已领取数量',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用'
) COMMENT='优惠券表';

-- 用户优惠券表
CREATE TABLE t_user_coupon (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，用户优惠券唯一标识',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID，关联t_user.id',
    coupon_id VARCHAR(32) NOT NULL COMMENT '优惠券ID，关联t_coupon.id',
    status TINYINT DEFAULT 0 COMMENT '使用状态：0-未使用，1-已使用，2-已过期',
    receive_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
    use_time TIMESTAMP NULL COMMENT '使用时间',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引'
) COMMENT='用户优惠券表';

-- 轮播图表
CREATE TABLE t_banner (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，轮播图唯一标识',
    image VARCHAR(255) NOT NULL COMMENT '轮播图图片URL',
    link VARCHAR(255) COMMENT '跳转链接',
    sort INT DEFAULT 0 COMMENT '排序号，越小越靠前',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用'
) COMMENT='轮播图表';

-- 余额记录表
CREATE TABLE t_balance_record (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，记录唯一标识',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID，关联t_user.id',
    type ENUM('recharge','consume','refund') NOT NULL COMMENT '变动类型：recharge-充值，consume-消费，refund-退款',
    amount DECIMAL(10,2) NOT NULL COMMENT '变动金额（元），正数为增加，负数为减少',
    balance DECIMAL(10,2) NOT NULL COMMENT '变动后余额（元）',
    remark VARCHAR(255) COMMENT '备注说明',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引'
) COMMENT='余额记录表';

-- 门店表
CREATE TABLE t_store (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，门店唯一标识',
    name VARCHAR(64) NOT NULL COMMENT '门店名称',
    address VARCHAR(255) NOT NULL COMMENT '门店地址',
    phone VARCHAR(20) COMMENT '联系电话',
    business_hours VARCHAR(32) COMMENT '营业时间',
    latitude DECIMAL(10,6) NOT NULL COMMENT '纬度',
    longitude DECIMAL(10,6) NOT NULL COMMENT '经度',
    is_open TINYINT DEFAULT 1 COMMENT '营业状态：0-休息中，1-营业中',
    can_delivery TINYINT DEFAULT 0 COMMENT '可外送',
    can_pickup TINYINT DEFAULT 1 COMMENT '可自取',
    can_express TINYINT DEFAULT 0 COMMENT '可快递',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='门店表';

-- 充值套餐表
CREATE TABLE t_recharge_package (
    id VARCHAR(32) PRIMARY KEY COMMENT '主键，充值套餐唯一标识',
    name VARCHAR(64) NOT NULL COMMENT '活动名称',
    amount DECIMAL(10,2) NOT NULL COMMENT '充值金额',
    gift_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '赠送金额',
    is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐',
    description VARCHAR(255) COMMENT '活动描述',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='充值套餐表';