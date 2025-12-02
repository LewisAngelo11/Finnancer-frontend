# Usa node 18
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias (solo prod)
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Build Angular
RUN npm run build

# Exponer puerto
EXPOSE 8080

# Comando para iniciar el server CSR
CMD ["node", "server.csr.js"]
