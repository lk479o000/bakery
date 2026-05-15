import { requestClient } from '#/api/request';

export namespace OrderApi {
  export interface OrderItem {
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }

  export interface Order {
    id: string;
    orderNo: string;
    userId: string;
    userName?: string;
    type: string;
    typeText?: string;
    status: number;
    statusText: string;
    totalAmount: number;
    discountAmount: number;
    payAmount: number;
    payType: string;
    remark: string;
    createTime: string;
    payTime: string;
    items: OrderItem[];
  }

  export interface OrderListParams {
    type?: string;
    status?: number;
    orderNo?: string;
    page?: number;
    pageSize?: number;
  }

  export interface OrderListResult {
    list: Order[];
    total: number;
  }
}

export async function getOrderListApi(params: OrderApi.OrderListParams) {
  return requestClient.get<OrderApi.OrderListResult>('/order/list', { params });
}

export async function getOrderDetailApi(id: string) {
  return requestClient.get<OrderApi.Order>(`/order/detail/${id}`);
}

export async function updateOrderStatusApi(id: string, status: number) {
  return requestClient.put('/order/status', { id, status });
}

export async function cancelOrderApi(id: string) {
  return requestClient.put(`/order/cancel/${id}`);
}