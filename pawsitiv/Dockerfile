# next-pawsitiv/Dockerfile

# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock files to leverage Docker cache
# This step is crucial for efficient caching. If dependencies don't change,
# Docker won't re-run 'npm install'.
COPY package.json yarn.lock* pnpm-lock.yaml* ./

# Install dependencies based on the lock file present
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
# 'npm run build' will create the optimized production build
RUN npm run build

# Stage 2: Run the Next.js application in a lightweight environment
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables for Next.js production server
# These are important for Next.js to run correctly in production mode.
# NEXT_PUBLIC_BASE_URL is used in your catProfile/page.tsx for internal API calls.
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_PUBLIC_BASE_URL http://localhost:3000 # Default for local testing, adjust for deployment

# Copy necessary files from the builder stage
# .next/standalone contains a self-contained output for running Next.js
# .next/static contains static assets (JS, CSS, images generated by Next.js)
# public contains your custom static assets (like custom.css, logo.png)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port on which the Next.js app will run
EXPOSE ${PORT}

# Command to run the Next.js application
# 'node server.js' is the entry point for the standalone output
CMD ["node", "server.js"]