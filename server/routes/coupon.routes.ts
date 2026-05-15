import express from 'express';
import couponController from '../controllers/coupon.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = express.Router();

// 后台：优惠券分页列表
router.get('/list', authenticateAdmin, couponController.getCouponListForAdmin);

// 获取可用优惠券列表（不需要认证）
router.get('/available', couponController.getAvailableCoupons);

// 获取优惠券详情（不需要认证）
router.get('/detail/:id', couponController.getCouponDetail);

// 检查优惠券是否可用（不需要认证）
router.post('/check', couponController.checkCoupon);

// 计算优惠券折扣金额（不需要认证）
router.post('/calculate', couponController.calculateDiscount);

export default router;