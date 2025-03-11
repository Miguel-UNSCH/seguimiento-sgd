# 1. Etapa de construcción
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo en la fase de construcción
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache openssl

# Copiar y configurar dependencias
COPY package*.json ./
RUN npm install -g prisma && npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# 2. Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache openssl nginx nano tzdata

# Configurar la zona horaria a Lima, Perú
RUN cp /usr/share/zoneinfo/America/Lima /etc/localtime && \
    echo "America/Lima" > /etc/timezone

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Exponer el puerto en el que Next.js estará escuchando
EXPOSE 3000

# Iniciar Next.js directamente sin Nginx (opcional)
CMD ["npm", "start"]
