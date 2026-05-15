/**
 * 商品相关接口服务
 */

import { get } from '../utils/request';
import { Banner, Category, Product, ProductListResponse } from '../types/api';

export type OrderTypeParam = 'pickup' | 'delivery' | 'express';

function buildOrderQuery(orderType?: OrderTypeParam): Record<string, string> {
  if (!orderType) {
    return {};
  }
  return { order_type: orderType };
}

/**
 * 获取轮播图列表
 * @returns Promise<Banner[]>
 */
export function getBannerList(): Promise<Banner[]> {
  return get<Banner[]>('/api/banner/list', {}, false);
}

/**
 * 获取商品分类列表
 * @param params.orderType 与门店履约一致：pickup | delivery | express
 */
export function getCategoryList(params?: { orderType?: OrderTypeParam }): Promise<Category[]> {
  return get<Category[]>('/api/category/list', buildOrderQuery(params?.orderType), false);
}

/**
 * 获取商品列表
 * @param params 查询参数（categoryId 会转为后端的 category_id）
 */
export function getProductList(params?: {
  categoryId?: string;
  page?: number;
  pageSize?: number;
  orderType?: OrderTypeParam;
}): Promise<ProductListResponse> {
  const q: Record<string, string | number> = { ...buildOrderQuery(params?.orderType) };
  if (params?.categoryId) {
    q.category_id = params.categoryId;
  }
  if (params?.page !== undefined) {
    q.page = params.page;
  }
  if (params?.pageSize !== undefined) {
    q.pageSize = params.pageSize;
  }
  return get<ProductListResponse>('/api/product/list', q, false);
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise<Product>
 */
export function getProductDetail(id: string): Promise<Product> {
  return get<Product>('/api/product/detail', { id }, false);
}
