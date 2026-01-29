#!/bin/bash
set -e

echo "Running database migrations..."
docker exec prd-manager-backend flask db upgrade

echo "Seeding database..."
docker exec prd-manager-backend python -c "from app.seed_data import seed_database; from app import create_app, db; app = create_app('development'); app.app_context().push(); seed_database()"

echo "✅ Database setup complete!"
echo ""
echo "You can now login with:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "Or try: pm/pm123, engineer/engineer123, viewer/viewer123"
