import { requestClient } from '#/api/request';

export namespace RechargeApi {
  export interface RechargePackage {
    id: string;
    name: string;
    amount: number;
    giftAmount: number;
    isRecommended: number;
    description: string;
    sort: number;
    status: number;
    createdAt: string;
  }

  export interface CreateRechargePackageParams {
    name: string;
    amount: number;
    giftAmount?: number;
    isRecommended?: number;
    description?: string;
    sort?: number;
    status?: number;
  }

  export interface UpdateRechargePackageParams extends CreateRechargePackageParams {
    id: string;
  }
}

export async function getRechargePackageListApi() {
  return requestClient.get<RechargeApi.RechargePackage[]>('/recharge-package/list');
}

export async function createRechargePackageApi(data: RechargeApi.CreateRechargePackageParams) {
  return requestClient.post('/recharge-package/create', data);
}

export async function updateRechargePackageApi(data: RechargeApi.UpdateRechargePackageParams) {
  return requestClient.put('/recharge-package/update', data);
}

export async function deleteRechargePackageApi(id: string) {
  return requestClient.delete(`/recharge-package/delete/${id}`);
}