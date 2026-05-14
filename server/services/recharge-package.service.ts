import RechargePackage from '../models/recharge-package.model';
import User from '../models/user.model';
import BalanceRecord from '../models/balance.model';
import { v4 as uuidv4 } from 'uuid';

class RechargePackageService {
  async getPackageList() {
    const packages = await RechargePackage.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    });

    return packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      amount: pkg.amount,
      gift_amount: pkg.gift_amount,
      is_recommended: pkg.is_recommended,
      description: pkg.description,
      sort: pkg.sort
    }));
  }

  async createRecharge(userId: string, packageId: string) {
    const pkg = await RechargePackage.findByPk(packageId);
    if (!pkg) {
      throw new Error('充值套餐不存在');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const totalAmount = pkg.amount + pkg.gift_amount;
    const newBalance = user.balance + totalAmount;

    await user.update({ balance: newBalance });

    await BalanceRecord.create({
      id: uuidv4().replace(/-/g, ''),
      user_id: userId,
      type: 'recharge',
      amount: totalAmount,
      balance: newBalance,
      remark: `充值：${pkg.name}`
    });

    return {
      userId,
      packageId,
      packageName: pkg.name,
      rechargeAmount: pkg.amount,
      giftAmount: pkg.gift_amount,
      totalAmount,
      newBalance
    };
  }
}

export default new RechargePackageService();