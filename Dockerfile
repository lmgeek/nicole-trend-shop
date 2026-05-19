FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json next.config.js ./
RUN npm install && npm cache clean --force

COPY . .

ENV MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017}
ENV JWT_SECRET=${JWT_SECRET:-default-secret}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build -- --no-lint

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

CMD ["node", "standalone/server.js"]