import { Request, Response, NextFunction } from 'express';
import * as adminAuthService from '../services/admin-auth.service';

export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }

    const decoded = await adminAuthService.verifyToken(token);
    
    (req as any).adminId = decoded.adminId;
    (req as any).roles = decoded.roles;
    
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = (req as any).roles as string[];
    
    if (!roles || !roles.includes(role)) {
      return res.status(403).json({ code: 403, message: '权限不足' });
    }
    
    next();
  };
}