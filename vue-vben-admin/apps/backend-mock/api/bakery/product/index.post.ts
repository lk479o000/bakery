import { defineEventHandler, readBody } from 'h3';

import { categoryNameById, mockProducts } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newProduct = {
    canPickup: 1,
    canDelivery: 1,
    canExpress: 1,
    ...body,
    id: `p${Date.now()}`,
    categoryName: categoryNameById(body.categoryId as string),
    createdAt: new Date().toLocaleString('zh-CN'),
  };
  mockProducts.push(newProduct);
  return { code: 0, message: 'success', data: newProduct };
});
