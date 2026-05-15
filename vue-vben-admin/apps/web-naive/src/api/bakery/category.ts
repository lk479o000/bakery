import { requestClient } from '#/api/request';

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

function normalizeCategory(raw: Record<string, unknown>): CategoryApi.Category {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    icon: String(raw.icon ?? ''),
    sort: Number(raw.sort) || 0,
    status: Number.isFinite(Number(raw.status)) ? Number(raw.status) : 1,
    canPickup: Number(pick(raw, 'canPickup', 'can_pickup', 1)) ? 1 : 0,
    canDelivery: Number(pick(raw, 'canDelivery', 'can_delivery', 1)) ? 1 : 0,
    canExpress: Number(pick(raw, 'canExpress', 'can_express', 1)) ? 1 : 0,
  };
}

export namespace CategoryApi {
  export interface Category {
    id: string;
    name: string;
    icon: string;
    sort: number;
    status: number;
    canPickup: number;
    canDelivery: number;
    canExpress: number;
  }

  export interface CreateCategoryParams {
    name: string;
    icon?: string;
    sort?: number;
    status?: number;
    canPickup?: number;
    canDelivery?: number;
    canExpress?: number;
  }

  export interface UpdateCategoryParams extends CreateCategoryParams {
    id: string;
  }
}

export async function getCategoryListApi(params?: { orderType?: 'pickup' | 'delivery' | 'express' }) {
  const rows = await requestClient.get<Record<string, unknown>[]>('/category/list', { params });
  return (Array.isArray(rows) ? rows : []).map((row) => normalizeCategory(row));
}

export async function createCategoryApi(data: CategoryApi.CreateCategoryParams) {
  return requestClient.post('/category/create', data);
}

export async function updateCategoryApi(data: CategoryApi.UpdateCategoryParams) {
  return requestClient.put('/category/update', data);
}

export async function deleteCategoryApi(id: string) {
  return requestClient.delete(`/category/delete/${id}`);
}