/** 管理端 mock：商品 / 分类 + 履约渠道（与小程序 orderType 一致） */

export type MockOrderType = 'pickup' | 'delivery' | 'express';

export interface MockCategory {
  id: string;
  name: string;
  icon: string;
  sort: number;
  status: number;
  canPickup: number;
  canDelivery: number;
  canExpress: number;
}

export interface MockProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  stock: number;
  status: number;
  sort: number;
  createdAt: string;
  canPickup: number;
  canDelivery: number;
  canExpress: number;
}

export const mockCategories: MockCategory[] = [
  { id: 'c001', name: '面包', icon: '', sort: 1, status: 1, canPickup: 1, canDelivery: 1, canExpress: 1 },
  { id: 'c002', name: '蛋糕', icon: '', sort: 2, status: 1, canPickup: 1, canDelivery: 1, canExpress: 0 },
  { id: 'c003', name: '甜点', icon: '', sort: 3, status: 1, canPickup: 1, canDelivery: 1, canExpress: 1 },
  { id: 'c004', name: '饮品', icon: '', sort: 4, status: 0, canPickup: 1, canDelivery: 1, canExpress: 1 },
];

const img = (prompt: string) =>
  `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

export const mockProducts: MockProduct[] = [
  {
    id: 'p001',
    categoryId: 'c001',
    categoryName: '面包',
    name: '法式可颂',
    description: '酥脆可口，黄油香浓',
    price: 12.0,
    originalPrice: 15.0,
    image: img('french croissant pastry golden flaky'),
    stock: 100,
    status: 1,
    sort: 1,
    createdAt: '2024-01-01 10:00:00',
    canPickup: 1,
    canDelivery: 1,
    canExpress: 0,
  },
  {
    id: 'p002',
    categoryId: 'c001',
    categoryName: '面包',
    name: '全麦吐司',
    description: '健康营养，全麦制作',
    price: 8.0,
    originalPrice: 10.0,
    image: img('whole wheat toast bread slices'),
    stock: 50,
    status: 1,
    sort: 2,
    createdAt: '2024-01-02 10:00:00',
    canPickup: 1,
    canDelivery: 1,
    canExpress: 1,
  },
  {
    id: 'p003',
    categoryId: 'c002',
    categoryName: '蛋糕',
    name: '提拉米苏',
    description: '意大利经典甜品',
    price: 28.0,
    originalPrice: 35.0,
    image: img('tiramisu dessert elegant presentation'),
    stock: 30,
    status: 1,
    sort: 1,
    createdAt: '2024-01-03 10:00:00',
    canPickup: 1,
    canDelivery: 1,
    canExpress: 0,
  },
  {
    id: 'p004',
    categoryId: 'c002',
    categoryName: '蛋糕',
    name: '芝士蛋糕',
    description: '浓郁芝士，口感细腻',
    price: 32.0,
    originalPrice: 40.0,
    image: img('cheesecake creamy slice dessert'),
    stock: 25,
    status: 1,
    sort: 2,
    createdAt: '2024-01-04 10:00:00',
    canPickup: 1,
    canDelivery: 0,
    canExpress: 0,
  },
  {
    id: 'p005',
    categoryId: 'c003',
    categoryName: '甜点',
    name: '马卡龙',
    description: '法式精致甜点',
    price: 15.0,
    originalPrice: 18.0,
    image: img('colorful french macarons pastry'),
    stock: 100,
    status: 1,
    sort: 1,
    createdAt: '2024-01-05 10:00:00',
    canPickup: 1,
    canDelivery: 1,
    canExpress: 1,
  },
  {
    id: 'p006',
    categoryId: 'c003',
    categoryName: '甜点',
    name: '泡芙',
    description: '酥脆外皮，奶油内馅',
    price: 6.0,
    originalPrice: 8.0,
    image: img('cream puff pastry dessert'),
    stock: 80,
    status: 0,
    sort: 2,
    createdAt: '2024-01-06 10:00:00',
    canPickup: 1,
    canDelivery: 1,
    canExpress: 0,
  },
];

function parseOrderType(raw: unknown): MockOrderType | undefined {
  if (raw === 'pickup' || raw === 'delivery' || raw === 'express') {
    return raw;
  }
  return undefined;
}

export function productPassesOrderType(p: MockProduct, orderType?: MockOrderType): boolean {
  if (!orderType) {
    return true;
  }
  const key =
    orderType === 'pickup' ? 'canPickup' : orderType === 'delivery' ? 'canDelivery' : 'canExpress';
  return p[key] === 1 && p.status === 1;
}

export function categoryPassesOrderType(c: MockCategory, orderType?: MockOrderType): boolean {
  if (!orderType) {
    return true;
  }
  const key =
    orderType === 'pickup' ? 'canPickup' : orderType === 'delivery' ? 'canDelivery' : 'canExpress';
  return c[key] === 1;
}

/** 与后端一致：有 orderType 时仅返回该场景下分类自身允许且存在可售商品的分类 */
export function listMockCategories(orderTypeRaw?: unknown): MockCategory[] {
  const orderType = parseOrderType(orderTypeRaw);
  return mockCategories
    .filter(c => {
      if (!orderType) {
        return true;
      }
      if (c.status !== 1 || !categoryPassesOrderType(c, orderType)) {
        return false;
      }
      return mockProducts.some(
        p => p.categoryId === c.id && productPassesOrderType(p, orderType),
      );
    })
    .sort((a, b) => a.sort - b.sort);
}

export function categoryNameById(categoryId: string): string {
  return mockCategories.find(c => c.id === categoryId)?.name ?? '';
}
