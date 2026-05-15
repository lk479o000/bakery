import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface User {
    id: string;
    openid: string;
    nickname: string;
    avatar: string;
    phone: string;
    points: number;
    balance: number;
    memberLevel: number;
    createdAt: string;
  }

  export interface UserListParams {
    nickname?: string;
    phone?: string;
    page?: number;
    pageSize?: number;
  }

  export interface UserListResult {
    list: User[];
    total: number;
  }
}

export async function getUserListApi(params: UserApi.UserListParams) {
  return requestClient.get<UserApi.UserListResult>('/user/list', { params });
}

export async function getUserDetailApi(id: string) {
  return requestClient.get<UserApi.User>(`/user/detail/${id}`);
}

export async function updateUserApi(id: string, data: Partial<UserApi.User>) {
  return requestClient.put(`/user/update/${id}`, data);
}

export async function updateUserBalanceApi(id: string, amount: number, remark: string) {
  return requestClient.put('/user/balance', { id, amount, remark });
}