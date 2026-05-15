import { defineEventHandler } from 'h3';

import { mockCategories } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler((event) => {
  const id = event.context.params?.id;
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories.splice(index, 1);
    return { code: 0, message: 'success', data: null };
  }
  return { code: 404, message: '分类不存在', data: null };
});
