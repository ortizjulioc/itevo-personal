# 1. Etapa de base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Etapa de dependencias
FROM base AS deps
COPY package.json package-lock.json ./
# Usamos install para que no falle por el lockfile desincronizado
RUN npm install

# 3. Etapa de construcción (Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generamos el cliente de Prisma antes del build de Next.js
RUN npx prisma generate
RUN npm run build

# 4. Etapa de ejecución (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

# Copiamos solo lo necesario para que la imagen sea ligera
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3002

# Comando para iniciar la app en el puerto 3002
CMD ["npm", "start", "--", "-p", "3002"]