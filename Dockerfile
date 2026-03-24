FROM node:22-alpine
RUN apk add --no-cache python3 make g++ gcc git openssl
ENV TZ="Asia/Kolkata"
WORKDIR /var/app
COPY package.json .
RUN npm install -g pm2
RUN npm install 
COPY . .
RUN chmod +x /var/app/run-server.sh
ENTRYPOINT [ "sh", "/var/app/run-server.sh" ]
EXPOSE 8080