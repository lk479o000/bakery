import express from 'express';
import orderController from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 创建订单（需要认证）
router.post('/create', authMiddleware, orderController.createOrder);

// 支付订单（需要认证）
router.post('/pay', authMiddleware, orderController.payOrder);

// 获取订单列表（需要认证）
router.get('/list', authMiddleware, orderController.getOrderList);

// 获取订单详情（需要认证）
router.get('/detail/:id', authMiddleware, orderController.getOrderDetail);

// 取消订单（需要认证）
router.post('/cancel', authMiddleware, orderController.cancelOrder);

export default router;