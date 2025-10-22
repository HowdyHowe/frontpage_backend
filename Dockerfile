# # ARG NODE_VERSION=22.20.0
# # FROM node:${NODE_VERSION}-alpine

# # WORKDIR /app

# # COPY package*.json ./

# # RUN npm install
# # RUN npm install -g ts-node-dev prisma

# # COPY . .

# # RUN npx prisma generate --schema=src/prisma/schema.prisma

# # EXPOSE 5000

# # CMD ["npm", "run", "dev"]

# # ARG NODE_VERSION=22.20.0
# # FROM node:${NODE_VERSION}-alpine

# # WORKDIR /app

# # COPY package*.json ./
# # RUN npm install

# # COPY . .

# # RUN npx prisma generate --schema=src/prisma/schema.prisma

# # EXPOSE 5000

# # CMD ["npm", "run", "dev"]

# ARG NODE_VERSION=22.20.0
# FROM node:${NODE_VERSION}-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npx prisma generate --schema=src/prisma/schema.prisma

# EXPOSE 5000

# CMD npx prisma db push --schema=src/prisma/schema.prisma && npm run dev

ARG NODE_VERSION=22.20.0
FROM node:${NODE_VERSION}-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 5000

CMD sh -c 'until nc -z db 3306; do echo "Waiting for database..."; sleep 2; done && npm run prisma:push && npm run dev'