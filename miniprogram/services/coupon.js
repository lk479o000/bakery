"use strict";
/**
 * 优惠券相关接口服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCouponList = getCouponList;
exports.receiveCoupon = receiveCoupon;
exports.getMyCouponList = getMyCouponList;
const request_1 = require("../utils/request");
/**
 * 获取可领取优惠券列表
 * @returns Promise<Coupon[]>
 */
function getCouponList() {
    return (0, request_1.get)('/api/coupon/list');
}
/**
 * 领取优惠券
 * @param couponId 优惠券ID
 * @returns Promise<{ userCouponId: string }>
 */
function receiveCoupon(couponId) {
    return (0, request_1.post)('/api/coupon/receive', { couponId });
}
/**
 * 获取我的优惠券列表
 * @param status 状态：0-未使用，1-已使用，2-已过期
 * @returns Promise<UserCoupon[]>
 */
function getMyCouponList(status) {
    return (0, request_1.get)('/api/coupon/my', status !== undefined ? { status } : undefined);
}
