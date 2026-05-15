import express from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = express.Router();

// 后台：用户分页列表（须管理员 Token）
router.get('/list', authenticateAdmin, userController.getUserListForAdmin);

// 获取用户信息（需要认证）
router.get('/info', authMiddleware, userController.getUserInfo);

// 更新用户信息（需要认证）
router.put('/info', authMiddleware, userController.updateUserInfo);

// 增加用户积分（需要认证）
router.post('/add-points', authMiddleware, userController.addPoints);

// 获取用户余额（需要认证）
router.get('/balance', authMiddleware, userController.getBalance);

// 获取会员码（需要认证）
router.get('/member-code', authMiddleware, userController.getMemberCode);

export default router;
