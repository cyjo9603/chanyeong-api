# Rebuild the source code only when needed
FROM node:23-alpine AS builder
WORKDIR /app

COPY . .

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

# Install pm2
RUN npm install -g pm2

WORKDIR /app

# set timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pm2.yml ./pm2.yml

EXPOSE 4011

CMD [ "pm2-runtime", "start", "pm2.yml" ]