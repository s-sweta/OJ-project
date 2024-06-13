FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache gcc g++ python3
COPY package.json .
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "index.js"]