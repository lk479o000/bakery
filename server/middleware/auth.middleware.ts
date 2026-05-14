/**
 * JWT 认证中间件
 * 使用 HS256 算法，token 有效期 7 天
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // 7天有效期

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      openid?: string;
    }
  }
}

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization: Bearer <token>
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 获取 Authorization 头
  const authHeader = req.headers.authorization;

  // 检查 Authorization 头是否存在
  if (!authHeader) {
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null
    });
    return;
  }

  // 检查格式是否为 Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null
    });
    return;
  }

  const token = parts[1];

  try {
    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      openid: string;
    };

    // 将用户信息附加到请求对象
    req.userId = decoded.userId;
    req.openid = decoded.openid;

    // 继续执行后续中间件或路由处理器
    next();
  } catch (error) {
    // token 验证失败
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null
    });
  }
}

/**
 * 生成 JWT Token
 * @param userId 用户ID
 * @param openid 微信openid
 * @returns JWT Token 字符串
 */
export function generateToken(userId: string, openid: string): string {
  return jwt.sign(
    { userId, openid },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' }
  );
}

/**
 * 可选认证中间件
 * 如果提供了有效的 token，则解析用户信息
 * 如果没有提供 token 或 token 无效，也继续执行，但不设置用户信息
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    next();
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      openid: string;
    };

    req.userId = decoded.userId;
    req.openid = decoded.openid;
  } catch (error) {
    // token 无效，但不阻止请求继续
  }

  next();
}
