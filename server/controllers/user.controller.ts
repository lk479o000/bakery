import { Request, Response } from 'express';
import userService from '../services/user.service';

class UserController {
  /**
   * 获取用户信息
   * @param req 请求
   * @param res 响应
   */
  async getUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await userService.getUserInfo(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 更新用户信息
   * @param req 请求
   * @param res 响应
   */
  async updateUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { nickname, avatar } = req.body;

      const result = await userService.updateUserInfo(userId!, { nickname, avatar });

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 增加用户积分
   * @param req 请求
   * @param res 响应
   */
  async addPoints(req: Request, res: Response) {
    try {
      const { userId } = req;
      const { points } = req.body;

      if (!points || points <= 0) {
        res.status(400).json({ code: 400, message: '积分数量必须大于0', data: null });
        return;
      }

      const result = await userService.addPoints(userId!, points);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取用户余额
   * @param req 请求
   * @param res 响应
   */
  async getBalance(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await userService.getUserInfo(userId!);

      res.json({ code: 0, message: 'ok', data: { balance: result.balance } });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  /**
   * 获取会员码
   * @param req 请求
   * @param res 响应
   */
  async getMemberCode(req: Request, res: Response) {
    try {
      const { userId } = req;

      const result = await userService.getMemberCode(userId!);

      res.json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new UserController();