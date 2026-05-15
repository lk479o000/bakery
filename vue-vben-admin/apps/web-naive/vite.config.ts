import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // 代理到bakery后端服务
            target: 'http://localhost:8150',
            ws: true,
          },
        },
      },
    },
  };
});
