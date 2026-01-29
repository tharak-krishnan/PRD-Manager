# Branch Protection and CI/CD Setup Guide

This guide explains how to set up branch protection rules and enable CI/CD for the PRD Manager project.

## Overview

The project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). All tests must pass before code can be merged to the main branch.

## CI/CD Pipeline

The `.github/workflows/ci.yml` file defines the complete CI/CD pipeline with the following jobs:

### 1. Backend Tests
- Runs on: Ubuntu latest with PostgreSQL 15
- Tests: All pytest tests with coverage
- Coverage: Reports to Codecov
- Python: 3.11

### 2. Frontend Tests
- Runs on: Ubuntu latest
- Tests: All Vitest tests with coverage
- Coverage: Reports to Codecov
- Node: 18

### 3. Docker Build Validation
- Validates: Docker images build successfully
- Tests: Docker Compose configuration
- Runs: Only after backend and frontend tests pass

### 4. Code Linting
- Backend: flake8 and black
- Frontend: ESLint

### 5. Security Scanning
- Tool: Trivy vulnerability scanner
- Reports: GitHub Security tab

## Setting Up Branch Protection

Follow these steps to enable branch protection on GitHub:

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Click **Add branch protection rule**

### Step 2: Configure Protection Rules for `main` Branch

**Branch name pattern**: `main`

#### Required Settings

**Protect matching branches:**
- [x] ✅ **Require a pull request before merging**
  - [x] Require approvals: **1** (recommended)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (optional)

- [x] ✅ **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - **Required status checks** (add these):
    - `Backend Tests`
    - `Frontend Tests`
    - `Docker Build Validation`
    - `Code Linting`
    - `All Tests Passed`

- [x] ✅ **Require conversation resolution before merging**
  - Ensures all PR comments are resolved

- [x] **Require signed commits** (optional but recommended)

- [x] **Require linear history** (optional)
  - Prevents merge commits, enforces rebase or squash

- [x] **Include administrators**
  - Applies rules to administrators too

#### Recommended Additional Settings

- [x] **Allow force pushes**: ❌ Never (protect history)
- [x] **Allow deletions**: ❌ Never (protect branch)

### Step 3: Configure Protection Rules for `develop` Branch (Optional)

If you use a develop branch for staging:

**Branch name pattern**: `develop`

Same settings as main, but you might want:
- Fewer required approvals (0 or 1)
- Can allow force pushes in develop (for rebasing)

### Step 4: Save the Rules

Click **Create** or **Save changes** at the bottom of the page.

## Workflow Triggers

The CI/CD pipeline automatically runs when:

1. **Push to main or develop**
   ```bash
   git push origin main
   ```

2. **Pull request opened/updated**
   ```bash
   gh pr create --base main
   ```

3. **Manual trigger** (can be added to workflow)

## CI/CD Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Push to main/develop or Create/Update Pull Request    │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐         ┌────────▼────────┐
│ Backend Tests  │         │ Frontend Tests  │
│   + Coverage   │         │   + Coverage    │
└───────┬────────┘         └────────┬────────┘
        │                           │
        └─────────────┬─────────────┘
                      │
              ┌───────▼────────┐
              │ Docker Build   │
              │  Validation    │
              └───────┬────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐         ┌────────▼────────┐
│ Code Linting   │         │Security Scan    │
└───────┬────────┘         └────────┬────────┘
        │                           │
        └─────────────┬─────────────┘
                      │
              ┌───────▼────────┐
              │  All Tests     │
              │    Passed      │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │ ✅ Ready to    │
              │    Merge       │
              └────────────────┘
```

## Required Status Checks

To prevent merging until all tests pass, add these as required status checks:

1. **Backend Tests** - All backend pytest tests pass
2. **Frontend Tests** - All frontend Vitest tests pass
3. **Docker Build Validation** - Docker images build successfully
4. **Code Linting** - Code meets style guidelines
5. **All Tests Passed** - Meta-check ensuring all jobs succeeded

## Pull Request Process

With branch protection enabled, the merge process is:

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create Pull Request**
   - Use GitHub UI or `gh pr create`
   - Fill out the PR template
   - CI/CD pipeline starts automatically

5. **Wait for Status Checks**
   - All tests must pass (green checkmarks)
   - Review any failures and fix

6. **Request Review** (if required)
   - Request review from team member
   - Address review comments

7. **Merge**
   - Click **Merge pull request** (only available when all checks pass)
   - Delete feature branch

## Troubleshooting CI/CD Failures

### Backend Tests Fail

```bash
# Run locally to debug
cd backend
pytest -v

# Check specific test
pytest tests/test_models.py::TestUserModel::test_user_creation -v
```

### Frontend Tests Fail

```bash
# Run locally to debug
npm test

# Run specific test
npm test Pagination.test
```

### Docker Build Fails

```bash
# Test locally
docker-compose build
docker-compose up
```

### Linting Fails

```bash
# Fix frontend linting
npm run lint

# Fix backend linting
cd backend
black app
flake8 app
```

## Bypassing Protection (Emergency Only)

If you're an admin and need to bypass protection rules in an emergency:

1. Go to Settings > Branches
2. Temporarily uncheck "Include administrators"
3. Merge your changes
4. Re-enable "Include administrators"

⚠️ **Not recommended** - Only use in critical production issues.

## Code Coverage Requirements (Optional)

You can add coverage thresholds to fail builds if coverage drops:

**Backend** (`backend/pytest.ini`):
```ini
[pytest]
addopts = --cov-fail-under=80
```

**Frontend** (`vitest.config.ts`):
```typescript
coverage: {
  lines: 70,
  functions: 70,
  branches: 70,
  statements: 70,
}
```

## Notifications

GitHub will send notifications when:
- CI/CD pipeline fails
- Pull request is ready for review
- Status checks complete
- Merge is blocked

Configure notifications in your GitHub settings.

## Best Practices

1. ✅ **Always create PRs** - Never push directly to main
2. ✅ **Keep PRs small** - Easier to review and test
3. ✅ **Write descriptive commit messages**
4. ✅ **Add tests for new features**
5. ✅ **Fix failing tests immediately**
6. ✅ **Keep dependencies updated** (Dependabot helps)
7. ✅ **Review security alerts** (from Trivy scanner)
8. ✅ **Resolve all PR comments** before merging

## GitHub Actions Secrets

The following secrets may be needed (set in Settings > Secrets):

- `CODECOV_TOKEN` - For code coverage reporting (optional)
- `DOCKER_HUB_TOKEN` - If pushing to Docker Hub
- `SLACK_WEBHOOK` - For Slack notifications (optional)

To add secrets:
1. Go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add name and value

## Monitoring

View CI/CD status:
- **Actions tab** - See all workflow runs
- **Pull Requests** - See status checks on each PR
- **Branches** - See protection status
- **Insights > Pulse** - See activity summary

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
