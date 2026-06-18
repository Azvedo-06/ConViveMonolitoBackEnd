# Stage 1: Build the NestJS application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies so sequelize-cli is available for migrations
RUN npm ci

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/migrations ./migrations
COPY --from=builder /usr/src/app/seeders ./seeders
COPY --from=builder /usr/src/app/config ./config
COPY --from=builder /usr/src/app/uploads ./uploads

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
