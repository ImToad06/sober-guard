FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Build arguments for SvelteKit environment variables
ARG PUBLIC_BACKEND_URL
ARG PUBLIC_WS_URL
ENV PUBLIC_BACKEND_URL=${PUBLIC_BACKEND_URL}
ENV PUBLIC_WS_URL=${PUBLIC_WS_URL}

RUN bun run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev

ENV PORT=5173
EXPOSE ${PORT}
CMD ["node", "build"]
