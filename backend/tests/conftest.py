import pytest
from app import create_app, db
from app.models import User, Category, Feature
import os


@pytest.fixture(scope='session')
def app():
    """Create application for testing"""
    # Set testing configuration
    os.environ['FLASK_ENV'] = 'testing'
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    os.environ['JWT_SECRET_KEY'] = 'test-secret-key'

    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret-key',
        'WTF_CSRF_ENABLED': False,
    })

    return app


@pytest.fixture(scope='function')
def client(app):
    """Create test client"""
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


@pytest.fixture(scope='function')
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()


@pytest.fixture
def auth_headers(client):
    """Create authentication headers for testing"""
    # Create a test user
    user = User(username='testuser', email='test@example.com')
    user.set_password('testpass123')
    db.session.add(user)
    db.session.commit()

    # Login to get token
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpass123'
    })

    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def sample_user():
    """Create a sample user"""
    user = User(username='sampleuser', email='sample@example.com')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def sample_category():
    """Create a sample category"""
    category = Category(
        id='cat-1',
        name='Test Category',
        description='Test category description'
    )
    db.session.add(category)
    db.session.commit()
    return category


@pytest.fixture
def sample_feature(sample_category):
    """Create a sample feature"""
    feature = Feature(
        id='F-001',
        title='Test Feature',
        priority='High',
        description='Test feature description',
        kpi='Test KPI',
        customer_name='Test Customer',
        engineering_comment='Test comment',
        engineering_signoff=True,
        engineering_complexity='M',
        release_date='2024-06',
        category_id=sample_category.id
    )
    db.session.add(feature)
    db.session.commit()
    return feature


@pytest.fixture
def multiple_categories():
    """Create multiple categories for testing"""
    categories = []
    for i in range(5):
        category = Category(
            id=f'cat-{i+1}',
            name=f'Category {i+1}',
            description=f'Description for category {i+1}'
        )
        db.session.add(category)
        categories.append(category)
    db.session.commit()
    return categories


@pytest.fixture
def category_with_features(sample_category):
    """Create a category with multiple features"""
    features = []
    for i in range(10):
        feature = Feature(
            id=f'F-{i+1:03d}',
            title=f'Feature {i+1}',
            priority=['High', 'Medium', 'Low'][i % 3],
            description=f'Description for feature {i+1}',
            kpi=f'KPI {i+1}',
            customer_name=f'Customer {i+1}',
            engineering_comment=f'Comment {i+1}',
            engineering_signoff=i % 2 == 0,
            engineering_complexity=['XS', 'S', 'M', 'L', 'XL'][i % 5],
            release_date=f'2024-{(i % 12) + 1:02d}',
            category_id=sample_category.id
        )
        db.session.add(feature)
        features.append(feature)
    db.session.commit()
    return sample_category, features
