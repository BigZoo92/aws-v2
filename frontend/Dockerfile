FROM node:22.17.1-alpine3.22 AS builder

WORKDIR /app

COPY ./pnpm-lock.yaml frontend/package.json ./
RUN npm install -g pnpm && pnpm install

COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.app.json ./
COPY frontend/tsconfig.node.json ./
COPY tsconfig.base.json ../

COPY frontend .

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN pnpm run build

FROM node:22.17.1-alpine3.22

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
