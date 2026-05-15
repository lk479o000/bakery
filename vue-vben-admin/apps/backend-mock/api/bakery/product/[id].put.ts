import { defineEventHandler, readBody } from 'h3';

import { mockProducts } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...body };
    return { code: 0, message: 'success', data: mockProducts[index] };
  }
  return { code: 404, message: '商品不存在', data: null };
});
