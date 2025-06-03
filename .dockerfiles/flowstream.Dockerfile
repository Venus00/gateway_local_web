FROM node:16-alpine

VOLUME /www

WORKDIR /www

RUN mkdir -p /www/bundles

RUN chown -R node:node /www

COPY package.json .

RUN npm install

COPY --chown=node:node index.js .

COPY --chown=node:node config .

COPY --chown=node:node app.bundle ./bundles/

EXPOSE 8000

USER node
# Start the app
CMD ["node", "index.js", "8000"] 