# Production image, copy all the files and run next
FROM node:23-alpine

# Install pm2
RUN npm install -g pm2

WORKDIR /app

# set timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

ENV NODE_ENV=production

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json ./package.json
COPY pm2.yml ./pm2.yml

EXPOSE 4011

CMD [ "pm2-runtime", "start", "pm2.yml" ]
