/**
 * 用户相关接口服务
 */

import { get, put } from '../utils/request';
import { UserInfo, MemberCode } from '../types/api';

/**
 * 获取用户信息
 * @returns Promise<UserInfo>
 */
export function getUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/api/user/info');
}

/**
 * 更新用户信息
 * @param data 用户信息
 * @returns Promise<UserInfo>
 */
export function updateUserInfo(
  data: Partial<Pick<UserInfo, 'nickname' | 'avatar'>>
): Promise<UserInfo> {
  return put<UserInfo>('/api/user/info', data);
}

/**
 * 获取会员码
 * @returns Promise<MemberCode>
 */
export function getMemberCode(): Promise<MemberCode> {
  return get<MemberCode>('/api/member/code');
}
