FROM node:alphine
COPY package.json package.json
RUN npm install
COPY . .
CMD ["npm", "start"]