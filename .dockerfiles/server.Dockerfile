FROM node:20-slim AS builder

# Create app directory
WORKDIR /build

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY db ./db/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim AS production

WORKDIR /app

RUN chown -R node:node /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder --chown=node:node /build/dist ./dist

COPY --from=builder --chown=node:node /build/flows ./flows

ENV NODE_ENV=production

ENV PORT=3000

EXPOSE 3000

USER node

CMD [ "npm", "run", "start:prod" ]
