# Testing Documentation

This document describes the testing strategy and how to run tests for the PRD Manager application.

## Overview

The application has comprehensive test coverage including:
- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test interactions between components and API endpoints
- **Functional Tests**: Test complete user workflows and features

## Backend Testing (Python/Flask)

### Test Framework
- **pytest**: Main testing framework
- **pytest-flask**: Flask-specific test utilities
- **pytest-cov**: Coverage reporting
- **faker**: Test data generation

### Running Backend Tests

```bash
# Navigate to backend directory
cd backend

# Install test dependencies (already in requirements.txt)
pip install -r requirements.txt

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_models.py

# Run specific test class
pytest tests/test_models.py::TestUserModel

# Run specific test
pytest tests/test_models.py::TestUserModel::test_user_creation

# Run tests by marker
pytest -m unit          # Run only unit tests
pytest -m integration   # Run only integration tests
pytest -m functional    # Run only functional tests
```

### Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py                    # Test fixtures and configuration
├── test_models.py                 # Unit tests for database models
├── test_routes_auth.py            # Integration tests for auth endpoints
├── test_routes_categories.py      # Integration tests for category/feature endpoints
├── test_routes_export.py          # Functional tests for export/import
└── test_services_export.py        # Unit tests for export services
```

### Test Fixtures

The `conftest.py` file provides the following fixtures:
- `app`: Flask application configured for testing
- `client`: Test client for making HTTP requests
- `auth_headers`: Authentication headers with JWT token
- `sample_user`: Pre-created test user
- `sample_category`: Pre-created test category
- `sample_feature`: Pre-created test feature
- `multiple_categories`: Multiple categories for testing
- `category_with_features`: Category with 10 features

### Backend Test Coverage

- **Models**: User, Category, Feature creation, validation, relationships
- **Authentication**: Registration, login, JWT token handling, role-based access control
- **Categories**: CRUD operations, cascade deletions, multi-project support
- **Features**: CRUD operations, validation, engineering signoff
- **Export Services**:
  - PowerPoint: Quarterly roadmap generation, pending estimation indicators, slide sizing (20" × 11.25")
  - Excel: Category sheets, feature metadata
  - Word: Table of contents, formatted feature tables
- **Import**: Excel file parsing and data loading
- **Integration**: Multi-project workflows, permission checks

## Frontend Testing (React/TypeScript)

### Test Framework
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing
- **jsdom**: Browser environment simulation
- **@testing-library/user-event**: User interaction simulation

### Running Frontend Tests

```bash
# From project root
npm test                    # Run tests in watch mode
npm run test:ui             # Run tests with UI
npm run test:coverage       # Run tests with coverage report

# Run specific test file
npm test Pagination.test

# Run tests matching a pattern
npm test -- --grep="Pagination"
```

### Test Structure

```
src/tests/
├── setup.ts                      # Test environment setup
├── testUtils.tsx                 # Testing utilities and helpers
├── components/
│   ├── Pagination.test.tsx       # Pagination component tests
│   └── Sidebar.test.tsx          # Sidebar component tests
└── integration/
    └── Dashboard.test.tsx        # Dashboard integration tests
```

### Testing Utilities

The `testUtils.tsx` file provides:
- `renderWithProviders()`: Render components with Router and Data context
- `mockCategories`: Sample category data
- `mockFeatures`: Sample feature data
- Re-exports of all React Testing Library utilities

### Frontend Test Coverage

- **Pagination Component**: Navigation, page numbers, disabled states
- **Sidebar Component**: Category list, navigation, add category
- **Dashboard Integration**: Export functionality, category management

## Writing New Tests

### Backend Test Example

```python
import pytest
from app.models import Category
from app import db

@pytest.mark.unit
def test_category_creation(client):
    """Test creating a new category"""
    category = Category(name='Test', description='Description')
    db.session.add(category)
    db.session.commit()

    assert category.id is not None
    assert category.name == 'Test'
```

### Frontend Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../testUtils';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Export Feature Testing

The export functionality has dedicated test coverage:

### PowerPoint (PPTX) Export Tests

```bash
# Run all export service tests
pytest backend/tests/test_services_export.py

# Run specific export tests
pytest backend/tests/test_services_export.py::TestRoadmapExporter::test_generate_pptx
pytest backend/tests/test_services_export.py::TestRoadmapExporter::test_pending_estimation_indicator
```

**Coverage:**
- Quarterly timeline generation (Q1, Q2, Q3, Q4)
- Date to quarter conversion (YYYY-MM → YYYY-QN)
- Quarter range generation and chunking (4 quarters per slide)
- Pending estimation indicators (dashed borders, ⏳ emoji)
- Slide dimensions (20" × 11.25" - 50% larger than standard)
- Legend inclusion on title slide
- Format helpers (short: "Q1 24", long: "Q1 2024")

### Excel/Word Export Tests

```bash
# Test PRD export functionality
pytest backend/tests/test_services_export.py::TestPRDExporter
```

**Coverage:**
- Excel workbook structure (category sheets, no summary)
- Word document formatting (TOC, tables)
- Empty category handling
- Metadata preservation

### Export Route Tests

```bash
# Test export API endpoints
pytest backend/tests/test_routes_export.py
```

**Coverage:**
- Authentication required for exports
- Error handling (no features with dates, no categories)
- Content type headers
- File format validation
- Import/export round-trip

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest --cov=app

- name: Run Frontend Tests
  run: |
    npm install
    npm run test:coverage
```

## Test Markers (Backend)

- `@pytest.mark.unit`: Unit tests (fast, isolated)
- `@pytest.mark.integration`: Integration tests (database, API)
- `@pytest.mark.functional`: Functional tests (complete workflows)

## Coverage Goals

- **Backend**: Aim for >80% code coverage
- **Frontend**: Aim for >70% code coverage
- **Critical paths**: 100% coverage (auth, data persistence)

## Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Use descriptive names**: Test names should clearly describe what they test
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Don't rely on external services
5. **Test edge cases**: Empty states, errors, boundary conditions
6. **Keep tests fast**: Unit tests should run in milliseconds
7. **Use fixtures wisely**: Share setup code but maintain test independence

## Debugging Tests

### Backend
```bash
# Run with verbose output
pytest -vv

# Run with print statements visible
pytest -s

# Drop into debugger on failure
pytest --pdb
```

### Frontend
```bash
# Run tests in UI mode for debugging
npm run test:ui

# Run a single test file
npm test -- Pagination.test.tsx
```

## Common Issues

### Backend
- **Database conflicts**: Tests use in-memory SQLite, each test gets a fresh database
- **JWT errors**: Use `auth_headers` fixture for authenticated requests
- **Import errors**: Ensure `PYTHONPATH` includes the backend directory

### Frontend
- **Component not found**: Check if component is properly exported
- **Mock not working**: Ensure mocks are defined before imports
- **Async errors**: Use `await waitFor()` for async operations

## Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
