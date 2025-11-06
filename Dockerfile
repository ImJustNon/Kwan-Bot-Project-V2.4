# Use Node.js v22 base image
FROM node:22-bullseye

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .


# Default command
CMD ["pnpm", "run", "dev"]