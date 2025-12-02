# Use Node 18
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build Angular
RUN npm run build


# ---- Runtime stage ----
FROM node:18-alpine

WORKDIR /app

# Copy built dist only
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.csr.js ./
COPY --from=build /app/package*.json ./

# Install only production deps for runtime
RUN npm install --omit=dev

EXPOSE 8080

CMD ["node", "server.csr.js"]
