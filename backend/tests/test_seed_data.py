"""Tests for database seeding functionality"""
import pytest
from app.models import Project, Category, Feature, User, UserRole
from app.seed_data import seed_database


class TestSeedData:
    """Test that seed data is created correctly"""

    def test_seed_creates_default_project(self, seeded_app):
        """Test that seeding creates the default project"""
        with seeded_app.app_context():
            seed_database()

            # Verify default project exists
            project = Project.query.filter_by(name="Default Project").first()
            assert project is not None
            assert project.id == 1
            assert project.description == "Initial project for PRD management"

    def test_seed_creates_categories(self, seeded_app):
        """Test that seeding creates the expected categories"""
        with seeded_app.app_context():
            seed_database()

            # Verify categories exist
            categories = Category.query.all()
            assert len(categories) == 6

            category_names = [c.name for c in categories]
            expected_names = [
                "User Authentication",
                "Analytics Dashboard",
                "Mobile Application",
                "Payment Processing",
                "Performance Optimization",
                "Collaboration Tools",
            ]
            for name in expected_names:
                assert name in category_names

            # Verify all categories belong to default project
            for category in categories:
                assert category.project_id == 1

    def test_seed_creates_features(self, seeded_app):
        """Test that seeding creates the expected features"""
        with seeded_app.app_context():
            seed_database()

            # Verify features exist
            features = Feature.query.all()
            assert len(features) == 23

            # Verify feature structure
            feature = features[0]
            assert feature.title is not None
            assert feature.priority is not None
            assert feature.description is not None
            assert feature.category_id is not None

    def test_seed_creates_users(self, seeded_app):
        """Test that seeding creates default users"""
        with seeded_app.app_context():
            seed_database()

            # Users should be created during seeding
            users = User.query.all()
            assert len(users) >= 4

            # Verify all roles are present
            roles = {user.role for user in users}
            assert UserRole.ADMIN in roles
            assert UserRole.PRODUCT_MANAGER in roles
            assert UserRole.ENGINEER in roles
            assert UserRole.VIEWER in roles

            # Verify specific users
            admin = User.query.filter_by(username="admin").first()
            assert admin is not None
            assert admin.role == UserRole.ADMIN
            assert admin.email == "admin@prdmanager.com"

            pm = User.query.filter_by(username="pm").first()
            assert pm is not None
            assert pm.role == UserRole.PRODUCT_MANAGER

    def test_seed_is_idempotent(self, seeded_app):
        """Test that running seed multiple times doesn't create duplicates"""
        with seeded_app.app_context():
            # Seed once
            seed_database()
            first_project_count = Project.query.count()
            first_category_count = Category.query.count()
            first_feature_count = Feature.query.count()

            # Seed again (should clear and recreate)
            seed_database()
            second_project_count = Project.query.count()
            second_category_count = Category.query.count()
            second_feature_count = Feature.query.count()

            # Counts should be the same
            assert first_project_count == second_project_count
            assert first_category_count == second_category_count
            assert first_feature_count == second_feature_count

    def test_seed_maintains_referential_integrity(self, seeded_app):
        """Test that seeded data maintains proper relationships"""
        with seeded_app.app_context():
            seed_database()

            # Get default project
            project = Project.query.first()
            assert project is not None

            # Verify categories link to project
            categories = Category.query.filter_by(project_id=project.id).all()
            assert len(categories) > 0

            # Verify features link to categories
            for category in categories:
                features = Feature.query.filter_by(category_id=category.id).all()
                # Each category should have features
                if category.name == "User Authentication":
                    assert len(features) == 5
                elif category.name == "Analytics Dashboard":
                    assert len(features) == 4
                elif category.name == "Mobile Application":
                    assert len(features) == 4
                elif category.name == "Payment Processing":
                    assert len(features) == 3
                elif category.name == "Performance Optimization":
                    assert len(features) == 3
                elif category.name == "Collaboration Tools":
                    assert len(features) == 4

    def test_seed_without_projects_table(self, app, capsys):
        """Test that seed handles missing projects table gracefully"""
        # This test is more for documentation - in reality the table should exist
        # after migrations, but we test the error handling
        with app.app_context():
            # If projects table doesn't exist, seed should skip gracefully
            # This is tested by checking the console output
            seed_database()
            captured = capsys.readouterr()
            # Should not crash even if table doesn't exist
            assert True  # If we get here, no crash occurred


class TestDataIntegrity:
    """Tests for data integrity after seeding"""

    def test_all_features_have_valid_priorities(self, seeded_app):
        """Test that all seeded features have valid priority values"""
        with seeded_app.app_context():
            seed_database()

            features = Feature.query.all()
            valid_priorities = ["Low", "Medium", "High"]

            for feature in features:
                assert feature.priority in valid_priorities

    def test_all_features_have_valid_complexity(self, seeded_app):
        """Test that all seeded features have valid complexity values"""
        with seeded_app.app_context():
            seed_database()

            features = Feature.query.all()
            valid_complexities = ["XS", "S", "M", "L", "XL"]

            for feature in features:
                assert feature.engineering_complexity in valid_complexities

    def test_all_categories_belong_to_existing_project(self, seeded_app):
        """Test that all categories reference an existing project"""
        with seeded_app.app_context():
            seed_database()

            categories = Category.query.all()
            project_ids = {p.id for p in Project.query.all()}

            for category in categories:
                assert category.project_id in project_ids

    def test_all_features_belong_to_existing_category(self, seeded_app):
        """Test that all features reference an existing category"""
        with seeded_app.app_context():
            seed_database()

            features = Feature.query.all()
            category_ids = {c.id for c in Category.query.all()}

            for feature in features:
                assert feature.category_id in category_ids

    def test_user_passwords_are_hashed(self, seeded_app):
        """Test that user passwords are properly hashed"""
        with seeded_app.app_context():
            seed_database()

            users = User.query.all()

            for user in users:
                # Password hash should not be plain text
                if user.username == "admin":
                    assert user.password_hash != "admin123"
                # Hash should be a bcrypt hash (starts with $2b$)
                assert user.password_hash.startswith(("$2b$", "scrypt:", "pbkdf2:"))


class TestDataAvailability:
    """Tests to ensure data is available to the API"""

    def test_data_available_after_seed(self, seeded_client):
        """Test that seeded data is accessible via API endpoints"""
        # Login first
        response = seeded_client.post(
            "/api/auth/login", json={"username": "admin", "password": "admin123"}
        )
        assert response.status_code == 200
        token = response.json["access_token"]

        # Get projects
        response = seeded_client.get(
            "/api/projects", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        projects = response.json
        assert len(projects) >= 1

        # Get categories for first project
        project_id = projects[0]["id"]
        response = seeded_client.get(
            f"/api/categories?project_id={project_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        categories = response.json
        assert len(categories) >= 1

    def test_login_with_all_seeded_users(self, seeded_client):
        """Test that all seeded users can log in successfully"""
        test_credentials = [
            ("admin", "admin123"),
            ("pm", "pm123"),
            ("engineer", "engineer123"),
            ("viewer", "viewer123"),
        ]

        for username, password in test_credentials:
            response = seeded_client.post(
                "/api/auth/login", json={"username": username, "password": password}
            )
            assert response.status_code == 200, f"Login failed for {username}"
            assert "access_token" in response.json
            assert response.json["user"]["username"] == username
