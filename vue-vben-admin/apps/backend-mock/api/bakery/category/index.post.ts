import { defineEventHandler, readBody } from 'h3';

import { mockCategories } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newCategory = {
    canPickup: 1,
    canDelivery: 1,
    canExpress: 1,
    ...body,
    id: `c${Date.now()}`,
  };
  mockCategories.push(newCategory);
  return { code: 0, message: 'success', data: newCategory };
});
