# Stage 1: Build React app
FROM node:16 AS frontend-builder

# Set working directory for frontend build
WORKDIR /app/frontend

# Install dependencies and build the React app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:16 AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend ./

# Stage 3: Production image
FROM node:16

# Set working directory for both frontend and backend
WORKDIR /app

# Copy the built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Copy backend code from backend-builder stage
COPY --from=backend-builder /app/backend /app/backend

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --production

# Expose the ports the frontend and backend run on
EXPOSE 80 3000 5000

# Set environment variables for production
ENV NODE_ENV=production

# Serve the React app from the backend using a static file server
# Assuming your backend is using Express to serve the React app from the 'build' folder
CMD ["node", "server.js"]
