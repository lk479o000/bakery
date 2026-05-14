/**
 * 认证相关接口服务
 */

import { post } from '../utils/request';
import { LoginResponse } from '../types/api';

/**
 * 微信登录
 * 发送 wx.login() 获取的临时凭证 code，后端换取 openid 并登录
 * @param code 微信登录临时凭证
 * @returns Promise<LoginResponse>
 */
export function login(code: string): Promise<LoginResponse> {
  return post<LoginResponse>('/api/auth/wechat-login', { code }, false);
}

/**
 * 获取手机号（需要同时发送 code 用于后端获取 session_key 解密）
 * @param code 微信登录临时凭证（需要最新的，与 encryptedData 配套）
 * @param encryptedData 加密数据
 * @param iv 加密算法初始向量
 * @returns Promise<{ phone: string }>
 */
export function getPhoneNumber(
  code: string,
  encryptedData: string,
  iv: string
): Promise<{ phone: string }> {
  return post<{ phone: string }>('/api/auth/phone', {
    code,
    encryptedData,
    iv
  }, false);
}
