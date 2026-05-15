/**
 * JWT 认证中间件
 * 使用 HS256 算法，token 有效期 7 天
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { JWT_SECRET } from '../config/jwt';

// 加载环境变量
dotenv.config();

const JWT_EXPIRES_IN = '7d'; // 7天有效期

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      openid?: string;
      adminId?: string;
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
    // 验证 token（仅接受小程序用户载荷，拒绝管理员 JWT）
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;

    if (typeof decoded.userId !== 'string' || !decoded.userId) {
      res.status(401).json({
        code: 401,
        message: '未登录或登录已过期',
        data: null,
      });
      return;
    }

    req.userId = decoded.userId;
    req.openid = typeof decoded.openid === 'string' ? decoded.openid : undefined;

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
 * 订单列表：允许小程序用户 JWT 或后台管理员 JWT
 */
export function authUserOrAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null,
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null,
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;

    if (typeof decoded.userId === 'string' && decoded.userId) {
      req.userId = decoded.userId;
      req.openid = typeof decoded.openid === 'string' ? decoded.openid : undefined;
      next();
      return;
    }

    if (typeof decoded.adminId === 'string' && decoded.adminId) {
      req.adminId = decoded.adminId;
      next();
      return;
    }

    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null,
    });
  } catch {
    res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
      data: null,
    });
  }
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
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;

    if (typeof decoded.userId === 'string' && decoded.userId) {
      req.userId = decoded.userId;
      req.openid = typeof decoded.openid === 'string' ? decoded.openid : undefined;
    }
  } catch (error) {
    // token 无效，但不阻止请求继续
  }

  next();
}
