FROM docker.io/node:lts-alpine as deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install @nestjs/cli -g
RUN npm ci --only=production

COPY . .

RUN npm run build

FROM docker.io/node:lts-alpine as runner

RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/dist .

#RUN chown -R node:node .
#USER node

EXPOSE 3000

CMD ["dumb-init", "npx", "pm2-runtime", "main.js"]