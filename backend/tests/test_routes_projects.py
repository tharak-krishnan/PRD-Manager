import pytest
from app import db
from app.models import Project, Category, Feature


@pytest.mark.integration
class TestProjectRoutes:
    """Integration tests for project routes"""

    def test_get_all_projects(self, client, auth_headers, multiple_projects):
        """Test getting all projects"""
        response = client.get('/api/projects', headers=auth_headers)

        assert response.status_code == 200
        assert len(response.json) == 3
        assert all('name' in proj for proj in response.json)
        assert all('id' in proj for proj in response.json)

    def test_get_projects_unauthorized(self, client, multiple_projects):
        """Test getting projects without authentication"""
        response = client.get('/api/projects')

        assert response.status_code == 401

    def test_get_single_project(self, client, auth_headers, sample_project):
        """Test getting a single project"""
        response = client.get(f'/api/projects/{sample_project.id}', headers=auth_headers)

        assert response.status_code == 200
        assert response.json['name'] == 'Test Project'
        assert response.json['id'] == sample_project.id

    def test_get_nonexistent_project(self, client, auth_headers):
        """Test getting a project that doesn't exist"""
        response = client.get('/api/projects/99999', headers=auth_headers)

        # Service returns None, route returns 404
        assert response.status_code == 404

    def test_create_project_as_admin(self, client, admin_headers):
        """Test creating a project as admin"""
        response = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'New Project', 'description': 'New project description'}
        )

        assert response.status_code == 201
        assert response.json['name'] == 'New Project'
        assert response.json['description'] == 'New project description'
        assert 'id' in response.json

    def test_create_project_as_pm(self, client, pm_headers):
        """Test creating a project as product manager"""
        response = client.post(
            '/api/projects',
            headers=pm_headers,
            json={'name': 'PM Project', 'description': 'PM created project'}
        )

        assert response.status_code == 201
        assert response.json['name'] == 'PM Project'

    def test_create_project_as_engineer(self, client, engineer_headers):
        """Test creating a project as engineer (should fail)"""
        response = client.post(
            '/api/projects',
            headers=engineer_headers,
            json={'name': 'Engineer Project', 'description': 'Should fail'}
        )

        assert response.status_code == 403

    def test_create_project_as_viewer(self, client, viewer_headers):
        """Test creating a project as viewer (should fail)"""
        response = client.post(
            '/api/projects',
            headers=viewer_headers,
            json={'name': 'Viewer Project', 'description': 'Should fail'}
        )

        assert response.status_code == 403

    def test_create_project_missing_name(self, client, admin_headers):
        """Test creating a project without name"""
        response = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'description': 'Missing name'}
        )

        assert response.status_code == 400
        assert 'error' in response.json

    def test_update_project_as_admin(self, client, admin_headers, sample_project):
        """Test updating a project as admin"""
        response = client.put(
            f'/api/projects/{sample_project.id}',
            headers=admin_headers,
            json={'name': 'Updated Project', 'description': 'Updated description'}
        )

        assert response.status_code == 200
        assert response.json['name'] == 'Updated Project'
        assert response.json['description'] == 'Updated description'

    def test_update_project_as_pm(self, client, pm_headers, sample_project):
        """Test updating a project as product manager"""
        response = client.put(
            f'/api/projects/{sample_project.id}',
            headers=pm_headers,
            json={'name': 'PM Updated'}
        )

        assert response.status_code == 200
        assert response.json['name'] == 'PM Updated'

    def test_update_project_as_engineer(self, client, engineer_headers, sample_project):
        """Test updating a project as engineer (should fail)"""
        response = client.put(
            f'/api/projects/{sample_project.id}',
            headers=engineer_headers,
            json={'name': 'Should Fail'}
        )

        assert response.status_code == 403

    def test_update_project_as_viewer(self, client, viewer_headers, sample_project):
        """Test updating a project as viewer (should fail)"""
        response = client.put(
            f'/api/projects/{sample_project.id}',
            headers=viewer_headers,
            json={'name': 'Should Fail'}
        )

        assert response.status_code == 403

    def test_update_nonexistent_project(self, client, admin_headers):
        """Test updating a project that doesn't exist"""
        response = client.put(
            '/api/projects/99999',
            headers=admin_headers,
            json={'name': 'Updated'}
        )

        assert response.status_code == 404

    def test_delete_project_as_admin(self, client, admin_headers, sample_project):
        """Test deleting a project as admin"""
        project_id = sample_project.id

        response = client.delete(f'/api/projects/{project_id}', headers=admin_headers)

        assert response.status_code == 200
        assert Project.query.get(project_id) is None

    def test_delete_project_as_pm(self, client, pm_headers, sample_project):
        """Test deleting a project as PM (should fail - admin only)"""
        response = client.delete(f'/api/projects/{sample_project.id}', headers=pm_headers)

        assert response.status_code == 403

    def test_delete_project_as_engineer(self, client, engineer_headers, sample_project):
        """Test deleting a project as engineer (should fail)"""
        response = client.delete(
            f'/api/projects/{sample_project.id}', headers=engineer_headers
        )

        assert response.status_code == 403

    def test_delete_project_as_viewer(self, client, viewer_headers, sample_project):
        """Test deleting a project as viewer (should fail)"""
        response = client.delete(f'/api/projects/{sample_project.id}', headers=viewer_headers)

        assert response.status_code == 403

    def test_delete_project_cascades_to_categories(
        self, client, admin_headers, sample_project, sample_category
    ):
        """Test that deleting a project cascades to its categories"""
        project_id = sample_project.id
        category_id = sample_category.id

        response = client.delete(f'/api/projects/{project_id}', headers=admin_headers)

        assert response.status_code == 200
        assert Project.query.get(project_id) is None
        assert Category.query.get(category_id) is None

    def test_delete_project_cascades_to_features(
        self, client, admin_headers, sample_project, category_with_features
    ):
        """Test that deleting a project cascades to categories and features"""
        project_id = sample_project.id
        category, features = category_with_features
        category_id = category.id
        feature_ids = [f.id for f in features]

        response = client.delete(f'/api/projects/{project_id}', headers=admin_headers)

        assert response.status_code == 200
        assert Project.query.get(project_id) is None
        assert Category.query.get(category_id) is None
        for feature_id in feature_ids:
            assert Feature.query.get(feature_id) is None

    def test_delete_nonexistent_project(self, client, admin_headers):
        """Test deleting a project that doesn't exist"""
        response = client.delete('/api/projects/99999', headers=admin_headers)

        assert response.status_code == 404
