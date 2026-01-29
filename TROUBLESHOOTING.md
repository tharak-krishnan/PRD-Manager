# Troubleshooting Guide

## Data Not Showing in UI

If projects and categories are not appearing in the application, follow these steps:

### Quick Fix

1. **Check if containers are running:**
   ```bash
   docker compose ps
   ```

2. **Restart the application:**
   ```bash
   docker compose down
   docker compose up --build
   ```

3. **Run database migrations:**
   ```bash
   docker compose exec backend flask db upgrade
   ```

4. **Seed the database:**
   ```bash
   docker compose exec backend python -c "from app.seed_data import seed_database; from app import create_app, db; app = create_app('development'); app.app_context().push(); seed_database()"
   ```

5. **Verify data exists:**
   ```bash
   docker compose exec backend python -c "from app.models import Project, Category; from app import create_app, db; app = create_app('development'); app.app_context().push(); print(f'Projects: {Project.query.count()}'); print(f'Categories: {Category.query.count()}')"
   ```

### User Credentials

After seeding, you can log in with these credentials:

| Username  | Password    | Role              |
|-----------|-------------|-------------------|
| admin     | admin123    | Admin             |
| pm        | pm123       | Product Manager   |
| engineer  | engineer123 | Engineer          |
| viewer    | viewer123   | Viewer            |

### Common Issues

#### Issue: "No projects found" message

**Cause:** Database is empty or not seeded

**Solution:**
```bash
# Seed the database
docker compose exec backend python app/seed_data.py
```

#### Issue: "Projects table does not exist"

**Cause:** Database migrations not run

**Solution:**
```bash
# Run migrations
docker compose exec backend flask db upgrade

# Then seed
docker compose exec backend python app/seed_data.py
```

#### Issue: Data disappeared after restart

**Cause:** Using SQLite with Docker volume not persisted

**Solution:**
Check `docker-compose.yml` for PostgreSQL configuration:
```yaml
services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Ensure this exists
volumes:
  postgres_data:  # Ensure this is defined
```

#### Issue: Old data from before multi-project migration

**Cause:** Need to run migration and re-seed

**Solution:**
```bash
# Backup existing database
docker compose exec db pg_dump -U postgres prd_manager > backup.sql

# Run migrations
docker compose exec backend flask db upgrade

# Re-seed (this will clear existing data)
docker compose exec backend python app/seed_data.py
```

### Verifying Data Load

1. **Frontend Check:**
   - Open browser to `http://localhost:5173`
   - Log in with any user credentials above
   - You should see "Default Project" in the project selector
   - Click to see 6 categories

2. **Backend Check:**
   ```bash
   # Check API directly
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'

   # Use the returned token
   curl http://localhost:5000/api/projects \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Database Check:**
   ```bash
   # Connect to database
   docker compose exec db psql -U postgres prd_manager

   # Run queries
   SELECT COUNT(*) FROM projects;
   SELECT COUNT(*) FROM categories;
   SELECT COUNT(*) FROM features;
   SELECT COUNT(*) FROM users;
   ```

## Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/tests/integration/DataLoading.test.tsx
```

### Backend Tests

```bash
# Run all tests
docker compose exec backend pytest

# Run with coverage
docker compose exec backend pytest --cov=app --cov-report=term-missing

# Run specific test file
docker compose exec backend pytest backend/tests/test_seed_data.py

# Run tests for data integrity
docker compose exec backend pytest backend/tests/test_seed_data.py::TestDataIntegrity
```

## Development Workflow

### Starting Fresh

If you need to completely reset your development environment:

```bash
# Stop and remove everything
docker compose down -v

# Remove node modules and reinstall (if needed)
rm -rf node_modules
npm install

# Start fresh
docker compose up --build

# Wait for containers to start, then:
docker compose exec backend flask db upgrade
docker compose exec backend python app/seed_data.py
```

### After Pulling New Code

```bash
# Pull latest changes
git pull

# Rebuild containers
docker compose up --build

# Run migrations (in case schema changed)
docker compose exec backend flask db upgrade

# Optionally re-seed if needed
docker compose exec backend python app/seed_data.py
```

## Monitoring Data State

### Add Data Integrity Checks

The application now includes comprehensive tests for data integrity:

- **Frontend:** `src/tests/integration/DataLoading.test.tsx` - Tests data loading flows
- **Backend:** `backend/tests/test_seed_data.py` - Tests seed data integrity

Run these tests regularly to ensure data is loading correctly:

```bash
# Frontend data loading tests
npm test -- src/tests/integration/DataLoading.test.tsx --run

# Backend seed data tests
docker compose exec backend pytest backend/tests/test_seed_data.py -v
```

### Automated Health Checks

Consider adding these to your CI/CD pipeline:

```bash
# Health check script
#!/bin/bash
set -e

echo "Checking database connection..."
docker compose exec backend python -c "from app import db, create_app; app = create_app('development'); app.app_context().push(); db.engine.connect()"

echo "Checking data exists..."
docker compose exec backend python -c "from app.models import Project, Category, User; from app import create_app, db; app = create_app('development'); app.app_context().push(); assert Project.query.count() > 0, 'No projects found'; assert Category.query.count() > 0, 'No categories found'; assert User.query.count() >= 4, 'Users not seeded'"

echo "✅ All checks passed!"
```

## Getting Help

If you're still experiencing issues:

1. Check Docker logs:
   ```bash
   docker compose logs backend
   docker compose logs frontend
   docker compose logs db
   ```

2. Check frontend console in browser (F12 → Console tab)

3. Run the full test suite to identify specific failures

4. Check the GitHub issues for similar problems
