import pytest
from app import db
from app.models import User


@pytest.mark.integration
class TestAuthRoutes:
    """Integration tests for authentication routes"""

    def test_register_success(self, client):
        """Test successful user registration"""
        response = client.post('/api/auth/register', json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123'
        })

        assert response.status_code == 201
        assert 'access_token' in response.json
        assert response.json['user']['username'] == 'newuser'
        assert response.json['user']['email'] == 'newuser@example.com'

    def test_register_duplicate_username(self, client, sample_user):
        """Test registration with duplicate username"""
        response = client.post('/api/auth/register', json={
            'username': 'sampleuser',
            'email': 'different@example.com',
            'password': 'password123'
        })

        assert response.status_code == 409
        assert 'error' in response.json

    def test_register_duplicate_email(self, client, sample_user):
        """Test registration with duplicate email"""
        response = client.post('/api/auth/register', json={
            'username': 'differentuser',
            'email': 'sample@example.com',
            'password': 'password123'
        })

        assert response.status_code == 409
        assert 'error' in response.json

    def test_register_missing_fields(self, client):
        """Test registration with missing fields"""
        response = client.post('/api/auth/register', json={
            'username': 'newuser'
        })

        assert response.status_code == 400

    def test_login_success(self, client, sample_user):
        """Test successful login"""
        response = client.post('/api/auth/login', json={
            'username': 'sampleuser',
            'password': 'password123'
        })

        assert response.status_code == 200
        assert 'access_token' in response.json
        assert response.json['user']['username'] == 'sampleuser'

    def test_login_invalid_username(self, client):
        """Test login with invalid username"""
        response = client.post('/api/auth/login', json={
            'username': 'nonexistent',
            'password': 'password123'
        })

        assert response.status_code == 401
        assert 'error' in response.json

    def test_login_invalid_password(self, client, sample_user):
        """Test login with invalid password"""
        response = client.post('/api/auth/login', json={
            'username': 'sampleuser',
            'password': 'wrongpassword'
        })

        assert response.status_code == 401
        assert 'error' in response.json

    def test_get_current_user(self, client, auth_headers):
        """Test getting current user information"""
        response = client.get('/api/auth/me', headers=auth_headers)

        assert response.status_code == 200
        assert response.json['username'] == 'testuser'
        assert response.json['email'] == 'test@example.com'

    def test_get_current_user_unauthorized(self, client):
        """Test getting current user without authentication"""
        response = client.get('/api/auth/me')

        assert response.status_code == 401

    def test_register_database_error(self, client, mocker):
        """Test registration with database error"""
        # Mock create_user to raise an exception
        mocker.patch('app.services.AuthService.create_user', side_effect=Exception('Database error'))

        response = client.post('/api/auth/register', json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123'
        })

        assert response.status_code == 500
        assert 'error' in response.json

    def test_login_missing_credentials(self, client):
        """Test login with missing credentials"""
        response = client.post('/api/auth/login', json={
            'username': 'testuser'
        })

        assert response.status_code == 400
        assert 'error' in response.json

    def test_get_current_user_not_found(self, client, mocker):
        """Test getting current user when user not found in database"""
        from flask_jwt_extended import create_access_token

        # Create a token for a non-existent user
        access_token = create_access_token(identity='999999')
        headers = {'Authorization': f'Bearer {access_token}'}

        response = client.get('/api/auth/me', headers=headers)

        assert response.status_code == 404
        assert 'error' in response.json
