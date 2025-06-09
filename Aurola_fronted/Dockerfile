# Etapa 1: construcción con Node.js
FROM node:18 as build

WORKDIR /app
COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build --prod
RUN ls -lh /app/dist/aurola-fronted  # ✅ AQUÍ SÍ FUNCIONA

# Etapa 2: servir con NGINX
FROM nginx:alpine
COPY --from=build /app/dist/aurola-fronted/browser/ /usr/share/nginx/html

EXPOSE 80
