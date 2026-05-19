FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --prefer-offline && npm cache clean --force

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --prefer-offline

COPY . .

ARG MONGODB_URI
ARG JWT_SECRET

ENV MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017}
ENV JWT_SECRET=${JWT_SECRET:-default-secret-change-in-production}

RUN npm run build

FROM node:22-alpine AS production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]