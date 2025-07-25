# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the backend port
EXPOSE 3669

# Start the server
CMD ["node", "dist/app.js"]