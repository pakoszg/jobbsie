#!/bin/bash

# Stop Docker services for Jobbsie backend
echo "🛑 Stopping PostgreSQL and pgAdmin containers..."

# Navigate to docker directory
cd "$(dirname "$0")"

# Stop services
docker-compose down

echo "✅ Services stopped successfully!" 