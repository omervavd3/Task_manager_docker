# Use an official Node.js image as the base
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend source code
COPY . .

# Expose port 3000 for the backend
EXPOSE 3000

# Start the NestJS app
CMD ["npm", "run", "start"]
