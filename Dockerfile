# Stage 1: Build the application
FROM node:14-alpine AS build

WORKDIR /app

# Clone the repository and switch to the latest branch
RUN apk add --no-cache git

#https://github.com/GovardhanGitHub/hr_frontend
RUN git clone https://github.com/GovardhanGitHub/hr_frontend.git . && git checkout master

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM nginx:stable-alpine

# Copy the built files to the nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the nginx server
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
