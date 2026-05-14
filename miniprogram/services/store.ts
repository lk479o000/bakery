/**
 * 门店相关接口服务
 */

import { get } from '../utils/request';

export interface StoreItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  distance?: string;
  isOpen: boolean;
  canDelivery: boolean;
  canPickup: boolean;
  canExpress: boolean;
}

export interface StoreListResponse {
  list: StoreItem[];
  total: number;
}

/**
 * 获取门店列表
 */
export function getStoreList(params?: {
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<StoreListResponse> {
  return get<StoreListResponse>('/api/store/list', params, false);
}

/**
 * 获取门店详情
 */
export function getStoreDetail(id: string): Promise<StoreItem> {
  return get<StoreItem>(`/api/store/detail/${id}`, {}, false);
}

/**
 * 获取附近门店
 */
export function getNearbyStores(params: {
  latitude: number;
  longitude: number;
  radius?: number;
}): Promise<StoreListResponse> {
  return get<StoreListResponse>('/api/store/nearby', params, false);
}
