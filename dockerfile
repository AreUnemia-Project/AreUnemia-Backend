# Gunakan image node versi 20-alpine untuk base image yang lebih ringan
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy seluruh aplikasi ke dalam working directory
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]