import express from 'express';
import balanceController from '../controllers/balance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 充值余额（需要认证）
router.post('/recharge', authMiddleware, balanceController.recharge);

// 消费余额（需要认证）
router.post('/consume', authMiddleware, balanceController.consume);

// 退款（需要认证）
router.post('/refund', authMiddleware, balanceController.refund);

// 获取余额记录（需要认证）
router.get('/records', authMiddleware, balanceController.getBalanceRecords);

// 获取用户余额（需要认证）
router.get('/info', authMiddleware, balanceController.getBalance);

export default router;