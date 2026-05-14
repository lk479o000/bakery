/**
 * 地址相关接口服务
 */

import { get, post, put, del } from '../utils/request';
import { Address } from '../types/api';

/**
 * 获取地址列表
 * @returns Promise<Address[]>
 */
export function getAddressList(): Promise<Address[]> {
  return get<Address[]>('/api/address/list');
}

/**
 * 添加收货地址
 * @param data 地址信息
 * @returns Promise<{ id: string }>
 */
export function addAddress(
  data: Omit<Address, 'id'>
): Promise<{ id: string }> {
  return post<{ id: string }>('/api/address/add', data);
}

/**
 * 更新收货地址
 * @param addressId 地址ID
 * @param data 地址信息
 * @returns Promise<void>
 */
export function updateAddress(
  addressId: string,
  data: Partial<Omit<Address, 'id'>>
): Promise<void> {
  return put<void>('/api/address/update', { addressId, ...data });
}

/**
 * 删除收货地址
 * @param addressId 地址ID
 * @returns Promise<void>
 */
export function deleteAddress(addressId: string): Promise<void> {
  return del<void>('/api/address/delete', { addressId });
}

/**
 * 设置默认地址
 * @param addressId 地址ID
 * @returns Promise<void>
 */
export function setDefaultAddress(addressId: string): Promise<void> {
  return put<void>('/api/address/default', { addressId });
}
