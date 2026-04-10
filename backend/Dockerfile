FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
ENV PORT=3000
EXPOSE ${PORT}
CMD ["bun", "run", "src/index.ts"]
