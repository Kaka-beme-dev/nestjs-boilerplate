#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mongo:27017
# 2️⃣ Tạo migration tự động
echo "🔧 Generating migrations..."
npm run migration:generate

# 3️⃣ Chạy migration
echo "🚀 Running migrations..."
npm run migrate:up

npm run seed:run:document
npm run start:prod > prod.log 2>&1 &
/opt/wait-for-it.sh maildev:1080
/opt/wait-for-it.sh localhost:3000
npm run lint
npm run test:e2e -- --runInBand
