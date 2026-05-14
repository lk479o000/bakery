/**
 * 环境配置
 * 根据 NODE_ENV 自动切换开发/生产环境
 */

interface EnvConfig {
  env: 'development' | 'production';
  apiBaseUrl: string;
  imageBaseUrl: string;
}

// 开发环境配置
const development: EnvConfig = {
  env: 'development',
  apiBaseUrl: 'http://localhost:8150/api',
  imageBaseUrl: 'http://localhost:8150/images'
};

// 生产环境配置
const production: EnvConfig = {
  env: 'production',
  apiBaseUrl: 'https://api.jisaybread.com/api',
  imageBaseUrl: 'https://cdn.jisaybread.com/images'
};

// 根据环境变量选择配置
export const env: EnvConfig = 
  process.env.NODE_ENV === 'production' ? production : development;

// 方便直接导出常用配置
export const { apiBaseUrl, imageBaseUrl } = env;
