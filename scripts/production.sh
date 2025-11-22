#!/bin/bash

# Production Deployment Script

echo "🚀 Starting Production Deployment..."

# Create logs directory
mkdir -p logs

# Build Backend
echo "📦 Building Backend..."
cd backend
npm install
npm run build
cd ..

# Build Frontend
echo "📦 Building Frontend..."
npm install
npm run build

# Start with PM2
echo "🚀 Starting with PM2..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.backend-cluster.config.js
pm2 start ecosystem.config.js --only profile-frontend

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (optional)
echo "💡 To setup PM2 startup, run: pm2 startup"
echo "   Then run: pm2 save"

echo "✅ Deployment Complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs"

