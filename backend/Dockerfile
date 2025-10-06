# ---- Frontend build stage ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY frontend/ .
RUN npm run build

# ---- Backend runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi
COPY backend/src ./src
# Copy built frontend into backend public dir
COPY --from=frontend-build /app/frontend/dist ./public
RUN mkdir -p /app/uploads
EXPOSE 8080
CMD ["node", "src/index.js"]
