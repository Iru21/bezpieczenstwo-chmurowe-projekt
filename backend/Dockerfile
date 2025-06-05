FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /app
COPY . .
RUN pnpm install && pnpm build

EXPOSE 3000
CMD ["node", "dist/index.js"]