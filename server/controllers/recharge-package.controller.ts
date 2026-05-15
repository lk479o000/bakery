import { Request, Response } from 'express';
import rechargePackageService from '../services/recharge-package.service';

class RechargePackageController {
  async getPackageList(req: Request, res: Response) {
    try {
      const result = await rechargePackageService.getPackageList();
      res.json({ code: 200, message: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }

  async createRecharge(req: Request, res: Response) {
    try {
      const { userId, packageId } = req.body;

      if (!userId || !packageId) {
        res.status(400).json({ code: 400, message: '缺少参数', data: null });
        return;
      }

      const result = await rechargePackageService.createRecharge(userId, packageId);
      res.json({ code: 200, message: '充值成功', data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: (error as Error).message || '服务器内部错误', data: null });
    }
  }
}

export default new RechargePackageController();