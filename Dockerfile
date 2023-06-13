# Stage 1: Build the application
FROM node:14-alpine AS build

WORKDIR /app

# Install the Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a production-ready image
FROM node:14-alpine

WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Set the environment variables
ENV NODE_ENV=production

# Copy the Dont-use.env file
COPY Dont-use.env ./

# Expose the desired port
EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main.js"]
