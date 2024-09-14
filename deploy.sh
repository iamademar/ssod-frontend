#!/bin/bash

# Pull the latest code
git pull origin main

# Install dependencies
npm install

# Build the Next.js application
npm run build

# Check if the PM2 process already exists
pm2 describe ssod-frontend > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  # Start the application with PM2 if it's not already running
  pm2 start npm --name "ssod-frontend" -- start
else
  # Restart the application if it's already running
  pm2 restart ssod-frontend
fi

# Save the PM2 process list
pm2 save