#!/bin/bash

# Start Docker services for Jobbsie backend
echo "🐳 Starting PostgreSQL and pgAdmin containers..."

# Navigate to docker directory
cd "$(dirname "$0")"

# Start services in detached mode
docker-compose up -d

# Wait a moment for services to start
sleep 5

# Check status
echo "📊 Container status:"
docker-compose ps

echo ""
echo "✅ Services started successfully!"
echo "🗄️  PostgreSQL is available at: localhost:6666"
echo "🖥️  pgAdmin is available at: http://localhost:5050"
echo ""
echo "📝 Don't forget to update your .env file with:"
echo "DATABASE_URL=\"postgresql://postgres:postgres123@localhost:6666/jobbsie?schema=public\"" 