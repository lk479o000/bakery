import express from 'express';
import cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 获取购物车列表（需要认证）
router.get('/list', authMiddleware, cartController.getCartList);

// 添加商品到购物车（需要认证）
router.post('/add', authMiddleware, cartController.addToCart);

// 更新购物车商品数量（需要认证）
router.put('/item/:id', authMiddleware, cartController.updateCartItem);

// 更新购物车商品选中状态（需要认证）
router.put('/item/:id/selected', authMiddleware, cartController.updateCartItemSelected);

// 批量更新购物车商品选中状态（需要认证）
router.put('/selected', authMiddleware, cartController.updateAllCartItemsSelected);

// 删除购物车商品（需要认证）
router.delete('/item/:id', authMiddleware, cartController.deleteCartItem);

// 清空购物车（需要认证）
router.delete('/clear', authMiddleware, cartController.clearCart);

// 获取购物车选中商品（需要认证）
router.get('/selected', authMiddleware, cartController.getSelectedCartItems);

export default router;