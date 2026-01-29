import pytest
from app import db
from app.models import Category, Feature


@pytest.mark.integration
class TestCategoryRoutes:
    """Integration tests for category routes"""

    def test_get_all_categories(self, client, auth_headers, multiple_categories):
        """Test getting all categories"""
        response = client.get('/api/categories', headers=auth_headers)

        assert response.status_code == 200
        assert len(response.json) == 5
        assert all('name' in cat for cat in response.json)

    def test_get_categories_unauthorized(self, client):
        """Test getting categories without authentication"""
        response = client.get('/api/categories')

        assert response.status_code == 401

    def test_create_category(self, client, auth_headers):
        """Test creating a new category"""
        response = client.post('/api/categories', headers=auth_headers, json={
            'name': 'New Category',
            'description': 'New description'
        })

        assert response.status_code == 201
        assert response.json['name'] == 'New Category'
        assert response.json['description'] == 'New description'
        assert 'id' in response.json

    def test_create_category_missing_name(self, client, auth_headers):
        """Test creating category without name"""
        response = client.post('/api/categories', headers=auth_headers, json={
            'description': 'Description only'
        })

        assert response.status_code == 400

    def test_update_category(self, client, auth_headers, sample_category):
        """Test updating a category"""
        response = client.put(
            f'/api/categories/{sample_category.id}',
            headers=auth_headers,
            json={
                'name': 'Updated Name',
                'description': 'Updated description'
            }
        )

        assert response.status_code == 200
        assert response.json['name'] == 'Updated Name'
        assert response.json['description'] == 'Updated description'

    def test_update_nonexistent_category(self, client, auth_headers):
        """Test updating a category that doesn't exist"""
        response = client.put(
            '/api/categories/99999',
            headers=auth_headers,
            json={'name': 'Updated'}
        )

        assert response.status_code == 404

    def test_delete_category(self, client, auth_headers, sample_category):
        """Test deleting a category"""
        category_id = sample_category.id

        response = client.delete(
            f'/api/categories/{category_id}',
            headers=auth_headers
        )

        assert response.status_code == 200
        assert Category.query.get(category_id) is None

    def test_delete_category_with_features(self, client, auth_headers, category_with_features):
        """Test deleting a category with features (cascade)"""
        category, features = category_with_features
        category_id = category.id
        feature_ids = [f.id for f in features]

        response = client.delete(
            f'/api/categories/{category_id}',
            headers=auth_headers
        )

        assert response.status_code == 200
        assert Category.query.get(category_id) is None
        # Features should also be deleted (cascade)
        for feature_id in feature_ids:
            assert Feature.query.get(feature_id) is None

    def test_delete_nonexistent_category(self, client, auth_headers):
        """Test deleting a category that doesn't exist"""
        response = client.delete(
            '/api/categories/99999',
            headers=auth_headers
        )

        assert response.status_code == 404


@pytest.mark.integration
class TestFeatureRoutes:
    """Integration tests for feature routes"""

    def test_create_feature(self, client, auth_headers, sample_category):
        """Test creating a new feature"""
        response = client.post(
            f'/api/categories/{sample_category.id}/features',
            headers=auth_headers,
            json={
                'title': 'New Feature',
                'priority': 'High',
                'description': 'Feature description',
                'kpi': 'Test KPI',
                'customerName': 'Customer',
                'engineeringComment': 'Comment',
                'engineeringSignoff': True,
                'engineeringComplexity': 'M',
                'releaseDate': '2024-06'
            }
        )

        assert response.status_code == 201
        assert response.json['title'] == 'New Feature'
        assert response.json['priority'] == 'High'
        assert 'id' in response.json

    def test_create_feature_invalid_category(self, client, auth_headers):
        """Test creating feature for non-existent category"""
        response = client.post(
            '/api/categories/99999/features',
            headers=auth_headers,
            json={'title': 'Feature'}
        )

        assert response.status_code == 404

    def test_update_feature(self, client, auth_headers, sample_feature):
        """Test updating a feature"""
        response = client.put(
            f'/api/features/{sample_feature.id}',
            headers=auth_headers,
            json={
                'title': 'Updated Feature',
                'priority': 'Low',
                'engineeringSignoff': False
            }
        )

        assert response.status_code == 200
        assert response.json['title'] == 'Updated Feature'
        assert response.json['priority'] == 'Low'
        assert response.json['engineeringSignoff'] is False

    def test_update_nonexistent_feature(self, client, auth_headers):
        """Test updating a feature that doesn't exist"""
        response = client.put(
            '/api/features/F-NONEXISTENT',
            headers=auth_headers,
            json={'title': 'Updated'}
        )

        assert response.status_code == 404

    def test_delete_feature(self, client, auth_headers, sample_feature):
        """Test deleting a feature"""
        feature_id = sample_feature.id

        response = client.delete(
            f'/api/features/{feature_id}',
            headers=auth_headers
        )

        assert response.status_code == 200
        assert Feature.query.get(feature_id) is None

    def test_delete_nonexistent_feature(self, client, auth_headers):
        """Test deleting a feature that doesn't exist"""
        response = client.delete(
            '/api/features/F-NONEXISTENT',
            headers=auth_headers
        )

        assert response.status_code == 404
