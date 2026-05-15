import { defineMock } from 'vite-plugin-mock';

const stores = [
  { id: 's001', name: '吉世面包旗舰店', address: '广东省深圳市南山区科技园xx栋', phone: '0755-12345678', businessHours: '08:00-22:00', latitude: 22.5431, longitude: 114.0579, isOpen: 1, canDelivery: 1, canPickup: 1, canExpress: 0, sort: 1, status: 1, createdAt: '2024-01-01 10:00:00' },
  { id: 's002', name: '吉世面包福田店', address: '广东省深圳市福田区华强北xx号', phone: '0755-87654321', businessHours: '09:00-21:00', latitude: 22.5401, longitude: 114.0546, isOpen: 1, canDelivery: 1, canPickup: 1, canExpress: 0, sort: 2, status: 1, createdAt: '2024-01-02 10:00:00' },
  { id: 's003', name: '吉世面包罗湖店', address: '广东省深圳市罗湖区东门xx号', phone: '0755-11223344', businessHours: '10:00-22:00', latitude: 22.5495, longitude: 114.1095, isOpen: 0, canDelivery: 0, canPickup: 1, canExpress: 1, sort: 3, status: 1, createdAt: '2024-01-03 10:00:00' },
];

export default defineMock({
  api: '/api/store/list',
  method: 'get',
  response: () => {
    return { code: 0, message: 'success', data: stores };
  },
});

export const createStore = defineMock({
  api: '/api/store/create',
  method: 'post',
  response: ({ body }) => {
    const newStore = {
      ...body,
      id: `s${Date.now()}`,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    stores.push(newStore);
    return { code: 0, message: 'success', data: newStore };
  },
});

export const updateStore = defineMock({
  api: '/api/store/update',
  method: 'put',
  response: ({ body }) => {
    const index = stores.findIndex(s => s.id === body.id);
    if (index !== -1) {
      stores[index] = { ...stores[index], ...body };
      return { code: 0, message: 'success', data: stores[index] };
    }
    return { code: 404, message: '门店不存在', data: null };
  },
});

export const deleteStore = defineMock({
  api: '/api/store/delete/:id',
  method: 'delete',
  response: ({ params }) => {
    const index = stores.findIndex(s => s.id === params.id);
    if (index !== -1) {
      stores.splice(index, 1);
      return { code: 0, message: 'success', data: null };
    }
    return { code: 404, message: '门店不存在', data: null };
  },
});