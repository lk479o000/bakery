import { defineEventHandler, readBody } from 'h3';

const stores = [
  { id: 's001', name: '国贸店', address: '北京市朝阳区建国门外大街1号', phone: '010-12345678', status: 1, sort: 1 },
  { id: 's002', name: '西单店', address: '北京市西城区西单北大街120号', phone: '010-87654321', status: 1, sort: 2 },
  { id: 's003', name: '三里屯店', address: '北京市朝阳区三里屯路19号', phone: '010-24681357', status: 0, sort: 3 },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newStore = {
    ...body,
    id: `s${Date.now()}`,
  };
  stores.push(newStore);
  return { code: 0, message: 'success', data: newStore };
});