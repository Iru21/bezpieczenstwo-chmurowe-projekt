FROM node:20-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]