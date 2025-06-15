# Use an official Node.js runtime as the base image
FROM node:18.18.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --force

# Copy the rest of the application code to the container
COPY . .

# Build the React.js application
RUN npm run build

# Expose the port that your React app will run on (usually 3000)
EXPOSE 3000

# Start the React app when the container runs
CMD ["npm", "start"]
