#!/bin/bash

set -e

echo "=== 启动开发环境 ==="

cd "$(dirname "$0")/.."

echo "1. 创建必要目录..."
mkdir -p mysql/data mysql/conf.d

echo "2. 启动开发环境容器..."
cd dev
docker-compose up -d

echo "3. 查看容器状态..."
docker-compose ps

echo "=== 开发环境启动完成 ==="
echo "API地址: http://localhost:8150/api"
echo "数据库: localhost:3306"
echo "用户名: root"
echo "密码: root123"
