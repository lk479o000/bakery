/**
 * 余额相关接口服务
 */

import { get, post } from '../utils/request';
import { PayParams, BalanceRecordResponse } from '../types/api';

/**
 * 余额充值
 * @param amount 充值金额
 * @param payType 支付方式：wechat-微信支付
 * @returns Promise<{ payParams: PayParams }>
 */
export function rechargeBalance(
  amount: number,
  payType: 'wechat' = 'wechat'
): Promise<{ payParams: PayParams }> {
  return post<{ payParams: PayParams }>('/api/balance/recharge', {
    amount,
    payType
  });
}

/**
 * 获取余额明细
 * @param params 查询参数
 * @returns Promise<BalanceRecordResponse>
 */
export function getBalanceRecords(params?: {
  page?: number;
  pageSize?: number;
}): Promise<BalanceRecordResponse> {
  return get<BalanceRecordResponse>('/api/balance/records', params);
}
