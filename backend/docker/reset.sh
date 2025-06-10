#!/bin/bash

# Reset Docker services for Jobbsie backend (removes all data)
echo "⚠️  WARNING: This will delete ALL database data!"
read -p "Are you sure you want to continue? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo "🗑️  Stopping containers and removing volumes..."
    
    # Navigate to docker directory
    cd "$(dirname "$0")"
    
    # Stop services and remove volumes
    docker-compose down -v
    
    # Remove any orphaned containers
    docker-compose down --remove-orphans
    
    echo "🐳 Starting fresh containers..."
    docker-compose up -d
    
    # Wait a moment for services to start
    sleep 5
    
    echo "✅ Database reset completed!"
    echo "🗄️  PostgreSQL is available at: localhost:5432"
    echo "🖥️  pgAdmin is available at: http://localhost:5050"
    echo ""
    echo "📝 Run your Prisma migrations to recreate the schema:"
    echo "cd ../ && npx prisma migrate dev"
else
    echo "❌ Reset cancelled."
fi 