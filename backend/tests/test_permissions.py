"""Tests for RBAC permission system"""
import pytest
from app.models import User, UserRole, Feature
from app.utils.permissions import (
    can_edit_feature,
    can_edit_engineering_fields,
    can_assign_engineer,
)


@pytest.mark.unit
class TestPermissionHelpers:
    """Tests for permission helper functions"""

    def test_admin_can_edit_any_feature(self):
        """Test that admin can edit any feature"""
        admin = User(username='admin', role=UserRole.ADMIN)
        admin.id = 1
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_feature(admin, feature) is True

    def test_pm_can_edit_any_feature(self):
        """Test that PM can edit any feature"""
        pm = User(username='pm', role=UserRole.PRODUCT_MANAGER)
        pm.id = 2
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_feature(pm, feature) is True

    def test_engineer_can_edit_assigned_feature(self):
        """Test that engineer can edit assigned feature"""
        engineer = User(username='engineer', role=UserRole.ENGINEER)
        engineer.id = 3
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = 3

        assert can_edit_feature(engineer, feature) is True

    def test_engineer_cannot_edit_unassigned_feature(self):
        """Test that engineer cannot edit unassigned feature"""
        engineer = User(username='engineer', role=UserRole.ENGINEER)
        engineer.id = 3
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_feature(engineer, feature) is False

    def test_viewer_cannot_edit_feature(self):
        """Test that viewer cannot edit any feature"""
        viewer = User(username='viewer', role=UserRole.VIEWER)
        viewer.id = 4
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_feature(viewer, feature) is False

    def test_admin_can_edit_engineering_fields(self):
        """Test that admin can edit engineering fields"""
        admin = User(username='admin', role=UserRole.ADMIN)
        admin.id = 1
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_engineering_fields(admin, feature) is True

    def test_pm_cannot_edit_engineering_fields(self):
        """Test that PM cannot edit engineering fields"""
        pm = User(username='pm', role=UserRole.PRODUCT_MANAGER)
        pm.id = 2
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_engineering_fields(pm, feature) is False

    def test_engineer_can_edit_engineering_fields_on_assigned(self):
        """Test that engineer can edit engineering fields on assigned feature"""
        engineer = User(username='engineer', role=UserRole.ENGINEER)
        engineer.id = 3
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = 3

        assert can_edit_engineering_fields(engineer, feature) is True

    def test_engineer_cannot_edit_engineering_fields_on_unassigned(self):
        """Test that engineer cannot edit engineering fields on unassigned feature"""
        engineer = User(username='engineer', role=UserRole.ENGINEER)
        engineer.id = 3
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_engineering_fields(engineer, feature) is False

    def test_viewer_cannot_edit_engineering_fields(self):
        """Test that viewer cannot edit engineering fields"""
        viewer = User(username='viewer', role=UserRole.VIEWER)
        viewer.id = 4
        feature = Feature(id='F-1', title='Test', category_id='cat-1')
        feature.assigned_engineer_id = None

        assert can_edit_engineering_fields(viewer, feature) is False

    def test_admin_can_assign_engineer(self):
        """Test that admin can assign engineers"""
        admin = User(username='admin', role=UserRole.ADMIN)
        assert can_assign_engineer(admin) is True

    def test_pm_can_assign_engineer(self):
        """Test that PM can assign engineers"""
        pm = User(username='pm', role=UserRole.PRODUCT_MANAGER)
        assert can_assign_engineer(pm) is True

    def test_engineer_cannot_assign_engineer(self):
        """Test that engineer cannot assign engineers"""
        engineer = User(username='engineer', role=UserRole.ENGINEER)
        assert can_assign_engineer(engineer) is False

    def test_viewer_cannot_assign_engineer(self):
        """Test that viewer cannot assign engineers"""
        viewer = User(username='viewer', role=UserRole.VIEWER)
        assert can_assign_engineer(viewer) is False


@pytest.mark.integration
class TestRoleBasedCategoryAccess:
    """Tests for role-based access to category endpoints"""

    def test_admin_can_create_category(self, client, admin_headers, sample_project):
        """Test that admin can create categories"""
        response = client.post(
            '/api/categories',
            headers=admin_headers,
            json={'name': 'Admin Category', 'project_id': sample_project.id}
        )
        assert response.status_code == 201

    def test_pm_can_create_category(self, client, pm_headers, sample_project):
        """Test that PM can create categories"""
        response = client.post(
            '/api/categories',
            headers=pm_headers,
            json={'name': 'PM Category', 'project_id': sample_project.id}
        )
        assert response.status_code == 201

    def test_engineer_cannot_create_category(self, client, engineer_headers):
        """Test that engineer cannot create categories"""
        response = client.post(
            '/api/categories', headers=engineer_headers, json={'name': 'Engineer Category'}
        )
        assert response.status_code == 403
        assert 'Insufficient permissions' in response.json['error']

    def test_viewer_cannot_create_category(self, client, viewer_headers):
        """Test that viewer cannot create categories"""
        response = client.post(
            '/api/categories', headers=viewer_headers, json={'name': 'Viewer Category'}
        )
        assert response.status_code == 403

    def test_admin_can_delete_category(self, client, admin_headers, sample_category):
        """Test that admin can delete categories"""
        response = client.delete(f'/api/categories/{sample_category.id}', headers=admin_headers)
        assert response.status_code == 200

    def test_pm_cannot_delete_category(self, client, pm_headers, sample_category):
        """Test that PM cannot delete categories"""
        response = client.delete(f'/api/categories/{sample_category.id}', headers=pm_headers)
        assert response.status_code == 403

    def test_engineer_cannot_delete_category(self, client, engineer_headers, sample_category):
        """Test that engineer cannot delete categories"""
        response = client.delete(f'/api/categories/{sample_category.id}', headers=engineer_headers)
        assert response.status_code == 403

    def test_viewer_cannot_delete_category(self, client, viewer_headers, sample_category):
        """Test that viewer cannot delete categories"""
        response = client.delete(f'/api/categories/{sample_category.id}', headers=viewer_headers)
        assert response.status_code == 403


@pytest.mark.integration
class TestRoleBasedFeatureAccess:
    """Tests for role-based access to feature endpoints"""

    def test_admin_can_create_feature_with_engineering_fields(
        self, client, admin_headers, sample_category
    ):
        """Test that admin can create feature with all fields including engineering"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=admin_headers,
            json={
                'title': 'Admin Feature',
                'engineeringComment': 'Admin comment',
                'engineeringSignoff': True,
                'engineeringComplexity': 'L',
            },
        )
        assert response.status_code == 201
        assert response.json['engineeringComment'] == 'Admin comment'
        assert response.json['engineeringSignoff'] is True
        assert response.json['engineeringComplexity'] == 'L'

    def test_pm_can_create_feature_but_not_engineering_fields(
        self, client, pm_headers, sample_category
    ):
        """Test that PM can create feature but engineering fields are filtered out"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=pm_headers,
            json={
                'title': 'PM Feature',
                'engineeringComment': 'PM comment',  # Should be filtered
                'engineeringSignoff': True,  # Should be filtered
                'engineeringComplexity': 'L',  # Should be filtered
            },
        )
        assert response.status_code == 201
        # Engineering fields should be default values, not the ones PM tried to set
        assert response.json['engineeringComment'] == ''
        assert response.json['engineeringSignoff'] is False
        assert response.json['engineeringComplexity'] == 'M'  # Default

    def test_engineer_cannot_create_feature(self, client, engineer_headers, sample_category):
        """Test that engineer cannot create features"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=engineer_headers,
            json={'title': 'Engineer Feature'},
        )
        assert response.status_code == 403

    def test_viewer_cannot_create_feature(self, client, viewer_headers, sample_category):
        """Test that viewer cannot create features"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=viewer_headers,
            json={'title': 'Viewer Feature'},
        )
        assert response.status_code == 403

    def test_engineer_can_update_engineering_fields_on_assigned_feature(
        self, client, engineer_headers, feature_assigned_to_engineer
    ):
        """Test that engineer can update engineering fields on assigned feature"""
        response = client.put(
            f'/api/features/{feature_assigned_to_engineer.id}',
            headers=engineer_headers,
            json={
                'engineeringComment': 'Updated by engineer',
                'engineeringSignoff': True,
                'engineeringComplexity': 'XL',
            },
        )
        assert response.status_code == 200
        assert response.json['engineeringComment'] == 'Updated by engineer'
        assert response.json['engineeringSignoff'] is True
        assert response.json['engineeringComplexity'] == 'XL'

    def test_engineer_cannot_update_non_engineering_fields(
        self, client, engineer_headers, feature_assigned_to_engineer
    ):
        """Test that engineer cannot update non-engineering fields"""
        original_title = feature_assigned_to_engineer.title

        response = client.put(
            f'/api/features/{feature_assigned_to_engineer.id}',
            headers=engineer_headers,
            json={
                'title': 'Should not change',
                'priority': 'High',
                'engineeringComment': 'This should change',
            },
        )
        assert response.status_code == 200
        # Title should not change
        assert response.json['title'] == original_title
        # Engineering comment should change
        assert response.json['engineeringComment'] == 'This should change'

    def test_engineer_cannot_update_unassigned_feature(
        self, client, engineer_headers, sample_feature
    ):
        """Test that engineer cannot update features not assigned to them"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=engineer_headers,
            json={'engineeringComment': 'Should not work'},
        )
        assert response.status_code == 403

    def test_pm_can_update_non_engineering_fields(self, client, pm_headers, sample_feature):
        """Test that PM can update non-engineering fields"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=pm_headers,
            json={'title': 'Updated by PM', 'priority': 'High'},
        )
        assert response.status_code == 200
        assert response.json['title'] == 'Updated by PM'
        assert response.json['priority'] == 'High'

    def test_pm_cannot_update_engineering_fields(self, client, pm_headers, sample_feature):
        """Test that PM cannot update engineering fields"""
        original_comment = sample_feature.engineering_comment

        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=pm_headers,
            json={
                'title': 'Updated title',
                'engineeringComment': 'Should not change',
                'engineeringSignoff': True,
            },
        )
        assert response.status_code == 200
        # Title should change
        assert response.json['title'] == 'Updated title'
        # Engineering fields should not change
        assert response.json['engineeringComment'] == original_comment

    def test_admin_can_update_all_fields(self, client, admin_headers, sample_feature):
        """Test that admin can update all fields including engineering"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=admin_headers,
            json={
                'title': 'Admin updated',
                'engineeringComment': 'Admin comment',
                'engineeringSignoff': True,
            },
        )
        assert response.status_code == 200
        assert response.json['title'] == 'Admin updated'
        assert response.json['engineeringComment'] == 'Admin comment'
        assert response.json['engineeringSignoff'] is True

    def test_viewer_cannot_update_feature(self, client, viewer_headers, sample_feature):
        """Test that viewer cannot update features"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=viewer_headers,
            json={'title': 'Should not work'},
        )
        assert response.status_code == 403

    def test_admin_can_delete_feature(self, client, admin_headers, sample_feature):
        """Test that admin can delete features"""
        response = client.delete(f'/api/features/{sample_feature.id}', headers=admin_headers)
        assert response.status_code == 200

    def test_pm_cannot_delete_feature(self, client, pm_headers, sample_feature):
        """Test that PM cannot delete features"""
        response = client.delete(f'/api/features/{sample_feature.id}', headers=pm_headers)
        assert response.status_code == 403

    def test_engineer_cannot_delete_feature(
        self, client, engineer_headers, feature_assigned_to_engineer
    ):
        """Test that engineer cannot delete features even if assigned"""
        response = client.delete(
            f'/api/features/{feature_assigned_to_engineer.id}', headers=engineer_headers
        )
        assert response.status_code == 403
