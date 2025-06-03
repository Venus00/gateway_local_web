FROM node:22 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY db ./db/

# Install app dependencies
RUN npm install

COPY . .

# RUN npx prisma migrate dev --name init 
# RUN npx prisma migrate dev
RUN npm run build

# FROM node:20

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]