"""Tests for user management routes"""
import pytest
from app.models import UserRole


@pytest.mark.integration
class TestUserRoutes:
    """Integration tests for user management routes"""

    def test_admin_can_get_all_users(self, client, admin_headers, pm_user, engineer_user):
        """Test that admin can get all users"""
        response = client.get('/api/users', headers=admin_headers)

        assert response.status_code == 200
        assert len(response.json) >= 3  # At least admin, pm, engineer
        assert all('role' in user for user in response.json)

    def test_pm_cannot_get_all_users(self, client, pm_headers):
        """Test that PM cannot get all users"""
        response = client.get('/api/users', headers=pm_headers)

        assert response.status_code == 403
        assert 'Insufficient permissions' in response.json['error']

    def test_engineer_cannot_get_all_users(self, client, engineer_headers):
        """Test that engineer cannot get all users"""
        response = client.get('/api/users', headers=engineer_headers)

        assert response.status_code == 403

    def test_viewer_cannot_get_all_users(self, client, viewer_headers):
        """Test that viewer cannot get all users"""
        response = client.get('/api/users', headers=viewer_headers)

        assert response.status_code == 403

    def test_admin_can_update_user_role(self, client, admin_headers, viewer_user):
        """Test that admin can update user role"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role',
            headers=admin_headers,
            json={'role': 'product_manager'},
        )

        assert response.status_code == 200
        assert response.json['role'] == 'product_manager'

    def test_admin_can_update_role_to_admin(self, client, admin_headers, viewer_user):
        """Test that admin can promote users to admin"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role', headers=admin_headers, json={'role': 'admin'}
        )

        assert response.status_code == 200
        assert response.json['role'] == 'admin'

    def test_admin_update_role_invalid_role(self, client, admin_headers, viewer_user):
        """Test that updating to invalid role fails"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role',
            headers=admin_headers,
            json={'role': 'invalid_role'},
        )

        assert response.status_code == 400
        assert 'Invalid role' in response.json['error']

    def test_admin_update_role_missing_role(self, client, admin_headers, viewer_user):
        """Test that updating without role field fails"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role', headers=admin_headers, json={}
        )

        assert response.status_code == 400
        assert 'Role is required' in response.json['error']

    def test_pm_cannot_update_user_role(self, client, pm_headers, viewer_user):
        """Test that PM cannot update user roles"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role',
            headers=pm_headers,
            json={'role': 'product_manager'},
        )

        assert response.status_code == 403

    def test_engineer_cannot_update_user_role(self, client, engineer_headers, viewer_user):
        """Test that engineer cannot update user roles"""
        response = client.put(
            f'/api/users/{viewer_user.id}/role', headers=engineer_headers, json={'role': 'engineer'}
        )

        assert response.status_code == 403

    def test_admin_can_get_engineers(self, client, admin_headers, engineer_user):
        """Test that admin can get list of engineers"""
        response = client.get('/api/users/engineers', headers=admin_headers)

        assert response.status_code == 200
        assert len(response.json) >= 1
        engineer_ids = [u['id'] for u in response.json]
        assert engineer_user.id in engineer_ids

    def test_pm_can_get_engineers(self, client, pm_headers, engineer_user):
        """Test that PM can get list of engineers"""
        response = client.get('/api/users/engineers', headers=pm_headers)

        assert response.status_code == 200
        assert len(response.json) >= 1
        engineer_ids = [u['id'] for u in response.json]
        assert engineer_user.id in engineer_ids

    def test_engineer_cannot_get_engineers(self, client, engineer_headers):
        """Test that engineer cannot get list of engineers"""
        response = client.get('/api/users/engineers', headers=engineer_headers)

        assert response.status_code == 403

    def test_viewer_cannot_get_engineers(self, client, viewer_headers):
        """Test that viewer cannot get list of engineers"""
        response = client.get('/api/users/engineers', headers=viewer_headers)

        assert response.status_code == 403

    def test_unauthorized_cannot_access_users(self, client):
        """Test that unauthorized users cannot access user endpoints"""
        response = client.get('/api/users')
        assert response.status_code == 401

        response = client.get('/api/users/engineers')
        assert response.status_code == 401

        response = client.put('/api/users/1/role', json={'role': 'admin'})
        assert response.status_code == 401


@pytest.mark.integration
class TestFirstUserAdmin:
    """Test first user becomes admin"""

    def test_first_registered_user_is_admin(self, client):
        """Test that the first registered user gets admin role"""
        response = client.post(
            '/api/auth/register',
            json={'username': 'first', 'email': 'first@test.com', 'password': 'pass123'},
        )

        assert response.status_code == 201
        assert response.json['user']['role'] == 'admin'

    def test_second_registered_user_is_viewer(self, client, admin_user):
        """Test that the second registered user gets viewer role"""
        response = client.post(
            '/api/auth/register',
            json={'username': 'second', 'email': 'second@test.com', 'password': 'pass123'},
        )

        assert response.status_code == 201
        assert response.json['user']['role'] == 'viewer'


@pytest.mark.integration
class TestEngineerAssignment:
    """Tests for engineer assignment workflow"""

    def test_admin_can_assign_engineer_to_feature(
        self, client, admin_headers, sample_category, engineer_user
    ):
        """Test that admin can assign engineer when creating feature"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=admin_headers,
            json={'title': 'Assigned Feature', 'assignedEngineerId': engineer_user.id},
        )

        assert response.status_code == 201
        assert response.json['assignedEngineerId'] == engineer_user.id

    def test_pm_can_assign_engineer_to_feature(
        self, client, pm_headers, sample_category, engineer_user
    ):
        """Test that PM can assign engineer when creating feature"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=pm_headers,
            json={'title': 'PM Assigned Feature', 'assignedEngineerId': engineer_user.id},
        )

        assert response.status_code == 201
        assert response.json['assignedEngineerId'] == engineer_user.id

    def test_admin_can_update_engineer_assignment(
        self, client, admin_headers, sample_feature, engineer_user
    ):
        """Test that admin can update engineer assignment"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=admin_headers,
            json={'assignedEngineerId': engineer_user.id},
        )

        assert response.status_code == 200
        assert response.json['assignedEngineerId'] == engineer_user.id

    def test_pm_can_update_engineer_assignment(
        self, client, pm_headers, sample_feature, engineer_user
    ):
        """Test that PM can update engineer assignment"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=pm_headers,
            json={'assignedEngineerId': engineer_user.id},
        )

        assert response.status_code == 200
        assert response.json['assignedEngineerId'] == engineer_user.id
