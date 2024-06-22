FROM oven/bun:alpine as build-stage
WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .
RUN bun run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]