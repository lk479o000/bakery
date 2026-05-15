import { requestClient } from '#/api/request';

/** 后端 snake_case 与 mock camelCase 兼容 */
function pick<T>(raw: Record<string, unknown>, camel: string, snake: string, fallback: T): T {
  const c = raw[camel];
  if (c !== undefined && c !== null) {
    return c as T;
  }
  const s = raw[snake];
  if (s !== undefined && s !== null) {
    return s as T;
  }
  return fallback;
}

function normalizeProduct(raw: Record<string, unknown>): ProductApi.Product {
  return {
    id: String(raw.id ?? ''),
    categoryId: String(pick(raw, 'categoryId', 'category_id', '')),
    categoryName: String(pick(raw, 'categoryName', 'category_name', '')),
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    price: Number(raw.price) || 0,
    originalPrice: Number(pick(raw, 'originalPrice', 'original_price', 0)) || 0,
    image: String(raw.image ?? ''),
    stock: Number(raw.stock) || 0,
    status: Number(raw.status) || 0,
    sort: Number(raw.sort) || 0,
    createdAt: pick<string | undefined>(raw, 'createdAt', 'created_at', undefined),
    canPickup: Number(pick(raw, 'canPickup', 'can_pickup', 1)) ? 1 : 0,
    canDelivery: Number(pick(raw, 'canDelivery', 'can_delivery', 1)) ? 1 : 0,
    canExpress: Number(pick(raw, 'canExpress', 'can_express', 1)) ? 1 : 0,
  };
}

export namespace ProductApi {
  export interface Product {
    id: string;
    categoryId: string;
    categoryName?: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    stock: number;
    status: number;
    sort: number;
    createdAt?: string;
    canPickup: number;
    canDelivery: number;
    canExpress: number;
  }

  export interface ProductListParams {
    categoryId?: string;
    name?: string;
    page?: number;
    pageSize?: number;
    orderType?: 'pickup' | 'delivery' | 'express';
  }

  export interface ProductListResult {
    list: Product[];
    total: number;
  }

  export interface CreateProductParams {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    stock?: number;
    status?: number;
    sort?: number;
    canPickup?: number;
    canDelivery?: number;
    canExpress?: number;
  }

  export interface UpdateProductParams extends CreateProductParams {
    id: string;
  }
}

export async function getProductListApi(params: ProductApi.ProductListParams) {
  const raw = await requestClient.get<{ list: Record<string, unknown>[]; total: number }>(
    '/product/list',
    { params },
  );
  return {
    list: (raw.list ?? []).map((row) => normalizeProduct(row)),
    total: raw.total ?? 0,
  };
}

export async function getProductDetailApi(id: string) {
  const raw = await requestClient.get<Record<string, unknown>>(`/product/detail/${id}`);
  return normalizeProduct(raw);
}

export async function createProductApi(data: ProductApi.CreateProductParams) {
  return requestClient.post('/product/create', data);
}

export async function updateProductApi(data: ProductApi.UpdateProductParams) {
  return requestClient.put('/product/update', data);
}

export async function deleteProductApi(id: string) {
  return requestClient.delete(`/product/delete/${id}`);
}