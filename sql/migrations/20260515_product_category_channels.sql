-- 已有库升级：商品/分类按履约方式（自取、外卖、快递）可售开关
-- 与 t_store 的 can_pickup / can_delivery / can_express 命名一致

USE bakery;

ALTER TABLE t_category
  ADD COLUMN can_pickup TINYINT NOT NULL DEFAULT 1 COMMENT '自取场景可展示' AFTER status,
  ADD COLUMN can_delivery TINYINT NOT NULL DEFAULT 1 COMMENT '外卖场景可展示' AFTER can_pickup,
  ADD COLUMN can_express TINYINT NOT NULL DEFAULT 1 COMMENT '快递场景可展示' AFTER can_delivery;

ALTER TABLE t_product
  ADD COLUMN can_pickup TINYINT NOT NULL DEFAULT 1 COMMENT '自取可售' AFTER status,
  ADD COLUMN can_delivery TINYINT NOT NULL DEFAULT 1 COMMENT '外卖可售' AFTER can_pickup,
  ADD COLUMN can_express TINYINT NOT NULL DEFAULT 1 COMMENT '快递可售' AFTER can_delivery;
