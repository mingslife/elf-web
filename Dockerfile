FROM node:16.3-alpine as build
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npm.taobao.org \
  && npm install && npm run build

FROM nginx:1.21-alpine as run
COPY --from=build /app/dist /usr/share/nginx/html
