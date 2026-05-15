import type { RouteRecordRaw } from 'vue-router';

import { RouteViewLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: RouteViewLayout,
    meta: {
      icon: 'lucide:shopping-bag',
      /** 保留父级 `<RouterView />`，避免 access 在挂到根路由时删掉 component 导致 matched 链异常 */
      keepParentView: true,
      order: 10,
      title: 'page.bakery.title',
    },
    name: 'Bakery',
    path: '/bakery',
    children: [
      {
        name: 'ProductManagement',
        path: '/bakery/product',
        component: () => import('#/views/bakery/product/index.vue'),
        meta: {
          icon: 'lucide:cookie',
          title: 'page.bakery.product',
        },
      },
      {
        name: 'CategoryManagement',
        path: '/bakery/category',
        component: () => import('#/views/bakery/category/index.vue'),
        meta: {
          icon: 'lucide:folder',
          title: 'page.bakery.category',
        },
      },
      {
        name: 'OrderManagement',
        path: '/bakery/order',
        component: () => import('#/views/bakery/order/index.vue'),
        meta: {
          icon: 'lucide:receipt',
          title: 'page.bakery.order',
        },
      },
      {
        name: 'UserManagement',
        path: '/bakery/user',
        component: () => import('#/views/bakery/user/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: 'page.bakery.user',
        },
      },
      {
        name: 'CouponManagement',
        path: '/bakery/coupon',
        component: () => import('#/views/bakery/coupon/index.vue'),
        meta: {
          icon: 'lucide:ticket',
          title: 'page.bakery.coupon',
        },
      },
      {
        name: 'StoreManagement',
        path: '/bakery/store',
        component: () => import('#/views/bakery/store/index.vue'),
        meta: {
          icon: 'lucide:store',
          title: 'page.bakery.store',
        },
      },
      {
        name: 'RechargeManagement',
        path: '/bakery/recharge',
        component: () => import('#/views/bakery/recharge/index.vue'),
        meta: {
          icon: 'lucide:wallet',
          title: 'page.bakery.recharge',
        },
      },
      {
        name: 'BannerManagement',
        path: '/bakery/banner',
        component: () => import('#/views/bakery/banner/index.vue'),
        meta: {
          icon: 'lucide:image',
          title: 'page.bakery.banner',
        },
      },
    ],
  },
];

export default routes;