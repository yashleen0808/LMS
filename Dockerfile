# Stage 1: Build the frontend (React app)
FROM node:18 AS frontend-build

# Set the working directory for frontend
WORKDIR /frontend

# Copy the frontend package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code
COPY frontend/ .

# Build the React app
RUN npm run build

# Stage 2: Set up the backend (Node.js API)
FROM node:18 AS backend-build

# Set the working directory for the backend
WORKDIR /backend

# Copy the backend package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the backend source code
COPY backend/ .

# Stage 3: Final image to serve both
FROM node:18

# Set working directories for both frontend and backend
WORKDIR /app

# Copy the backend from the backend-build stage
COPY --from=backend-build /backend /app

# Copy the built React app from the frontend-build stage to be served by the backend
COPY --from=frontend-build /frontend/build /app/public

# Expose port for backend
EXPOSE 5001

# Set environment variables (optional, adjust based on your app)
ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "start"]
