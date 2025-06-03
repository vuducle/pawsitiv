FROM node:20-alpine as builder
LABEL authors="vu, malte, sophia, leticia"

# Stage 1: Build the backend application
WORKDIR /app
COPY package.json package-lock.json pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

COPY . .


#EXPOSE 3000

# Stage 2: Run the backend application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3669

COPY --from=builder /app ./

EXPOSE ${PORT}

CMD ["npm", "start"]

