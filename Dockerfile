# Dockerfile para API REST de Películas
# Node.js Backend con Express

# Etapa 1: Imagen base
FROM node:20-alpine

# Metadatos
LABEL maintainer="carol104"
LABEL description="API REST de películas - CRUD completo con Express"
LABEL version="1.0.0"

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar caché de Docker)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Cambiar propietario de los archivos
RUN chown -R nodeuser:nodejs /app

# Cambiar a usuario no-root
USER nodeuser

# Exponer el puerto de la aplicación
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV STORAGE=json

# Health check para Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando para iniciar la aplicación
CMD ["node", "app.js"]
