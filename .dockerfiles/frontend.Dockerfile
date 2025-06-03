
FROM node:20-alpine as builder

WORKDIR /build

COPY package*.json ./

RUN npm i --force

COPY ./ ./

RUN npm run build

FROM node:20-alpine as prod

WORKDIR /app

RUN chown -R node:node /app

RUN npm install serve -g

COPY --from=builder --chown=node:node /server/front ./dist

USER node

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]