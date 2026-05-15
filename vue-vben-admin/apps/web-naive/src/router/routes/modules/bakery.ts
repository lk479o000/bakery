import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-bag',
      order: 10,
      title: $t('bakery.title'),
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
          title: $t('bakery.product'),
        },
      },
      {
        name: 'CategoryManagement',
        path: '/bakery/category',
        component: () => import('#/views/bakery/category/index.vue'),
        meta: {
          icon: 'lucide:folder',
          title: $t('bakery.category'),
        },
      },
      {
        name: 'OrderManagement',
        path: '/bakery/order',
        component: () => import('#/views/bakery/order/index.vue'),
        meta: {
          icon: 'lucide:receipt',
          title: $t('bakery.order'),
        },
      },
      {
        name: 'UserManagement',
        path: '/bakery/user',
        component: () => import('#/views/bakery/user/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: $t('bakery.user'),
        },
      },
      {
        name: 'CouponManagement',
        path: '/bakery/coupon',
        component: () => import('#/views/bakery/coupon/index.vue'),
        meta: {
          icon: 'lucide:ticket',
          title: $t('bakery.coupon'),
        },
      },
      {
        name: 'StoreManagement',
        path: '/bakery/store',
        component: () => import('#/views/bakery/store/index.vue'),
        meta: {
          icon: 'lucide:store',
          title: $t('bakery.store'),
        },
      },
      {
        name: 'RechargeManagement',
        path: '/bakery/recharge',
        component: () => import('#/views/bakery/recharge/index.vue'),
        meta: {
          icon: 'lucide:wallet',
          title: $t('bakery.recharge'),
        },
      },
      {
        name: 'BannerManagement',
        path: '/bakery/banner',
        component: () => import('#/views/bakery/banner/index.vue'),
        meta: {
          icon: 'lucide:image',
          title: $t('bakery.banner'),
        },
      },
    ],
  },
];

export default routes;