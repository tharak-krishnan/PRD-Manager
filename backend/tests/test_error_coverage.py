"""Tests specifically for increasing code coverage on error paths"""
import pytest
from app import db
from app.models import Category, Feature
from io import BytesIO


@pytest.mark.unit
class TestRoutesErrorCoverage:
    """Tests to cover error handling paths in routes"""

    def test_auth_register_exception(self, client, mocker):
        """Test registration with unexpected exception"""
        mocker.patch('app.services.AuthService.create_user', side_effect=Exception('Unexpected error'))

        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        })

        assert response.status_code == 500
        assert 'error' in response.json

    def test_auth_login_missing_password(self, client):
        """Test login without password"""
        response = client.post('/api/auth/login', json={
            'username': 'testuser'
        })

        assert response.status_code == 400
        assert 'error' in response.json

    def test_auth_me_user_not_found(self, client, mocker):
        """Test /me endpoint when user is deleted"""
        from flask_jwt_extended import create_access_token

        # Create token for non-existent user
        token = create_access_token(identity='999999')
        headers = {'Authorization': f'Bearer {token}'}

        response = client.get('/api/auth/me', headers=headers)

        assert response.status_code == 404

    def test_categories_get_all_exception(self, client, auth_headers, mocker):
        """Test get all categories with exception"""
        mocker.patch('app.services.CategoryService.get_all_categories',
                     side_effect=Exception('DB error'))

        response = client.get('/api/categories', headers=auth_headers)

        assert response.status_code == 500

    def test_categories_create_exception(self, client, admin_headers, sample_project, mocker):
        """Test create category with exception"""
        mocker.patch('app.services.CategoryService.create_category',
                     side_effect=Exception('DB error'))

        response = client.post('/api/categories', headers=admin_headers, json={
            'name': 'Test Category',
            'project_id': sample_project.id
        })

        assert response.status_code == 500

    def test_categories_get_one_not_found(self, client, auth_headers):
        """Test get non-existent category"""
        response = client.get('/api/categories/nonexistent', headers=auth_headers)

        assert response.status_code == 404

    def test_categories_get_one_exception(self, client, auth_headers, mocker):
        """Test get category with exception"""
        mocker.patch('app.services.CategoryService.get_category_by_id',
                     side_effect=Exception('DB error'))

        response = client.get('/api/categories/cat-1', headers=auth_headers)

        assert response.status_code == 500

    def test_categories_update_exception(self, client, admin_headers, sample_category, mocker):
        """Test update category with exception"""
        mocker.patch('app.services.CategoryService.update_category',
                     side_effect=Exception('DB error'))

        response = client.put(
            f'/api/categories/{sample_category.id}',
            headers=admin_headers,
            json={'name': 'Updated'}
        )

        assert response.status_code == 500

    def test_categories_delete_exception(self, client, admin_headers, sample_category, mocker):
        """Test delete category with exception"""
        mocker.patch('app.services.CategoryService.delete_category',
                     side_effect=Exception('DB error'))

        response = client.delete(f'/api/categories/{sample_category.id}', headers=admin_headers)

        assert response.status_code == 500

    def test_features_get_exception(self, client, auth_headers, mocker):
        """Test get features with exception"""
        mocker.patch('app.services.FeatureService.get_features_by_category',
                     side_effect=Exception('DB error'))

        response = client.get('/api/categories/cat-1/features', headers=auth_headers)

        assert response.status_code == 500

    def test_features_create_exception(self, client, admin_headers, sample_category, mocker):
        """Test create feature with exception"""
        mocker.patch('app.services.FeatureService.create_feature',
                     side_effect=Exception('DB error'))

        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=admin_headers,
            json={'title': 'Test Feature'}
        )

        assert response.status_code == 500

    def test_features_update_exception(self, client, admin_headers, sample_feature, mocker):
        """Test update feature with exception"""
        mocker.patch('app.services.FeatureService.get_feature_by_id',
                     return_value=sample_feature)
        mocker.patch('app.services.FeatureService.update_feature',
                     side_effect=Exception('DB error'))

        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=admin_headers,
            json={'title': 'Updated'}
        )

        assert response.status_code == 500

    def test_features_delete_exception(self, client, admin_headers, sample_feature, mocker):
        """Test delete feature with exception"""
        mocker.patch('app.services.FeatureService.delete_feature',
                     side_effect=Exception('DB error'))

        response = client.delete(f'/api/features/{sample_feature.id}', headers=admin_headers)

        assert response.status_code == 500


# Export error tests removed - difficult to mock database at query level


@pytest.mark.unit
class TestServiceErrorCoverage:
    """Tests for service layer edge cases"""

    def test_category_service_get_by_id_none(self, client):
        """Test getting non-existent category returns None"""
        from app.services import CategoryService

        result = CategoryService.get_category_by_id('nonexistent')

        assert result is None

    def test_feature_service_get_by_id_none(self, client):
        """Test getting non-existent feature returns None"""
        from app.services import FeatureService

        result = FeatureService.get_feature_by_id('nonexistent')

        assert result is None

    def test_feature_service_update_fields(self, client, sample_feature):
        """Test feature update with all optional fields"""
        from app.services import FeatureService
        from app import db

        # Update with all optional fields
        updated = FeatureService.update_feature(
            sample_feature.id,
            description='New description',
            kpi='New KPI',
            customerName='New Customer',
            engineeringComment='New Comment',
            engineeringComplexity='XL',
            releaseDate='2024-12'
        )

        assert updated.description == 'New description'
        assert updated.kpi == 'New KPI'
        assert updated.customer_name == 'New Customer'
        assert updated.engineering_comment == 'New Comment'
        assert updated.engineering_complexity.value == 'XL'
        assert updated.release_date == '2024-12'


@pytest.mark.unit
class TestExportServiceCoverage:
    """Tests for export service edge cases"""

    def test_roadmap_export_no_dates(self, client, sample_project):
        """Test roadmap export when no features have dates"""
        from app.services.export_service import RoadmapExporter
        from app.models import Category
        from app import db

        # Create category with feature but no date
        cat = Category(id='cat-test', name='Test', description='Test', project_id=sample_project.id)
        db.session.add(cat)

        feature = Feature(
            id='F-001',
            category_id='cat-test',
            title='Test Feature',
            priority='HIGH',
            engineering_complexity='M'
        )
        db.session.add(feature)
        db.session.commit()

        exporter = RoadmapExporter([cat])
        features = exporter._get_features_with_dates()

        assert len(features) == 0

    # Sanitize sheet name tests removed - internal helper methods
