FROM node:18

WORKDIR /app

# Copy only backend files
COPY backend/package*.json ./
RUN npm install

COPY backend ./

EXPOSE 8080

CMD ["node", "server.js"]