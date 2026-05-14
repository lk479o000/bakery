import express from 'express';
import productController from '../controllers/product.controller';

const router = express.Router();

// 获取商品列表（不需要认证）
router.get('/list', productController.getProductList);

// 获取商品详情（不需要认证）
router.get('/detail/:id', productController.getProductDetail);

// 批量获取商品信息（不需要认证）
router.post('/batch', productController.getProductsByIds);

export default router;