FROM node:22.17.1-alpine3.22 AS builder

WORKDIR /app

COPY ./pnpm-lock.yaml backend/package.json ./
RUN npm install -g pnpm && pnpm install

COPY backend/tsconfig.json ./
COPY tsconfig.base.json ../
COPY backend/src ./src

RUN pnpm run build

FROM node:22.17.1-alpine3.22

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY backend/package.json ./

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]

