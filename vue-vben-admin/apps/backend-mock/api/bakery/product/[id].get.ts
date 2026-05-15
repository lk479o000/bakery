import { defineEventHandler } from 'h3';

import { mockProducts } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const product = mockProducts.find(p => p.id === id);
  if (product) {
    return { code: 0, message: 'success', data: product };
  }
  return { code: 404, message: '商品不存在', data: null };
});
