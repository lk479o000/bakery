import { Request, Response } from 'express';
import * as adminAuthService from '../services/admin-auth.service';

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const result = await adminAuthService.login(username, password);
    
    return res.json(result);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : '登录失败',
    });
  }
}

export async function logout(_req: Request, res: Response) {
  return res.json({
    status: 200,
    message: '退出成功',
  });
}

export async function getUserInfo(req: Request, res: Response) {
  try {
    const adminId = (req as any).adminId;
    
    if (!adminId) {
      return res.status(401).json({ message: '未授权' });
    }

    const adminInfo = await adminAuthService.getAdminInfo(adminId);
    
    return res.json(adminInfo);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : '获取失败',
    });
  }
}

export async function getAccessCodes(req: Request, res: Response) {
  try {
    const adminId = (req as any).adminId;
    
    if (!adminId) {
      return res.status(401).json([]);
    }

    const codes = await adminAuthService.getAccessCodes(adminId);
    
    return res.json(codes);
  } catch (error) {
    return res.status(500).json([]);
  }
}
