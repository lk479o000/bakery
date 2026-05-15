import { requestClient } from '#/api/request';

export namespace CategoryApi {
  export interface Category {
    id: string;
    name: string;
    icon: string;
    sort: number;
    status: number;
  }

  export interface CreateCategoryParams {
    name: string;
    icon?: string;
    sort?: number;
    status?: number;
  }

  export interface UpdateCategoryParams extends CreateCategoryParams {
    id: string;
  }
}

export async function getCategoryListApi() {
  return requestClient.get<CategoryApi.Category[]>('/category/list');
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