/**
 * 订单相关接口服务
 */

import { get, post, put } from '../utils/request';
import {
  Order,
  OrderListResponse,
  OrderDetail,
  CreateOrderResponse,
  PayParams
} from '../types/api';

/**
 * 创建订单
 * @param params 订单参数
 * @returns Promise<CreateOrderResponse>
 */
export function createOrder(params: {
  cartIds: string[];
  addressId?: string;
  remark?: string;
  couponId?: string;
}): Promise<CreateOrderResponse> {
  return post<CreateOrderResponse>('/api/order/create', params);
}

/**
 * 支付订单
 * @param orderId 订单ID
 * @param payType 支付方式：wechat-微信支付，balance-余额支付
 * @returns Promise<{ payParams?: PayParams }>
 */
export function payOrder(
  orderId: string,
  payType: 'wechat' | 'balance'
): Promise<{ payParams?: PayParams }> {
  return post<{ payParams?: PayParams }>('/api/order/pay', {
    orderId,
    payType
  });
}

/**
 * 获取订单列表
 * @param params 查询参数
 * @returns Promise<OrderListResponse>
 */
export function getOrderList(params?: {
  type?: string;
  status?: number;
  page?: number;
  pageSize?: number;
}): Promise<OrderListResponse> {
  return get<OrderListResponse>('/api/order/list', params);
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns Promise<OrderDetail>
 */
export function getOrderDetail(orderId: string): Promise<OrderDetail> {
  return get<OrderDetail>('/api/order/detail', { orderId });
}

/**
 * 取消订单
 * @param orderId 订单ID
 * @returns Promise<void>
 */
export function cancelOrder(orderId: string): Promise<void> {
  return put<void>('/api/order/cancel', { orderId });
}
