import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';

class AuthController {
  /**
   * 用户名密码登录
   * 接收用户名和密码，验证后返回 token
   */
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ code: 400, message: '用户名和密码不能为空', data: null });
        return;
      }

      const result = await authService.login(username, password);

      res.json({ 
        code: 200, 
        message: 'ok', 
        data: result.token
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 微信登录
   * 接收前端 wx.login() 获取的临时凭证 code，后端换取 openid
   */
  async wechatLogin(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (!code) {
        res.status(400).json({ code: 400, message: 'code 不能为空', data: null });
        return;
      }

      const result = await authService.wechatLogin(code);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 解密手机号
   * 接收前端 getPhoneNumber 获取的加密数据，后端解密获取明文手机号
   */
  async decryptPhone(req: Request, res: Response) {
    try {
      const { code, encryptedData, iv } = req.body;

      if (!code || !encryptedData || !iv) {
        res.status(400).json({ code: 400, message: '缺少参数：需要 code、encryptedData、iv', data: null });
        return;
      }

      const result = await authService.getPhoneWithCode(code, encryptedData, iv);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 绑定手机号（需要认证）
   */
  async bindPhone(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { phone } = req.body;

      if (!phone) {
        res.status(400).json({ code: 400, message: '手机号不能为空', data: null });
        return;
      }

      const result = await authService.bindPhone(userId!, phone);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取用户权限码（需要认证）
   */
  async getAccessCodes(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await authService.getAccessCodes(userId!);

      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new AuthController();
