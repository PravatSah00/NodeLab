# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy compiled JavaScript files
COPY dist/ ./dist/

# Copy content folder
COPY content/ ./content/

# Install only production dependencies
RUN npm install --omit=dev

# Run the app
CMD ["node", "dist/index.js"]
