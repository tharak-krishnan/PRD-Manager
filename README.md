# PRD Manager

A full-stack Product Requirements Document (PRD) management application built with Flask (Python), React (TypeScript), and SQLite.

## Overview

PRD Manager helps product and engineering teams organize, track, and visualize product features across different categories with comprehensive metadata including priorities, engineering complexity, release dates, and stakeholder feedback.

**Key Features:**
- ✅ User authentication with JWT tokens
- ✅ Category management with CRUD operations
- ✅ Feature tracking with 9 metadata fields
- ✅ Product roadmap timeline visualization
- ✅ Persistent SQLite database
- ✅ REST API backend
- ✅ Docker containerization
- ✅ Pre-seeded with 23 sample features

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:5000/api
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker documentation.

### Option 2: Local Development

**Backend Setup:**

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
export FLASK_APP=run.py
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed database with sample data
python app/seed_data.py

# Start backend server
python run.py
```

**Frontend Setup:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Tech Stack

- **Backend**: Flask 3.0, SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **Frontend**: React 18, TypeScript, Axios, React Router, Tailwind CSS
- **Database**: SQLite (development)
- **Containerization**: Docker + Docker Compose

## Documentation

- [Docker Setup Guide](./DOCKER_SETUP.md) - Complete Docker documentation
- [API Documentation](#api-documentation) - REST API endpoints

## Features

- User authentication with JWT
- Category and feature CRUD operations
- Product roadmap visualization
- 6 pre-seeded categories with 23 features
- Dark theme UI with Tailwind CSS

---

_Originally generated with [Magic Patterns](https://magicpatterns.com) and enhanced with full-stack capabilities_
