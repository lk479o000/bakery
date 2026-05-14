/**
 * API 响应类型定义
 */

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 请求配置
export interface RequestOptions {
  url: string;
  method?: RequestMethod;
  data?: any;
  header?: Record<string, string>;
  needAuth?: boolean;
}

// 登录响应
export interface LoginResponse {
  token: string;
  userInfo: {
    id: string;
    nickname: string;
    avatar: string;
    phone: string | null;
    points: number;
    balance: number;
    memberLevel: number;
  };
}

// 用户信息
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  points: number;
  balance: number;
  memberLevel: number;
}

// 轮播图
export interface Banner {
  id: string;
  image: string;
  link: string;
  sort: number;
}

// 商品分类
export interface Category {
  id: string;
  name: string;
  icon: string;
  sort: number;
}

// 商品
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  stock: number;
  categoryId?: string;
}

// 商品列表响应
export interface ProductListResponse {
  list: Product[];
  total: number;
}

// 购物车项
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selected: boolean;
  stock: number;
}

// 订单项
export interface OrderItem {
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

// 订单
export interface Order {
  id: string;
  orderNo: string;
  type: string;
  status: number;
  statusText: string;
  totalAmount: number;
  payAmount: number;
  createTime: string;
  items: OrderItem[];
}

// 订单列表响应
export interface OrderListResponse {
  list: Order[];
  total: number;
}

// 订单详情
export interface OrderDetail {
  id: string;
  orderNo: string;
  type: string;
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

// 创建订单响应
export interface CreateOrderResponse {
  orderId: string;
  orderNo: string;
  totalAmount: number;
  discountAmount: number;
  payAmount: number;
}

// 支付参数
export interface PayParams {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

// 优惠券
export interface Coupon {
  id: string;
  name: string;
  type: string;
  value: number;
  minAmount: number;
  startTime: string;
  endTime: string;
  received: boolean;
}

// 我的优惠券
export interface UserCoupon {
  id: string;
  couponId: string;
  name: string;
  type: string;
  value: number;
  minAmount: number;
  endTime: string;
  status: number;
}

// 地址
export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 余额记录
export interface BalanceRecord {
  id: string;
  type: string;
  typeText: string;
  amount: number;
  balance: number;
  remark: string;
  createTime: string;
}

// 余额记录列表响应
export interface BalanceRecordResponse {
  list: BalanceRecord[];
  total: number;
}

// 会员码
export interface MemberCode {
  code: string;        // 会员码
  expireTime: number;  // 过期时间戳
  refreshTime: number; // 刷新时间戳
}
