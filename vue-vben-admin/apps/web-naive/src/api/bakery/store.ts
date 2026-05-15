import { requestClient } from '#/api/request';

export namespace StoreApi {
  export interface Store {
    id: string;
    name: string;
    address: string;
    phone: string;
    businessHours: string;
    latitude: number;
    longitude: number;
    isOpen: number;
    canDelivery: number;
    canPickup: number;
    canExpress: number;
    sort: number;
    status: number;
    createdAt: string;
  }

  export interface CreateStoreParams {
    name: string;
    address: string;
    phone?: string;
    businessHours?: string;
    latitude: number;
    longitude: number;
    isOpen?: number;
    canDelivery?: number;
    canPickup?: number;
    canExpress?: number;
    sort?: number;
    status?: number;
  }

  export interface UpdateStoreParams extends CreateStoreParams {
    id: string;
  }
}

export async function getStoreListApi() {
  return requestClient.get<StoreApi.Store[]>('/store/list');
}

export async function createStoreApi(data: StoreApi.CreateStoreParams) {
  return requestClient.post('/store/create', data);
}

export async function updateStoreApi(data: StoreApi.UpdateStoreParams) {
  return requestClient.put('/store/update', data);
}

export async function deleteStoreApi(id: string) {
  return requestClient.delete(`/store/delete/${id}`);
}