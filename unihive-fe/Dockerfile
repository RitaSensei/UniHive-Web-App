# Stage 1: Build the frontend
FROM node:current as build-frontend
WORKDIR /app/unihive-fe
COPY /unihive-fe/package*.json ./
RUN npm install
COPY unihive-fe/ ./
RUN npm run build

# Stage 2: Serve the frontend
FROM nginx:alpine
COPY --from=build-frontend /app/unihive-fe/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
