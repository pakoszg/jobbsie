# Docker PostgreSQL Setup for Jobbsie Backend

This Docker setup provides a PostgreSQL database instance that Prisma can connect to for the Jobbsie application.

## Services

### PostgreSQL

- **Image**: `postgres:16-alpine` (latest stable version)
- **Container Name**: `jobbsie_postgres`
- **Port**: `6666` (mapped to host port 6666)
- **Database**: `jobbsie`
- **Username**: `postgres`
- **Password**: `postgres123`

### pgAdmin (Optional)

- **Image**: `dpage/pgadmin4:latest`
- **Container Name**: `jobbsie_pgadmin`
- **Port**: `5050` (accessible at http://localhost:5050)
- **Email**: `admin@jobbsie.com`
- **Password**: `admin123`

## Database URL

For your `.env` file, use:

```
DATABASE_URL="postgresql://postgres:postgres123@localhost:6666/jobbsie?schema=public"
```

## Quick Start

1. **Start the services**:

   ```bash
   cd backend/docker
   docker-compose up -d
   ```

2. **Update your `.env` file** in the backend root with:

   ```bash
   DATABASE_URL="postgresql://postgres:postgres123@localhost:6666/jobbsie?schema=public"
   ```

3. **Run Prisma migrations**:

   ```bash
   cd ../
   npx prisma migrate dev
   ```

4. **Seed the database** (if you have seed data):
   ```bash
   npx prisma db seed
   ```

## Available Commands

- **Start services**: `docker-compose up -d`
- **Stop services**: `docker-compose down`
- **View logs**: `docker-compose logs -f postgres`
- **Reset database**: `docker-compose down -v && docker-compose up -d`

## Database Access

### Via Application

Use this connection string in your `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres123@localhost:6666/jobbsie?schema=public"
```

### Via pgAdmin

1. Open http://localhost:5050
2. Login with:
   - Email: `admin@jobbsie.com`
   - Password: `admin123`
3. Add server connection:
   - Host: `postgres` (or `localhost` if connecting from host)
   - Port: `6666` (when connecting from host)
   - Database: `jobbsie`
   - Username: `postgres`
   - Password: `postgres123`

### Via Command Line

```bash
docker exec -it jobbsie_postgres psql -U postgres -d jobbsie
```

Or connect from host:

```bash
psql -h localhost -p 6666 -U postgres -d jobbsie
```

## Health Check

The PostgreSQL container includes a health check that verifies the database is ready to accept connections.

## Volumes

- `postgres_data`: Persistent storage for PostgreSQL data
- `pgadmin_data`: Persistent storage for pgAdmin settings

## Network

All services run on the `jobbsie_network` bridge network for internal communication.
