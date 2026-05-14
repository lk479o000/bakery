/**
 * 常量定义
 */

// API 基础地址
export const BASE_URL = 'http://localhost:8150';

// 超时时间
export const REQUEST_TIMEOUT = 10000;

// 主题色
export const THEME_COLOR = '#4CAF50';
export const THEME_COLOR_DARK = '#388E3C';
export const THEME_COLOR_LIGHT = '#81C784';

// 门店相关
export const DEFAULT_STORE_ID = '1';
export const STORE_SERVICE_TYPES = {
  DELIVERY: '可外送',
  PICKUP: '可自取',
  EXPRESS: '可快递'
} as const;

// 订单类型
export const ORDER_TYPES = [
  { key: 'store', name: '门店订单' },
  { key: 'recharge', name: '储值订单' },
  { key: 'pay', name: '买单订单' },
  { key: 'coupon', name: '券包订单' }
] as const;

// 订单状态
export const ORDER_STATUS = {
  PENDING: 0,     // 待支付
  PAID: 1,        // 已支付
  PREPARING: 2,   // 制作中
  COMPLETED: 3,   // 已完成
  CANCELLED: 4    // 已取消
} as const;

export const ORDER_STATUS_TEXT: Record<number, string> = {
  0: '待支付',
  1: '已支付',
  2: '制作中',
  3: '已完成',
  4: '已取消'
};

// 支付方式
export const PAY_TYPES = [
  { key: 'wechat', name: '微信支付', icon: '💚' },
  { key: 'balance', name: '余额支付', icon: '💰' }
] as const;

// 优惠券状态
export const COUPON_STATUS = {
  UNUSED: 0,    // 未使用
  USED: 1,      // 已使用
  EXPIRED: 2    // 已过期
} as const;

// 充值套餐
export const RECHARGE_PACKAGES = [
  { id: '1', amount: 200, giftAmount: 20, totalAmount: 220, isRecommended: true, description: '储200送20' },
  { id: '2', amount: 300, giftAmount: 40, totalAmount: 340, isRecommended: false, description: '储300送40' }
] as const;

// 更多功能入口
export const MORE_FUNCTIONS = [
  { key: 'recharge', name: '充值中心', icon: '🪙' },
  { key: 'checkin', name: '签到中心', icon: '🎁' },
  { key: 'pointsShop', name: '积分商城', icon: '⭐' },
  { key: 'collectGift', name: '集点有礼', icon: '🎀' },
  { key: 'shareholder', name: '共享股东', icon: '👥' },
  { key: 'couponPack', name: '优惠券包', icon: '🎟️' },
  { key: 'agreement', name: '协议政策', icon: '✅' },
  { key: 'memberCode', name: '会员码', icon: '💎' }
] as const;

// 客服信息
export const SERVICE_INFO = {
  phone: '400-888-8888',
  wechat: 'jisaybread_cs',
  serviceTime: '服务时间：09:00 - 21:00'
} as const;

// 品牌信息
export const BRAND_INFO = {
  name: '吉世面包',
  englishName: 'JISAYBREAD COFFEE',
  slogan: '鲜活面团 每日现作',
  subSlogan: '0添加的坚持 100%的满足',
  description: '坚持选用新鲜顶级食材，健康细腻，口感极佳。',
  features: '少科技添加，吃着更放心',
  address: '金祥路35号',
  hours: '09:00-21:00'
} as const;
