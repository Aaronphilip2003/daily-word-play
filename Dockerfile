FROM node:18-bullseye-slim

WORKDIR /app

# Copy ONLY package.json first to avoid Mac-generated package-lock issues
COPY package.json ./

# Install all dependencies (including devDependencies for Vite/Rollup)
RUN npm install

# Now copy the rest of the app source
COPY . .

# Make sure node_modules from host are not copied:
# add "node_modules" to your .dockerignore file.

# Vite default dev port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
