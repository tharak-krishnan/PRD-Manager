# CI/CD Quick Start Guide

Get your CI/CD pipeline running in 5 minutes!

## ✅ What's Included

Your repository now has:
- ✅ Automated testing on every push and PR
- ✅ Code coverage reporting
- ✅ Docker build validation
- ✅ Code linting (Python & JavaScript)
- ✅ Security vulnerability scanning
- ✅ Automatic dependency updates (Dependabot)
- ✅ Pull request template

## 🚀 Quick Setup (3 Steps)

### Step 1: Enable GitHub Actions (1 minute)

GitHub Actions is already enabled! Just push your code:

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 2: Set Up Branch Protection (2 minutes)

1. Go to your repo on GitHub
2. Click **Settings** → **Branches**
3. Click **Add branch protection rule**
4. Set branch name: `main`
5. Check these boxes:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
6. In "Status checks", search and add:
   - `Backend Tests`
   - `Frontend Tests`
   - `Docker Build Validation`
   - `Code Linting`
   - `All Tests Passed`
7. Click **Create**

### Step 3: Test It! (2 minutes)

Create a test PR to verify everything works:

```bash
# Create a new branch
git checkout -b test/ci-cd

# Make a small change
echo "# CI/CD is working!" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin test/ci-cd

# Create PR (using GitHub CLI or web interface)
gh pr create --title "Test CI/CD" --body "Testing the pipeline"
```

Watch the Actions tab - you'll see all tests running! ⚡

## 📊 What Happens Next

Every time you:
- Push to `main` or `develop`
- Open or update a Pull Request

GitHub will automatically:
1. Run all backend tests (pytest)
2. Run all frontend tests (vitest)
3. Validate Docker builds
4. Check code style (linting)
5. Scan for security vulnerabilities
6. Report test coverage
7. Post results on the PR

## 🎯 Using the CI/CD Pipeline

### Creating a Pull Request

```bash
# 1. Create feature branch
git checkout -b feature/awesome-feature

# 2. Make changes and commit
git add .
git commit -m "Add awesome feature"

# 3. Push to GitHub
git push origin feature/awesome-feature

# 4. Create PR (will trigger CI/CD)
gh pr create --base main --title "Add awesome feature"
```

### Watching Test Results

- Click on **Actions** tab to see all runs
- Click on a specific run to see detailed logs
- Green ✅ = All tests passed
- Red ❌ = Tests failed (click to see which one)

### When Tests Fail

1. Click on the failed job
2. Read the error message
3. Fix the issue locally
4. Push the fix (CI/CD runs again automatically)

```bash
# Fix the issue
npm test  # or cd backend && pytest

# Commit and push
git add .
git commit -m "Fix failing tests"
git push
```

## 🔧 Local Testing Before Pushing

**Backend:**
```bash
cd backend
pytest --cov=app
black app
flake8 app
```

**Frontend:**
```bash
npm test
npm run lint
```

**Docker:**
```bash
docker-compose build
docker-compose up
```

## 📈 Coverage Reports

Coverage reports are automatically generated:
- View in Actions tab under each test run
- HTML reports available as artifacts
- Optional: Set up Codecov for PR comments

## 🔒 Security Scanning

Trivy scans for vulnerabilities:
- Results in **Security** tab
- Alerts for critical issues
- Auto-updates via Dependabot

## 🤖 Dependabot

Automatic dependency updates:
- Checks weekly (every Monday)
- Creates PRs for updates
- CI/CD tests the updates automatically
- Merge if tests pass!

## ⚙️ Customization

### Change Test Coverage Thresholds

**Backend** (`backend/pytest.ini`):
```ini
addopts = --cov-fail-under=80
```

**Frontend** (`vitest.config.ts`):
```typescript
coverage: {
  lines: 70,
}
```

### Add New Status Checks

Edit `.github/workflows/ci.yml`:
```yaml
jobs:
  my-new-check:
    name: My New Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "My check"
```

Then add to required checks in branch protection.

### Add Slack Notifications

Add to workflow:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐛 Troubleshooting

### "Required status check is missing"

Solution: Make a commit and push - the check will appear after first run.

### "Cannot merge - checks not passing"

Solution: Fix the failing tests and push again.

### "Action timeout"

Solution: Tests taking too long? Optimize or increase timeout in workflow.

### Can't see Actions tab

Solution: Enable Actions in Settings → Actions → General.

## 📚 Full Documentation

For detailed information, see:
- [Branch Protection Setup](./.github/BRANCH_PROTECTION.md)
- [Testing Guide](../TESTING.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## ✨ Best Practices

1. ✅ **Never skip tests** - They catch bugs early
2. ✅ **Write tests for new code** - Keep coverage high
3. ✅ **Review security alerts** - Fix vulnerabilities quickly
4. ✅ **Keep dependencies updated** - Merge Dependabot PRs
5. ✅ **Use descriptive commit messages** - Easy to track changes
6. ✅ **Small, focused PRs** - Faster reviews, easier testing

## 🎉 You're All Set!

Your CI/CD pipeline is now protecting your codebase. Every merge is tested, secure, and validated!

Questions? Check the [full documentation](./.github/BRANCH_PROTECTION.md) or create an issue.

---

**Next Steps:**
1. ✅ Set up branch protection (Step 2 above)
2. ✅ Create a test PR (Step 3 above)
3. ✅ Add Codecov token (optional, in repo secrets)
4. ✅ Configure Slack notifications (optional)
5. ✅ Celebrate! 🎉
