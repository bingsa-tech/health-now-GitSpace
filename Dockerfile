# Étape 1 : build (optionnel si tu veux transpiler TS)
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# Étape finale
FROM node:20-alpine

WORKDIR /app

# Copier uniquement node_modules et code source
COPY --from=build /app /app

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
RUN ls -la src/
