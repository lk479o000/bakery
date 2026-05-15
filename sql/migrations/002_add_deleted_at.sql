-- 软删除迁移：为需要软删除的业务表增加 deleted_at 字段
-- 参见 doc/7-软删除与文件上传设计文档.md

USE bakery;

-- ========== t_order 订单表 ==========
ALTER TABLE t_order ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER pay_time;

-- ========== t_user 用户表 ==========
ALTER TABLE t_user ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER updated_at;

-- ========== t_product 商品表 ==========
ALTER TABLE t_product ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER created_at;

-- ========== t_category 分类表 ==========
ALTER TABLE t_category ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER can_express;

-- ========== t_coupon 优惠券表 ==========
ALTER TABLE t_coupon ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER status;

-- ========== t_balance_record 余额记录表 ==========
ALTER TABLE t_balance_record ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER create_time;

-- ========== t_store 门店表 ==========
ALTER TABLE t_store ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER created_at;

-- ========== t_banner 轮播图表 ==========
ALTER TABLE t_banner ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER status;

-- ========== t_recharge_package 充值套餐表 ==========
ALTER TABLE t_recharge_package ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER created_at;

-- ========== t_address 收货地址表 ==========
ALTER TABLE t_address ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER created_at;

-- ========== t_admin 管理员表 ==========
ALTER TABLE t_admin ADD COLUMN deleted_at TIMESTAMP NULL COMMENT '删除时间（软删除）' AFTER updated_at;
