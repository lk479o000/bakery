import { defineEventHandler, readBody } from 'h3';

import { mockCategories } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...body };
    return { code: 0, message: 'success', data: mockCategories[index] };
  }
  return { code: 404, message: '分类不存在', data: null };
});
