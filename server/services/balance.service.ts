import BalanceRecord from '../models/balance.model';
import User from '../models/user.model';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class BalanceService {
  /**
   * 充值余额
   * @param userId 用户ID
   * @param amount 充值金额
   * @param remark 备注
   * @returns 充值结果
   */
  async recharge(userId: string, amount: number, remark?: string) {
    if (amount <= 0) {
      throw new Error('充值金额必须大于0');
    }

    // 开始事务
    const transaction = await BalanceRecord.sequelize!.transaction();

    try {
      // 获取用户
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 计算新余额
      const newBalance = parseFloat((user.balance + amount).toFixed(2));

      // 更新用户余额
      await user.update({ balance: newBalance }, { transaction });

      // 记录余额变动
      await BalanceRecord.create(
        {
          id: generateId(),
          user_id: userId,
          type: 'recharge',
          amount,
          balance: newBalance,
          remark: remark || '余额充值'
        },
        { transaction }
      );

      // 提交事务
      await transaction.commit();

      return {
        user_id: userId,
        amount,
        balance: newBalance,
        remark
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 消费余额
   * @param userId 用户ID
   * @param amount 消费金额
   * @param remark 备注
   * @returns 消费结果
   */
  async consume(userId: string, amount: number, remark?: string) {
    if (amount <= 0) {
      throw new Error('消费金额必须大于0');
    }

    // 开始事务
    const transaction = await BalanceRecord.sequelize!.transaction();

    try {
      // 获取用户
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 检查余额
      if (user.balance < amount) {
        throw new Error('余额不足');
      }

      // 计算新余额
      const newBalance = parseFloat((user.balance - amount).toFixed(2));

      // 更新用户余额
      await user.update({ balance: newBalance }, { transaction });

      // 记录余额变动
      await BalanceRecord.create(
        {
          id: generateId(),
          user_id: userId,
          type: 'consume',
          amount: -amount,
          balance: newBalance,
          remark: remark || '余额消费'
        },
        { transaction }
      );

      // 提交事务
      await transaction.commit();

      return {
        user_id: userId,
        amount,
        balance: newBalance,
        remark
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 退款
   * @param userId 用户ID
   * @param amount 退款金额
   * @param remark 备注
   * @returns 退款结果
   */
  async refund(userId: string, amount: number, remark?: string) {
    if (amount <= 0) {
      throw new Error('退款金额必须大于0');
    }

    // 开始事务
    const transaction = await BalanceRecord.sequelize!.transaction();

    try {
      // 获取用户
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 计算新余额
      const newBalance = parseFloat((user.balance + amount).toFixed(2));

      // 更新用户余额
      await user.update({ balance: newBalance }, { transaction });

      // 记录余额变动
      await BalanceRecord.create(
        {
          id: generateId(),
          user_id: userId,
          type: 'refund',
          amount,
          balance: newBalance,
          remark: remark || '余额退款'
        },
        { transaction }
      );

      // 提交事务
      await transaction.commit();

      return {
        user_id: userId,
        amount,
        balance: newBalance,
        remark
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取余额记录
   * @param userId 用户ID
   * @param params 查询参数
   * @returns 余额记录列表
   */
  async getBalanceRecords(userId: string, params: {
    type?: 'recharge' | 'consume' | 'refund';
    page?: number;
    pageSize?: number;
  }) {
    const { type, page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const where: any = { user_id: userId };
    if (type) {
      where.type = type;
    }

    const { rows: records, count: total } = await BalanceRecord.findAndCountAll({
      where,
      order: [['create_time', 'DESC']],
      limit: pageSize,
      offset
    });

    return {
      list: records.map(record => ({
        id: record.id,
        user_id: record.user_id,
        type: record.type,
        amount: record.amount,
        balance: record.balance,
        remark: record.remark,
        create_time: record.create_time
      })),
      total,
      page,
      pageSize
    };
  }

  /**
   * 获取用户余额
   * @param userId 用户ID
   * @returns 用户余额
   */
  async getBalance(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      user_id: userId,
      balance: user.balance
    };
  }
}

export default new BalanceService();