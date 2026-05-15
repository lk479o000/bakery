import { Op } from 'sequelize';
import User from '../models/user.model';
import { generateToken } from '../middleware/auth.middleware';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 简单的密码验证（生产环境应使用 bcrypt）
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // 演示环境：密码明文比较（生产环境禁止）
  // 测试用户的密码统一为：123456
  return inputPassword === storedPassword;
}

// 内存缓存 session_key（生产环境应使用 Redis）
const sessionCache = new Map<string, string>();

class AuthService {
  /**
   * 用户名密码登录
   * @param username 用户名（手机号或昵称）
   * @param password 密码
   * @returns 用户信息和token
   */
  async login(username: string, password: string) {
    // 根据手机号或昵称查找用户
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { phone: username },
          { nickname: username }
        ]
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码（测试环境：密码固定为 123456）
    if (!verifyPassword(password, '123456')) {
      throw new Error('密码错误');
    }

    // 生成token
    const token = generateToken(user.id, user.openid);

    return {
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        points: user.points,
        balance: user.balance,
        member_level: user.member_level
      },
      token
    };
  }

  /**
   * 微信登录
   * 使用 code 换取 openid 和 session_key
   * @param code 微信登录临时凭证
   * @returns 用户信息和token
   */
  async wechatLogin(code: string) {
    const { WX_APPID, WX_SECRET } = process.env;

    if (!WX_APPID || !WX_SECRET) {
      throw new Error('微信小程序配置缺失，请检查 WX_APPID 和 WX_SECRET');
    }

    // 调用微信 jscode2session 接口换取 openid
    const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;

    const wxRes = await fetch(wxUrl);
    const wxData = await wxRes.json() as any;

    if (wxData.errcode) {
      throw new Error(`微信登录失败: ${wxData.errmsg || '未知错误'}`);
    }

    const { openid, session_key } = wxData;

    if (!openid) {
      throw new Error('获取 openid 失败');
    }

    // 缓存 session_key 用于后续手机号解密
    sessionCache.set(openid, session_key);

    // 查找用户
    let user = await User.findOne({ where: { openid } });

    // 如果用户不存在，创建新用户
    if (!user) {
      user = await User.create({
        id: generateId(),
        openid,
        nickname: null,
        avatar: null,
        points: 0,
        balance: 0.00,
        member_level: 1
      });
    }

    // 生成token
    const token = generateToken(user.id, user.openid);

    return {
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        points: user.points,
        balance: user.balance,
        member_level: user.member_level
      },
      token
    };
  }

  /**
   * 解密手机号
   * @param encryptedData 加密数据
   * @param iv 初始向量
   * @returns 解密后的手机号
   */
  async decryptPhone(encryptedData: string, iv: string): Promise<{ phone: string }> {
    // 动态导入 crypto（Node.js 内置）
    const crypto = await import('crypto');

    // 从缓存中获取 session_key（实际项目中应从 JWT 或 Redis 中获取）
    // 这里使用一个简化方案：需要前端在请求中带上 openid，或通过其他方式关联
    // 当前实现：需要在登录后立即调用此接口，session_key 仍在缓存中

    // 由于安全考虑，正确的做法是：
    // 1. 前端在获取手机号的同一请求中同时发送 code（重新登录获取最新 session_key）
    // 2. 或者将 session_key 与用户 ID 关联存储
    //
    // 这里采用方案1的变体：decryptPhone 需要额外接收 sessionId/openid 来查找 session_key
    // 但为了兼容当前前端接口签名，我们先抛出明确错误提示需要调整

    throw new Error('手机号解密需要 session_key，请调整接口设计：建议将 code 一并传入或在认证头中传递 openid');
  }

  /**
   * 使用 code + encryptedData + iv 一次性完成手机号获取
   * 推荐的综合接口：用 code 换取最新的 session_key 后直接解密
   */
  async getPhoneWithCode(code: string, encryptedData: string, iv: string): Promise<{ phone: string }> {
    const crypto = await import('crypto');
    const { WX_APPID, WX_SECRET } = process.env;

    if (!WX_APPID || !WX_SECRET) {
      throw new Error('微信小程序配置缺失');
    }

    // 用 code 换取 session_key
    const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
    const wxRes = await fetch(wxUrl);
    const wxData = await wxRes.json() as any;

    if (wxData.errcode || !wxData.session_key) {
      throw new Error(`获取 session_key 失败: ${wxData.errmsg || '未知错误'}`);
    }

    const session_key = wxData.session_key;

    // AES 解密
    const decodedKey = Buffer.from(session_key, 'base64');
    const decodedIv = Buffer.from(iv, 'base64');
    const decodedEncryptedData = Buffer.from(encryptedData, 'base64');

    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', decodedKey, decodedIv);
      decipher.setAutoPadding(true);
      let decrypted = Buffer.concat([decipher.update(decodedEncryptedData), decipher.final()]);
      const decryptedStr = decrypted.toString('utf8');
      const phoneData = JSON.parse(decryptedStr);

      return { phone: phoneData.phoneNumber };
    } catch (error) {
      throw new Error('手机号解密失败，数据可能已损坏');
    }
  }

  /**
   * 绑定手机号
   * @param userId 用户ID
   * @param phone 手机号
   * @returns 更新后的用户信息
   */
  async bindPhone(userId: string, phone: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update({ phone });

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
   * 获取用户权限码列表
   * @param userId 用户ID
   * @returns 权限码列表
   */
  async getAccessCodes(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 根据会员等级返回不同的权限码
    const baseCodes = ['user', 'order', 'cart', 'coupon', 'address'];
    
    if (user.member_level >= 2) {
      baseCodes.push('vip');
    }
    if (user.member_level >= 3) {
      baseCodes.push('svip');
    }
    if (user.id === 'admin001') {
      baseCodes.push('admin');
    }

    return baseCodes;
  }
}

export default new AuthService();
