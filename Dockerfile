FROM node:14-alpine

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .
EXPOSE 4000
CMD ["npm", "start"]