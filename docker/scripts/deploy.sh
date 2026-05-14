#!/bin/bash

set -e

echo "=== 开始部署 Bakery 项目 ==="

cd "$(dirname "$0")/.."

echo "1. 构建后端服务..."
cd ..
mvn clean package -DskipTests -q
cd docker

echo "2. 创建必要目录..."
mkdir -p mysql/data mysql/conf.d logs ssl

echo "3. 启动容器..."
docker-compose up -d

echo "4. 查看容器状态..."
docker-compose ps

echo "=== 部署完成 ==="
echo "访问地址: http://localhost"
echo "API地址: http://localhost:8150/api"