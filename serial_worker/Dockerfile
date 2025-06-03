# Use official Node.js LTS image for building
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /build

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Use a smaller base image for the final image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

RUN chown -R node:node .
# Copy only the necessary files from the builder stage
COPY --from=builder --chown=node:node /build/drizzle ./drizzle
COPY --from=builder --chown=node:node /build/dist ./dist
COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY --from=builder --chown=node:node /build/package*.json ./

# Expose the port the app runs on
EXPOSE 3000

# Set a non-root user for security
USER node

# Start the app
CMD ["npm", "start"] 