import { requestClient } from '#/api/request';

export namespace BannerApi {
  export interface Banner {
    id: string;
    image: string;
    link: string;
    sort: number;
    status: number;
  }

  export interface CreateBannerParams {
    image: string;
    link?: string;
    sort?: number;
    status?: number;
  }

  export interface UpdateBannerParams extends CreateBannerParams {
    id: string;
  }
}

export async function getBannerListApi() {
  return requestClient.get<BannerApi.Banner[]>('/banner/list');
}

export async function createBannerApi(data: BannerApi.CreateBannerParams) {
  return requestClient.post('/banner/create', data);
}

export async function updateBannerApi(data: BannerApi.UpdateBannerParams) {
  return requestClient.put('/banner/update', data);
}

export async function deleteBannerApi(id: string) {
  return requestClient.delete(`/banner/delete/${id}`);
}