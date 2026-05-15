import express from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 用户名密码登录（不需要认证）
router.post('/login', authController.login);

// 微信登录（不需要认证）— 接收 code，后端换取 openid
router.post('/wechat-login', authController.wechatLogin);

// 手机号解密（不需要认证）— 接收 code + encryptedData + iv，一次性完成解密
router.post('/phone', authController.decryptPhone);

// 绑定手机号（需要认证）— 接收明文手机号
router.post('/bind-phone', authMiddleware, authController.bindPhone);

// 获取用户权限码（需要认证）
router.get('/codes', authMiddleware, authController.getAccessCodes);

export default router;
