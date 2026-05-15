import { defineEventHandler, getQuery } from 'h3';

import { listMockCategories } from '../../../utils/bakery-catalog-mock';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const ot = query.order_type ?? query.orderType;
  return { code: 0, message: 'success', data: listMockCategories(ot) };
});
