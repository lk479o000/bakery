import User from '../models/user.model';

class UserService {
  /**
   * 获取用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUserInfo(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      points: user.points,
      balance: user.balance,
      member_level: user.member_level,
      created_at: user.created_at
    };
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param userInfo 用户信息
   * @returns 更新后的用户信息
   */
  async updateUserInfo(userId: string, userInfo: {
    nickname?: string;
    avatar?: string;
  }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update(userInfo);

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      points: user.points,
      balance: user.balance,
      member_level: user.member_level
    };
  }

  /**
   * 增加用户积分
   * @param userId 用户ID
   * @param points 积分数量
   * @returns 更新后的用户信息
   */
  async addPoints(userId: string, points: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const newPoints = user.points + points;
    await user.update({ points: newPoints });

    return {
      id: user.id,
      points: newPoints
    };
  }

  /**
   * 更新用户余额
   * @param userId 用户ID
   * @param amount 变动金额（正数为增加，负数为减少）
   * @returns 更新后的用户信息
   */
  async updateBalance(userId: string, amount: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const newBalance = parseFloat((user.balance + amount).toFixed(2));
    if (newBalance < 0) {
      throw new Error('余额不足');
    }

    await user.update({ balance: newBalance });

    return {
      id: user.id,
      balance: newBalance
    };
  }

  /**
   * 获取会员码
   * @param userId 用户ID
   * @returns 会员码信息
   */
  async getMemberCode(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const code = this.generateMemberCode(userId);
    const expireTime = Date.now() + 5 * 60 * 1000;
    const refreshTime = Date.now();

    return {
      code,
      expireTime,
      refreshTime
    };
  }

  private generateMemberCode(userId: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const suffix = (hash % 1000).toString().padStart(3, '0');
    return `VIP${timestamp}${suffix}`;
  }
}

export default new UserService();