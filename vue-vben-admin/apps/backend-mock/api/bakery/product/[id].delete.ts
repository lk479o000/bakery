import { defineEventHandler } from 'h3';

import { mockProducts } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return { code: 0, message: 'success', data: null };
  }
  return { code: 404, message: '商品不存在', data: null };
});
