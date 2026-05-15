import { requestClient } from '#/api/request';

export namespace CouponApi {
  export interface Coupon {
    id: string;
    name: string;
    type: string;
    typeText?: string;
    value: number;
    minAmount: number;
    startTime: string;
    endTime: string;
    totalCount: number;
    receivedCount: number;
    status: number;
  }

  export interface CreateCouponParams {
    name: string;
    type: string;
    value: number;
    minAmount?: number;
    startTime: string;
    endTime: string;
    totalCount?: number;
    status?: number;
  }

  export interface UpdateCouponParams extends CreateCouponParams {
    id: string;
  }
}

export async function getCouponListApi() {
  return requestClient.get<CouponApi.Coupon[]>('/coupon/list');
}

export async function createCouponApi(data: CouponApi.CreateCouponParams) {
  return requestClient.post('/coupon/create', data);
}

export async function updateCouponApi(data: CouponApi.UpdateCouponParams) {
  return requestClient.put('/coupon/update', data);
}

export async function deleteCouponApi(id: string) {
  return requestClient.delete(`/coupon/delete/${id}`);
}