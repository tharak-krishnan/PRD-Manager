# Docker Setup Guide for PRD Manager

This guide explains how to run the PRD Manager application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (includes Docker Compose)
- At least 2GB of free disk space
- Ports 80 and 5000 available

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api

### 3. Stop the Application

```bash
# Stop services (keeps data)
docker-compose stop

# Stop and remove containers (keeps data in volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## What Gets Created

### Services

**backend** (Flask API)
- Runs on port 5000
- SQLite database stored in Docker volume
- Auto-runs migrations and seeds data on startup
- All 6 categories and 23 features pre-loaded

**frontend** (React + Nginx)
- Runs on port 80
- Production-optimized build
- Nginx serves static files with caching

### Volumes

- `backend-db`: Persistent SQLite database storage

## Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

**Important**: Change the secret keys before deploying to production!

```
SECRET_KEY=your-super-secret-key-here-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-here-min-32-chars
```

## Development Workflow

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart a Service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose up --build backend

# Rebuild all
docker-compose up --build
```

### Access Backend Shell

```bash
docker-compose exec backend /bin/bash

# Inside container, you can:
# - Run migrations: flask db migrate
# - Seed data: python app/seed_data.py
# - Start Python shell: python
```

### Access Database

```bash
docker-compose exec backend python

# In Python shell:
>>> from app import create_app, db
>>> from app.models import Category, Feature, User
>>> app = create_app()
>>> with app.app_context():
...     categories = Category.query.all()
...     print(f"Total categories: {len(categories)}")
```

## Healthchecks

Both services include healthchecks:

```bash
# View service health status
docker-compose ps
```

## Troubleshooting

### Port Already in Use

If ports 80 or 5000 are already in use, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 80 to 8080
  backend:
    ports:
      - "5001:5000"  # Change 5000 to 5001
```

### Database Issues

Reset the database:

```bash
# Remove volume and restart
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading

Clear browser cache or try incognito mode.

Check frontend build logs:
```bash
docker-compose logs frontend
```

### Backend API Errors

Check backend logs:
```bash
docker-compose logs backend
```

Common issues:
- Migrations not run: Container auto-runs them on startup
- Seed data missing: Container auto-seeds on startup
- CORS errors: Check CORS_ORIGINS in docker-compose.yml

## Production Deployment

### Security Checklist

- [ ] Change SECRET_KEY to a strong random value
- [ ] Change JWT_SECRET_KEY to a strong random value
- [ ] Update CORS_ORIGINS to your production domain
- [ ] Use HTTPS (add reverse proxy like Nginx or Traefik)
- [ ] Consider using PostgreSQL instead of SQLite
- [ ] Set up proper backup strategy for database volume
- [ ] Enable rate limiting on API endpoints
- [ ] Review and harden security headers

### Using PostgreSQL (Production)

Update `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: prd_manager
      POSTGRES_USER: prd_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  backend:
    environment:
      - DATABASE_URL=postgresql://prd_user:${DB_PASSWORD}@db:5432/prd_manager
    depends_on:
      - db

volumes:
  postgres-data:
```

## Useful Commands

```bash
# View running containers
docker ps

# View images
docker images

# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# See resource usage
docker stats

# Export database backup
docker-compose exec backend sqlite3 /app/instance/prd_manager.db .dump > backup.sql
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP :80
       ▼
┌─────────────────┐
│  Nginx          │
│  (Frontend)     │
└──────┬──────────┘
       │
       │ API calls :5000
       ▼
┌─────────────────┐
│  Flask          │
│  (Backend)      │
└──────┬──────────┘
       │
       │ SQLAlchemy
       ▼
┌─────────────────┐
│  SQLite         │
│  (Database)     │
└─────────────────┘
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Verify services are healthy: `docker-compose ps`
3. Try rebuilding: `docker-compose up --build`
4. Check this file for troubleshooting tips
