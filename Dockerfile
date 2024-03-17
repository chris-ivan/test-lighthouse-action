# Dockerfile
FROM node:16.14.0-alpine as base
RUN apk add --no-cache curl \
    && curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN pnpm install --silent

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]