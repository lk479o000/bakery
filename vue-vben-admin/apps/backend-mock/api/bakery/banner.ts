import { defineMock } from 'vite-plugin-mock';

const banners = [
  { id: 'b001', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=bakery%20banner%20fresh%20bread%20pastries%20colorful&image_size=landscape_16_9', link: '/pages/product/list', sort: 1, status: 1 },
  { id: 'b002', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cake%20dessert%20bakery%20promotion%20banner&image_size=landscape_16_9', link: '/pages/product/list?category=cake', sort: 2, status: 1 },
  { id: 'b003', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=coffee%20bakery%20morning%20breakfast%20banner&image_size=landscape_16_9', link: '/pages/coupon', sort: 3, status: 0 },
];

export default defineMock({
  api: '/api/banner/list',
  method: 'get',
  response: () => {
    return { code: 0, message: 'success', data: banners };
  },
});

export const createBanner = defineMock({
  api: '/api/banner/create',
  method: 'post',
  response: ({ body }) => {
    const newBanner = {
      ...body,
      id: `b${Date.now()}`,
    };
    banners.push(newBanner);
    return { code: 0, message: 'success', data: newBanner };
  },
});

export const updateBanner = defineMock({
  api: '/api/banner/update',
  method: 'put',
  response: ({ body }) => {
    const index = banners.findIndex(b => b.id === body.id);
    if (index !== -1) {
      banners[index] = { ...banners[index], ...body };
      return { code: 0, message: 'success', data: banners[index] };
    }
    return { code: 404, message: '轮播图不存在', data: null };
  },
});

export const deleteBanner = defineMock({
  api: '/api/banner/delete/:id',
  method: 'delete',
  response: ({ params }) => {
    const index = banners.findIndex(b => b.id === params.id);
    if (index !== -1) {
      banners.splice(index, 1);
      return { code: 0, message: 'success', data: null };
    }
    return { code: 404, message: '轮播图不存在', data: null };
  },
});