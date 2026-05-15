export type OrderType = 'pickup' | 'delivery' | 'express';

export function parseOrderType(raw: unknown): OrderType | undefined {
  if (raw === 'pickup' || raw === 'delivery' || raw === 'express') {
    return raw;
  }
  return undefined;
}

/** DB column on t_product / t_category / t_store */
export function orderTypeToChannelField(
  orderType: OrderType
): 'can_pickup' | 'can_delivery' | 'can_express' {
  const map = {
    pickup: 'can_pickup',
    delivery: 'can_delivery',
    express: 'can_express',
  } as const;
  return map[orderType];
}
