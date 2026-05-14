/**
 * 商品相关接口服务
 */

import { get } from '../utils/request';
import { Banner, Category, Product, ProductListResponse } from '../types/api';

/**
 * 获取轮播图列表
 * @returns Promise<Banner[]>
 */
export function getBannerList(): Promise<Banner[]> {
  return get<Banner[]>('/api/banner/list', {}, false);
}

/**
 * 获取商品分类列表
 * @returns Promise<Category[]>
 */
export function getCategoryList(): Promise<Category[]> {
  return get<Category[]>('/api/category/list', {}, false);
}

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns Promise<ProductListResponse>
 */
export function getProductList(params?: {
  categoryId?: string;
  page?: number;
  pageSize?: number;
}): Promise<ProductListResponse> {
  return get<ProductListResponse>('/api/product/list', params, false);
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise<Product>
 */
export function getProductDetail(id: string): Promise<Product> {
  return get<Product>('/api/product/detail', { id }, false);
}
