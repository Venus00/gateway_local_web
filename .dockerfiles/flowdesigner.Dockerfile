# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

RUN chown -R node:node /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY --chown=node:node . .

# Expose the port the app runs on
EXPOSE 8000

USER node
# Start the app
CMD ["node", "index.js", "8000"] 