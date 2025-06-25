# Use official Node.js 22 image
FROM node:22

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./

COPY prisma ./prisma
# RUN npm install -g yarn
RUN npm install -g nodemon ts-node
RUN yarn install
RUN npx prisma generate

# Copy source files
COPY . .

# Build TypeScript
RUN yarn build

# Command to run the bot
CMD ["node", "build/src/client.js"]
