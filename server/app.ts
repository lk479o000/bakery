import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware';

// 加载环境变量
dotenv.config();

// 导入路由
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';
import couponRoutes from './routes/coupon.routes';
import addressRoutes from './routes/address.routes';
import balanceRoutes from './routes/balance.routes';
import bannerRoutes from './routes/banner.routes';
import categoryRoutes from './routes/category.routes';
import storeRoutes from './routes/store.routes';
import rechargePackageRoutes from './routes/recharge-package.routes';
import paymentRoutes from './routes/payment.routes';

// 创建 Express 应用
const app = express();

// 注册中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(cors()); // 启用 CORS
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 静态文件服务：图片访问路径为 /images/xxx
app.use('/images', express.static('public/images'));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'ok', data: { status: 'healthy' } });
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/recharge-package', rechargePackageRoutes);
app.use('/api/payment', paymentRoutes);

// 404 错误处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在', data: null });
});

// 全局错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
});

// 启动服务器
const PORT = process.env.PORT || 8150;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

export default app;