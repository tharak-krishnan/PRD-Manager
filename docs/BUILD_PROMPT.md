# Structured Prompt: PRD Manager Application

## Project Overview

Build a full-stack Product Requirements Document (PRD) management application that helps product and engineering teams organize, track, and visualize product features with comprehensive metadata.

**Target Users:** Product Managers, Engineering Teams, Stakeholders
**Core Purpose:** Centralized feature planning, roadmap visualization, and cross-functional collaboration

---

## Tech Stack Requirements

### Backend
- **Framework:** Flask 3.0 (Python)
- **Database:** PostgreSQL 15
- **ORM:** SQLAlchemy with Flask-SQLAlchemy
- **Authentication:** JWT tokens via Flask-JWT-Extended
- **Migrations:** Flask-Migrate (Alembic)
- **CORS:** Flask-CORS for frontend integration

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS with dark theme
- **HTTP Client:** Axios
- **Build Tool:** Vite

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL container with persistent volumes
- **Web Server:** Nginx (for production frontend)

### Export Libraries
- **PowerPoint:** python-pptx
- **Excel:** openpyxl
- **Word:** python-docx

---

## Data Models

### 1. User Model
```
- id (integer, primary key)
- username (string, unique, required)
- email (string, unique, required)
- password_hash (string, required)
- role (enum: ADMIN, PRODUCT_MANAGER, ENGINEER, VIEWER)
- created_at (datetime)
```

### 2. Project Model
```
- id (integer, primary key)
- name (string, required)
- description (text)
- created_at (datetime)
- updated_at (datetime)
```

### 3. Category Model
```
- id (string, primary key, e.g., "1", "2")
- name (string, required)
- description (text)
- project_id (foreign key to Project)
- created_at (datetime)
- updated_at (datetime)
```

### 4. Feature Model
```
- id (string, primary key, e.g., "1.1", "1.2")
- category_id (foreign key to Category)
- title (string, required)
- description (text)
- priority (enum: High, Medium, Low)
- kpi (string)
- customer_name (string)
- engineering_comment (text)
- engineering_signoff (boolean)
- engineering_complexity (enum: XS, S, M, L, XL)
- release_date (string, format: "YYYY-MM" or "YYYY-QX")
- assigned_engineer_id (foreign key to User)
- signed_off_by_id (foreign key to User)
- created_at (datetime)
- updated_at (datetime)
```

---

## Feature Requirements

### Phase 1: Core Functionality (MVP)

#### Authentication & Authorization
- [x] User registration with email/username/password
- [x] JWT-based login with token refresh
- [x] Role-based access control (RBAC)
  - Admin: Full access to all features
  - Product Manager: Create/edit features and categories, assign engineers
  - Engineer: Edit engineering fields on assigned features
  - Viewer: Read-only access
- [x] First registered user automatically becomes Admin
- [x] Protected routes requiring authentication

#### Project Management
- [x] Multi-project support
- [x] Project CRUD operations (Admin/PM only)
- [x] Project selector in UI
- [x] Data isolation by project

#### Category Management
- [x] Create, read, update, delete categories
- [x] Assign categories to projects
- [x] Category filtering in UI
- [x] Cascading delete (categories → features)

#### Feature Management
- [x] Full CRUD operations for features
- [x] 9 metadata fields per feature:
  1. Title
  2. Description
  3. Priority (High/Medium/Low)
  4. KPI/Success Metrics
  5. Customer Name
  6. Engineering Comments
  7. Engineering Signoff Status
  8. Engineering Complexity (XS/S/M/L/XL)
  9. Release Date
- [x] Engineer assignment
- [x] Permission-based field editing
- [x] Feature detail page with shareable links

#### Product Roadmap
- [x] Quarterly timeline visualization
- [x] Color-coded by category
- [x] Priority indicators (H/M/L badges)
- [x] Pending estimation indicators (dashed borders, ⏳ emoji)
- [x] Responsive design for mobile/desktop

#### My Tasks (Engineer View)
- [x] Dedicated page showing assigned features
- [x] Filter features by engineer
- [x] Quick access to update engineering fields
- [x] Signoff workflow

#### User Management (Admin Only)
- [x] List all users
- [x] Update user roles
- [x] View engineers list (for assignment)

### Phase 2: Export & Import

#### Export Features
- [x] **PowerPoint Roadmap Export**
  - Quarterly timeline view (4 quarters per slide)
  - Color-coded category boxes
  - Priority indicators (H/M/L)
  - Pending estimation indicators (dashed borders + ⏳)
  - Legend explaining signed off vs. pending
  - Large format slides (20" × 11.25")
  - Multi-slide support for long timelines

- [x] **Excel PRD Export**
  - One sheet per category
  - All feature metadata columns
  - Formatted headers with color coding
  - Proper column widths

- [x] **Word PRD Export**
  - Table of contents
  - Professional document formatting
  - Organized by category
  - Feature tables with all metadata
  - Optimized for printing/PDF conversion

#### Import Features
- [x] Excel import for bulk feature updates
- [x] Validation and error handling
- [x] Category matching

---

## UI/UX Requirements

### Design System
- **Theme:** Dark mode with glassmorphism effects
- **Colors:**
  - Background: Gray-900 (#111827)
  - Cards: Gray-800/50 with backdrop blur
  - Borders: Gray-700/50
  - Accent: Blue-600
  - Success: Green-400
  - Warning: Yellow-400
  - Error: Red-400

### Layout
- **Sidebar Navigation:**
  - Dashboard (home)
  - Roadmap
  - My Tasks (engineers only)
  - Users (admin only)
  - Project selector dropdown
  - Logout button

- **Responsive Design:**
  - Mobile-first approach
  - Collapsible sidebar on mobile
  - Touch-friendly buttons
  - Adaptive table layouts

### Key UI Components
1. **Feature Table**
   - Sortable columns
   - Inline editing
   - Delete confirmation modals
   - Engineer assignment dropdown
   - Category filtering

2. **Feature Detail Page**
   - Breadcrumb navigation
   - Edit mode toggle
   - Shareable link with copy button
   - Priority badge
   - Complexity indicator
   - Signoff status

3. **Roadmap View**
   - Quarter headers (Q1, Q2, Q3, Q4)
   - Draggable/scrollable timeline
   - Feature cards with:
     - Title
     - Priority badge
     - Category color
     - Pending indicator
   - Export to PowerPoint button

4. **Modals**
   - Feature create/edit
   - Category create/edit
   - Delete confirmations
   - User role management

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login and get JWT token
GET    /api/auth/me                - Get current user info
```

### Projects
```
GET    /api/projects               - List all projects
POST   /api/projects               - Create project (Admin/PM)
GET    /api/projects/:id           - Get project details
PUT    /api/projects/:id           - Update project (Admin/PM)
DELETE /api/projects/:id           - Delete project (Admin)
```

### Categories
```
GET    /api/categories             - List categories (filtered by project)
POST   /api/categories             - Create category (Admin/PM)
GET    /api/categories/:id         - Get category with features
PUT    /api/categories/:id         - Update category (Admin/PM)
DELETE /api/categories/:id         - Delete category (Admin)
```

### Features
```
GET    /api/features               - List all features (filtered by project/category)
POST   /api/features               - Create feature
GET    /api/features/:id           - Get feature details
PUT    /api/features/:id           - Update feature (permission-based)
DELETE /api/features/:id           - Delete feature (Admin)
```

### Users
```
GET    /api/users                  - List all users (Admin only)
PUT    /api/users/:id/role         - Update user role (Admin only)
GET    /api/users/engineers        - List engineers (Admin/PM)
```

### Export
```
GET    /api/export/roadmap/pptx    - Export roadmap to PowerPoint
GET    /api/export/prd/excel       - Export PRD to Excel
GET    /api/export/prd/word        - Export PRD to Word
```

### Import
```
POST   /api/import/prd/excel       - Import features from Excel
```

---

## Permission Rules

### Feature Editing
| Role | Can Create | Can Edit | Can Delete | Special Rules |
|------|-----------|----------|------------|---------------|
| Admin | ✅ All fields | ✅ All features, all fields | ✅ Any feature | Full access |
| Product Manager | ✅ Non-engineering fields | ✅ Any feature, non-engineering fields | ❌ | Can assign engineers |
| Engineer | ❌ | ✅ Assigned features, engineering fields only | ❌ | Can signoff own work |
| Viewer | ❌ | ❌ | ❌ | Read-only |

### Engineering Fields
- `engineering_comment`
- `engineering_signoff`
- `engineering_complexity`
- `assigned_engineer_id` (Admin/PM can assign)
- `signed_off_by_id` (Auto-set on signoff)

---

## Testing Requirements

### Backend Tests (pytest)
- [x] Unit tests for all models
- [x] Integration tests for all routes
- [x] Permission/RBAC tests
- [x] Service layer tests
- [x] Export/import functionality tests
- [x] Multi-project isolation tests
- [x] Target: >90% code coverage

### Frontend Tests (Vitest + React Testing Library)
- [x] Component unit tests
- [x] Integration tests for key workflows
- [x] Auth context tests
- [x] Data context tests
- [x] Route protection tests
- [x] Form validation tests

---

## Deployment Requirements

### Docker Setup
```yaml
# Three services:
1. PostgreSQL database
   - Persistent volume for data
   - Health checks

2. Flask backend
   - Auto-run migrations
   - Seed sample data
   - Health endpoint

3. React frontend (Nginx)
   - Multi-stage build
   - Optimized production bundle
   - Reverse proxy to backend API
```

### Environment Variables
```
# Backend
DATABASE_URL=postgresql://user:pass@db:5432/dbname
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=development|production
CORS_ORIGINS=http://localhost,http://localhost:80

# Frontend
VITE_API_BASE_URL=http://localhost:5001/api
```

### Seed Data
- 4 default users (admin, pm, engineer, viewer)
- 1 default project
- 6 sample categories
- 23 sample features across categories
- Realistic data demonstrating all features

---

## Documentation Requirements

1. **README.md**
   - Project overview
   - Features list with checkmarks
   - Screenshots of key pages
   - Quick start (Docker + Local)
   - Tech stack
   - License (MIT)

2. **API Documentation**
   - Endpoint reference
   - Request/response examples
   - Authentication flow

3. **Development Guide**
   - Setup instructions
   - Database migrations
   - Testing commands
   - Code structure

4. **Docker Setup Guide**
   - Container architecture
   - Volume management
   - Troubleshooting
   - Production deployment

---

## Success Criteria

### Functional
- [x] All CRUD operations work correctly
- [x] RBAC properly enforces permissions
- [x] Multi-project data isolation works
- [x] Exports generate valid files
- [x] Import validates and processes data
- [x] Roadmap accurately visualizes timeline

### Non-Functional
- [x] All tests pass
- [x] >90% backend code coverage
- [x] Fast page load times (<2s)
- [x] Responsive on mobile/tablet/desktop
- [x] Docker setup works on first try
- [x] Clear error messages
- [x] Professional UI/UX

### Code Quality
- [x] TypeScript for type safety
- [x] Consistent code formatting
- [x] Clear component structure
- [x] RESTful API design
- [x] Proper error handling
- [x] Security best practices (password hashing, JWT, CORS)

---

## Example User Flows

### Flow 1: PM Creates Feature
1. PM logs in
2. Selects project from dropdown
3. Clicks "Add Feature" button
4. Fills out form (title, description, priority, KPI, customer, release date)
5. Cannot edit engineering fields (disabled)
6. Saves feature
7. Feature appears in table and roadmap

### Flow 2: Engineer Updates Assigned Feature
1. Engineer logs in
2. Navigates to "My Tasks"
3. Sees only features assigned to them
4. Clicks on a feature
5. Can only edit engineering fields (comment, complexity, signoff)
6. Marks as signed off
7. Signoff status updates, engineer name recorded

### Flow 3: Admin Exports Roadmap
1. Admin navigates to Roadmap view
2. Sees all features on timeline
3. Clicks "Export to PowerPoint"
4. Backend generates PPTX with:
   - Quarterly layout
   - Color-coded categories
   - Priority indicators
   - Pending estimation markers
5. File downloads automatically
6. Opens in PowerPoint with professional formatting

---

## Additional Considerations

### Security
- Password hashing with werkzeug.security
- JWT token expiration and refresh
- CORS configuration for allowed origins
- SQL injection prevention via ORM
- XSS prevention via React's default escaping
- Input validation on backend

### Performance
- Database indexing on foreign keys
- Lazy loading of relationships
- Pagination for large datasets (if needed)
- Optimized bundle size with code splitting
- CDN for static assets (production)

### Scalability
- Stateless backend (horizontal scaling possible)
- Database connection pooling
- Separate read/write replicas (future)
- Caching layer (Redis - future)

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios
- Screen reader friendly

---

## Out of Scope (Future Enhancements)

- Real-time collaboration (WebSockets)
- Comment threads on features
- File attachments
- Email notifications
- Activity audit log
- Custom fields
- Gantt chart view
- Integration with Jira/GitHub
- Mobile native apps
- Advanced analytics dashboard

---

## Development Approach

1. **Start with backend:**
   - Set up Flask app structure
   - Create database models
   - Implement authentication
   - Build API endpoints
   - Write tests

2. **Build frontend:**
   - Set up React + TypeScript + Vite
   - Create auth context
   - Build main pages (Dashboard, Roadmap, My Tasks)
   - Implement CRUD operations
   - Add permission checks
   - Write tests

3. **Add export/import:**
   - PowerPoint roadmap generation
   - Excel/Word PRD generation
   - Excel import functionality

4. **Dockerize:**
   - Create Dockerfiles
   - Set up docker-compose
   - Test full deployment

5. **Polish:**
   - Add loading states
   - Improve error handling
   - Enhance UI animations
   - Add screenshots to README
   - Write comprehensive docs

---

## Questions to Clarify Before Starting

1. Should the first user to register be auto-promoted to Admin, or should there be a default admin account?
2. What should happen to features when a category is deleted? (Cascade delete or prevent deletion)
3. Should release dates be stored as exact dates or just month/quarter strings?
4. Should there be a limit on the number of projects per installation?
5. Do we need audit logging to track who changed what and when?
6. Should engineers be able to reassign themselves, or only PM/Admin?
7. What should the default user role be for new registrations after the first user?
8. Should deleted features be soft-deleted or hard-deleted?

---

## Deliverables

- [ ] Full source code (backend + frontend)
- [ ] Comprehensive test suite
- [ ] Docker deployment setup
- [ ] README with screenshots
- [ ] API documentation
- [ ] Sample seed data
- [ ] MIT License
- [ ] GitHub repository with proper .gitignore
