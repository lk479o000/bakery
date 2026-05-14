/**
 * 优惠券相关接口服务
 */

import { get, post } from '../utils/request';
import { Coupon, UserCoupon } from '../types/api';

/**
 * 获取可领取优惠券列表
 * @returns Promise<Coupon[]>
 */
export function getCouponList(): Promise<Coupon[]> {
  return get<Coupon[]>('/api/coupon/list');
}

/**
 * 领取优惠券
 * @param couponId 优惠券ID
 * @returns Promise<{ userCouponId: string }>
 */
export function receiveCoupon(couponId: string): Promise<{ userCouponId: string }> {
  return post<{ userCouponId: string }>('/api/coupon/receive', { couponId });
}

/**
 * 获取我的优惠券列表
 * @param status 状态：0-未使用，1-已使用，2-已过期
 * @returns Promise<UserCoupon[]>
 */
export function getMyCouponList(status?: number): Promise<UserCoupon[]> {
  return get<UserCoupon[]>('/api/coupon/my', status !== undefined ? { status } : undefined);
}
