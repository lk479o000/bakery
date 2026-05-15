import { defineEventHandler, getQuery } from 'h3';

import { mockProducts, productPassesOrderType } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { categoryId, name, page = 1, pageSize = 10, order_type, orderType } = query;
  const ot = order_type ?? orderType;

  let filtered = [...mockProducts];
  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }
  if (name) {
    filtered = filtered.filter(p => p.name.includes(name as string));
  }
  if (ot) {
    filtered = filtered.filter(p => productPassesOrderType(p, ot as 'pickup' | 'delivery' | 'express'));
  }

  const total = filtered.length;
  const list = filtered.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize));
  return { code: 0, message: 'success', data: { list, total } };
});
