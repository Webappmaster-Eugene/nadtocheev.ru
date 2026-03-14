# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN test -f package.json || (echo "ERROR: package.json not found — check build context" && exit 1)
RUN npm ci
COPY . .
RUN npm run build
RUN test -f dist/index.html || (echo "ERROR: dist/index.html not found — build produced no output" && exit 1)

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
