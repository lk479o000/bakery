import express from 'express';
import addressController from '../controllers/address.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 获取用户地址列表（需要认证）
router.get('/list', authMiddleware, addressController.getAddressList);

// 获取默认地址（需要认证）
router.get('/default', authMiddleware, addressController.getDefaultAddress);

// 获取地址详情（需要认证）
router.get('/detail/:id', authMiddleware, addressController.getAddressDetail);

// 创建地址（需要认证）
router.post('/create', authMiddleware, addressController.createAddress);

// 更新地址（需要认证）
router.put('/update/:id', authMiddleware, addressController.updateAddress);

// 删除地址（需要认证）
router.delete('/delete/:id', authMiddleware, addressController.deleteAddress);

// 设置默认地址（需要认证）
router.post('/set-default', authMiddleware, addressController.setDefaultAddress);

export default router;