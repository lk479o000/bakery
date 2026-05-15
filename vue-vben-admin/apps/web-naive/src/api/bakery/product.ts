import { requestClient } from '#/api/request';

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
  }

  export interface ProductListParams {
    categoryId?: string;
    name?: string;
    page?: number;
    pageSize?: number;
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
  }

  export interface UpdateProductParams extends CreateProductParams {
    id: string;
  }
}

export async function getProductListApi(params: ProductApi.ProductListParams) {
  return requestClient.get<ProductApi.ProductListResult>('/product/list', { params });
}

export async function getProductDetailApi(id: string) {
  return requestClient.get<ProductApi.Product>(`/product/detail/${id}`);
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