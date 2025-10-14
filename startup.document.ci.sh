#!/usr/bin/env bash
set -e # Dừng script nếu có lệnh nào lỗi

/opt/wait-for-it.sh mongo:27017


# 3️ Chạy seed account
echo "🚀 StartUp CI  ==> Running seed account..."
npm run seed:run:document

# 2️⃣ Tạo migration tự động
# echo "🔧 StartUp CI  ==> Generating migrations..."
# npm run migration:generate

# 3️⃣ Chạy migration
# echo "🚀 StartUp CI  ==> Running migrations..."
# npm run migrate:up

echo "🚀 StartUp CI  ==> Waiting for Redis..."
/opt/wait-for-it.sh redis:6379 --timeout=30 --strict -- echo "Redis:6379 is ready!"

# echo "🚀 StartUp CI  ==> Starting NestJS authen app..."
# npm run start:prod > prod.log 2>&1 &
/opt/wait-for-it.sh maildev:1080  --timeout=30 --strict -- echo "MailDev:1080 is ready!"




echo "🚀 StartUp CI  ==> Starting NestJS authen app..."
 # > prod.log 2>&1   để ghi log ra file
npm run start:prod  > prod.log 2>&1


# /opt/wait-for-it.sh localhost:3000
# npm run lint
# npm run test:e2e -- --runInBand
