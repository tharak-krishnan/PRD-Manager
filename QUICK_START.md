# Quick Start Guide

## Current Status
- ✅ Frontend running on: http://localhost:5173
- ✅ Backend running on: http://localhost:5001
- ⚠️  Database needs setup

## Fix Login Issue

Run these commands **one at a time** in your terminal:

### Step 1: Access the backend container
```bash
docker exec -it prd-manager-backend sh
```

### Step 2: Inside the container, run:
```bash
cd /app
flask db upgrade
python seed_data.py
exit
```

### Step 3: Test login
Open http://localhost:5173 and login with:
- Username: **admin**
- Password: **admin123**

## Alternative: Restart Everything Fresh

If the above doesn't work:

```bash
# Stop all containers
docker compose down

# Start fresh
docker compose up -d --build

# Wait 30 seconds, then setup database
docker exec -it prd-manager-backend sh -c "cd /app && flask db upgrade && python seed_data.py"
```

## All User Credentials

| Username  | Password    | Role              |
|-----------|-------------|-------------------|
| admin     | admin123    | Admin             |
| pm        | pm123       | Product Manager   |
| engineer  | engineer123 | Engineer          |
| viewer    | viewer123   | Viewer            |

## Troubleshooting

### "docker exec" commands hang
If Docker commands are hanging, try:
1. Restart Docker Desktop
2. Or run: `killall Docker && open /Applications/Docker.app`
3. Wait for Docker to fully restart
4. Then run the setup commands above

### Backend shows error about missing tables
You need to run the migrations:
```bash
docker exec -it prd-manager-backend flask db upgrade
docker exec -it prd-manager-backend python seed_data.py
```

### Port 5000 is in use
The backend runs on port 5001 (not 5000). Make sure `.env` file has:
```
VITE_API_BASE_URL=http://localhost:5001/api
```

### Frontend not loading
```bash
npm run dev
```

## Verify Everything is Working

```bash
# Check containers are running
docker ps | grep prd-manager

# Check backend health
curl http://localhost:5001/api/auth/me

# Check frontend
open http://localhost:5173
```
