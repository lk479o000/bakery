-- 使用数据库
USE bakery;

-- 基础数据插入SQL

-- 初始化默认角色数据
INSERT INTO t_role (id, name, code, description) VALUES
('role_super', '超级管理员', 'super', '拥有系统最高权限'),
('role_admin', '管理员', 'admin', '拥有系统管理权限'),
('role_user', '普通用户', 'user', '拥有基础操作权限');

-- 初始化默认管理员（密码：123456）
INSERT INTO t_admin (id, username, password, nickname, status) VALUES
('admin_super', 'admin', '$2b$10$ym/V5d4eV2B9KBjMjejt3OjU/eg2oWTzZtbpZnERfioektBlUwHv6', '超级管理员', 1);

-- 给管理员分配角色（超级管理员角色）
INSERT INTO t_admin_role (admin_id, role_id) VALUES
('admin_super', 'role_super');

-- 插入商品分类（对齐线上版本）
INSERT INTO t_category (id, name, icon, sort, status, can_pickup, can_delivery, can_express) VALUES
('cat001', '甜面包', 'https://example.com/icons/sweet-bread.png', 1, 1, 1, 1, 1),
('cat002', '欧包', 'https://example.com/icons/european-bread.png', 2, 1, 1, 1, 1),
('cat003', '米面包', 'https://example.com/icons/rice-bread.png', 3, 1, 1, 1, 1),
('cat004', '甜品', 'https://example.com/icons/dessert.png', 4, 1, 1, 1, 0),
('cat005', '贝果', 'https://example.com/icons/bagel.png', 5, 1, 1, 1, 1),
('cat006', '有肉面包', 'https://example.com/icons/meat-bread.png', 6, 1, 1, 1, 0),
('cat007', '手作饼干', 'https://example.com/icons/cookie.png', 7, 1, 1, 1, 1),
('cat008', '饮品', 'https://example.com/icons/drink.png', 8, 1, 1, 1, 1);

-- 插入商品
INSERT INTO t_product (id, category_id, name, description, price, original_price, image, stock, status, can_pickup, can_delivery, can_express, sort) VALUES
('prod001', 'cat001', '原味吐司', '经典原味吐司，松软可口', 12.00, 15.00, 'https://example.com/images/bread1.jpg', 100, 1, 1, 1, 1, 1),
('prod002', 'cat001', '全麦面包', '健康全麦面包，富含膳食纤维', 15.00, 18.00, 'https://example.com/images/bread2.jpg', 80, 1, 1, 1, 1, 2),
('prod003', 'cat001', '红豆吐司', '香甜红豆吐司', 14.00, 16.00, 'https://example.com/images/bread3.jpg', 60, 1, 1, 1, 1, 3),
('prod004', 'cat002', '法式牛角包', '酥脆法式牛角包', 18.00, 22.00, 'https://example.com/images/croissant.jpg', 50, 1, 1, 1, 0, 1),
('prod005', 'cat002', '全麦欧包', '外酥里软的全麦欧包', 22.00, 26.00, 'https://example.com/images/european-bread.jpg', 40, 1, 1, 1, 0, 2),
('prod006', 'cat003', '米面包', '日式米面包，Q弹口感', 16.00, 19.00, 'https://example.com/images/rice-bread.jpg', 45, 1, 1, 1, 1, 1),
('prod007', 'cat004', '草莓蛋糕', '新鲜草莓蛋糕，口感细腻', 38.00, 45.00, 'https://example.com/images/cake1.jpg', 50, 1, 1, 1, 0, 1),
('prod008', 'cat004', '巧克力蛋糕', '浓郁巧克力蛋糕，香甜可口', 42.00, 48.00, 'https://example.com/images/cake2.jpg', 40, 1, 1, 1, 0, 2),
('prod009', 'cat005', '原味贝果', '经典原味贝果', 12.00, 14.00, 'https://example.com/images/bagel.jpg', 60, 1, 1, 1, 1, 1),
('prod010', 'cat005', '芝士贝果', '香浓芝士贝果', 15.00, 18.00, 'https://example.com/images/cheese-bagel.jpg', 50, 1, 1, 1, 1, 2),
('prod011', 'cat006', '火腿蛋三明治', '火腿鸡蛋三明治', 20.00, 24.00, 'https://example.com/images/sandwich.jpg', 30, 1, 1, 1, 0, 1),
('prod012', 'cat006', '培根面包', '培根芝士面包', 18.00, 22.00, 'https://example.com/images/bacon-bread.jpg', 40, 1, 1, 1, 0, 2),
('prod013', 'cat007', '曲奇饼干', '酥脆曲奇饼干，香甜可口', 25.00, 30.00, 'https://example.com/images/cookie.jpg', 120, 1, 1, 1, 1, 1),
('prod014', 'cat007', '蔓越莓饼干', '酸甜蔓越莓饼干', 28.00, 32.00, 'https://example.com/images/cranberry-cookie.jpg', 100, 1, 1, 1, 1, 2),
('prod015', 'cat008', '美式咖啡', '经典美式咖啡，提神醒脑', 18.00, 22.00, 'https://example.com/images/coffee.jpg', 200, 1, 1, 1, 1, 1),
('prod016', 'cat008', '珍珠奶茶', '香甜珍珠奶茶，口感丰富', 15.00, 18.00, 'https://example.com/images/milk-tea.jpg', 150, 1, 1, 1, 1, 2);

-- 插入优惠券
INSERT INTO t_coupon (id, name, type, value, min_amount, start_time, end_time, total_count, received_count, status) VALUES
('coupon001', '新人满减券', 'full_reduction', 10.00, 50.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1000, 0, 1),
('coupon002', '全场8折券', 'discount', 0.80, 0.00, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 500, 0, 1),
('coupon003', '面包类满减券', 'full_reduction', 5.00, 30.00, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 800, 0, 1);

-- 插入轮播图
INSERT INTO t_banner (id, image, link, sort, status) VALUES
('banner001', 'https://example.com/images/banner1.jpg', '/pages/index/index', 1, 1),
('banner002', 'https://example.com/images/banner2.jpg', '/pages/coupon/coupon', 2, 1),
('banner003', 'https://example.com/images/banner3.jpg', '/pages/recharge/recharge', 3, 1);

-- 插入门店
INSERT INTO t_store (id, name, address, phone, business_hours, latitude, longitude, is_open, can_delivery, can_pickup, can_express, sort, status) VALUES
('store001', '吉世面包·春熙路店', '成都市锦江区春熙路步行街128号', '028-86668888', '08:00-22:00', 30.6578, 104.0668, 1, 1, 1, 0, 1, 1),
('store002', '吉世面包·太古里店', '成都市锦江区太古里南区B1层', '028-86669999', '09:00-22:30', 30.6598, 104.0708, 1, 1, 1, 0, 2, 1),
('store003', '吉世面包·高新区店', '成都市高新区天府大道中段1号', '028-85556666', '08:30-21:30', 30.5738, 104.0158, 1, 0, 1, 0, 3, 1),
('store004', '吉世面包·宽窄巷子店', '成都市青羊区宽窄巷子景区内', '028-86667777', '09:00-21:00', 30.6658, 104.0388, 1, 0, 1, 0, 4, 1),
('store005', '吉世面包·环球中心店', '成都市高新区环球中心E区', '028-85558888', '10:00-22:00', 30.5588, 104.0568, 1, 1, 1, 0, 5, 1);

-- 插入充值套餐
INSERT INTO t_recharge_package (id, name, amount, gift_amount, is_recommended, description, sort, status) VALUES
('pkg001', '储200送20', 200.00, 20.00, 1, '充值200元赠送20元，共220元', 1, 1),
('pkg002', '储300送40', 300.00, 40.00, 0, '充值300元赠送40元，共340元', 2, 1),
('pkg003', '储500送80', 500.00, 80.00, 0, '充值500元赠送80元，共580元', 3, 1),
('pkg004', '储1000送200', 1000.00, 200.00, 0, '充值1000元赠送200元，共1200元', 4, 1);

-- 插入管理员账号（模拟数据）
INSERT INTO t_user (id, openid, nickname, avatar, phone, points, balance, member_level) VALUES
('admin001', 'admin_openid', '管理员', 'https://example.com/avatars/admin.jpg', '13800138000', 9999, 9999.99, 9);

-- 插入测试用户（模拟数据）
INSERT INTO t_user (id, openid, nickname, avatar, phone, points, balance, member_level) VALUES
('user001', 'test_openid_1', '测试用户1', 'https://example.com/avatars/user1.jpg', '13900139001', 100, 50.00, 1),
('user002', 'test_openid_2', '测试用户2', 'https://example.com/avatars/user2.jpg', '13900139002', 200, 100.00, 1);

-- 插入测试地址（模拟数据）
INSERT INTO t_address (id, user_id, name, phone, province, city, district, detail, is_default) VALUES
('addr001', 'user001', '张三', '13900139001', '北京市', '北京市', '朝阳区', '建国路88号', 1),
('addr002', 'user001', '李四', '13900139002', '上海市', '上海市', '浦东新区', '世纪大道100号', 0),
('addr003', 'user002', '王五', '13900139003', '广州市', '广州市', '天河区', '天河路385号', 1);

-- 插入测试购物车（模拟数据）
INSERT INTO t_cart (id, user_id, product_id, quantity, selected) VALUES
('cart001', 'user001', 'prod001', 2, 1),
('cart002', 'user001', 'prod015', 1, 1),
('cart003', 'user002', 'prod007', 1, 1),
('cart004', 'user002', 'prod013', 2, 0);

-- 插入测试订单（模拟数据）
INSERT INTO t_order (id, user_id, order_no, type, status, total_amount, discount_amount, pay_amount, pay_type, remark) VALUES
('order001', 'user001', 'ORD20260324001', 'store', 4, 42.00, 5.00, 37.00, 'wechat', '少放糖'),
('order002', 'user001', 'ORD20260324002', 'recharge', 1, 100.00, 0.00, 100.00, 'wechat', '充值'),
('order003', 'user002', 'ORD20260324003', 'store', 1, 70.00, 10.00, 60.00, 'balance', '');

-- 插入测试订单商品（模拟数据）
INSERT INTO t_order_item (id, order_id, product_id, product_name, product_image, price, quantity) VALUES
('order_item001', 'order001', 'prod001', '原味吐司', 'https://example.com/images/bread1.jpg', 12.00, 2),
('order_item002', 'order001', 'prod015', '美式咖啡', 'https://example.com/images/coffee.jpg', 18.00, 1),
('order_item003', 'order003', 'prod007', '草莓蛋糕', 'https://example.com/images/cake1.jpg', 38.00, 1),
('order_item004', 'order003', 'prod013', '曲奇饼干', 'https://example.com/images/cookie.jpg', 25.00, 1),
('order_item005', 'order003', 'prod016', '珍珠奶茶', 'https://example.com/images/milk-tea.jpg', 15.00, 1);

-- 插入测试用户优惠券（模拟数据）
INSERT INTO t_user_coupon (id, user_id, coupon_id, status, receive_time) VALUES
('user_coupon001', 'user001', 'coupon001', 0, NOW()),
('user_coupon002', 'user001', 'coupon002', 1, NOW()),
('user_coupon003', 'user002', 'coupon001', 0, NOW()),
('user_coupon004', 'user002', 'coupon003', 0, NOW());

-- 插入测试余额记录（模拟数据）
INSERT INTO t_balance_record (id, user_id, type, amount, balance, remark) VALUES
('balance_record001', 'user001', 'recharge', 100.00, 150.00, '充值'),
('balance_record002', 'user001', 'consume', -37.00, 113.00, '订单支付：ORD20260324001'),
('balance_record003', 'user002', 'recharge', 50.00, 150.00, '充值'),
('balance_record004', 'user002', 'consume', -60.00, 90.00, '订单支付：ORD20260324003');