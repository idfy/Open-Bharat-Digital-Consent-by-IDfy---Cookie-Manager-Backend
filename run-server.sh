#!sh
npm install -g prisma@5.22.0
prisma generate
npx prisma migrate deploy
pm2 start app.js
pm2 log