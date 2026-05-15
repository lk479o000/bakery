import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: 'demos.title',
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: 'demos.naive',
        },
        name: 'NaiveDemos',
        path: '/demos/naive',
        component: () => import('#/views/demos/naive/index.vue'),
      },
      {
        meta: {
          title: 'demos.table',
        },
        name: 'Table',
        path: '/demos/table',
        component: () => import('#/views/demos/table/index.vue'),
      },
      {
        meta: {
          title: 'demos.form',
        },
        name: 'Form',
        path: '/demos/form',
        component: () => import('#/views/demos/form/basic.vue'),
      },
    ],
  },
];

export default routes;
