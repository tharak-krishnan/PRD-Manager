import pytest
from app.models import User, Category, Feature
from app import db


@pytest.mark.unit
class TestUserModel:
    """Unit tests for User model"""

    def test_user_creation(self, client):
        """Test creating a new user"""
        user = User(username='newuser', email='new@example.com')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user.username == 'newuser'
        assert user.email == 'new@example.com'
        assert user.password_hash is not None
        assert user.password_hash != 'password123'

    def test_password_hashing(self, client, sample_user):
        """Test password hashing and verification"""
        assert sample_user.check_password('password123')
        assert not sample_user.check_password('wrongpassword')

    def test_user_representation(self, client, sample_user):
        """Test user string representation"""
        assert str(sample_user) == '<User sampleuser>'

    def test_unique_username(self, client, sample_user):
        """Test that usernames must be unique"""
        duplicate_user = User(username='sampleuser', email='different@example.com')
        duplicate_user.set_password('password')
        db.session.add(duplicate_user)

        with pytest.raises(Exception):
            db.session.commit()

    def test_unique_email(self, client, sample_user):
        """Test that emails must be unique"""
        duplicate_user = User(username='different', email='sample@example.com')
        duplicate_user.set_password('password')
        db.session.add(duplicate_user)

        with pytest.raises(Exception):
            db.session.commit()


@pytest.mark.unit
class TestCategoryModel:
    """Unit tests for Category model"""

    def test_category_creation(self, client):
        """Test creating a new category"""
        category = Category(
            name='New Category',
            description='New description'
        )
        db.session.add(category)
        db.session.commit()

        assert category.id is not None
        assert category.name == 'New Category'
        assert category.description == 'New description'

    def test_category_representation(self, client, sample_category):
        """Test category string representation"""
        assert str(sample_category) == '<Category Test Category>'

    def test_category_features_relationship(self, client, category_with_features):
        """Test relationship between category and features"""
        category, features = category_with_features
        assert len(category.features.all()) == 10
        assert all(f.category_id == category.id for f in features)


@pytest.mark.unit
class TestFeatureModel:
    """Unit tests for Feature model"""

    def test_feature_creation(self, client, sample_category):
        """Test creating a new feature"""
        feature = Feature(
            id='F-999',
            title='New Feature',
            priority='High',
            description='Feature description',
            kpi='Test KPI',
            customer_name='Customer',
            engineering_comment='Comment',
            engineering_signoff=True,
            engineering_complexity='L',
            release_date='2024-12',
            category_id=sample_category.id
        )
        db.session.add(feature)
        db.session.commit()

        assert feature.id == 'F-999'
        assert feature.title == 'New Feature'
        assert feature.priority == 'High'
        assert feature.category_id == sample_category.id

    def test_feature_representation(self, client, sample_feature):
        """Test feature string representation"""
        assert str(sample_feature) == '<Feature F-001: Test Feature>'

    def test_feature_to_dict(self, client, sample_feature):
        """Test feature serialization to dictionary"""
        feature_dict = sample_feature.to_dict()

        assert feature_dict['id'] == 'F-001'
        assert feature_dict['title'] == 'Test Feature'
        assert feature_dict['priority'] == 'High'
        assert feature_dict['engineering_signoff'] is True
        assert feature_dict['engineering_complexity'] == 'M'

    def test_feature_priorities(self, client, sample_category):
        """Test different priority levels"""
        for priority in ['High', 'Medium', 'Low']:
            feature = Feature(
                id=f'F-{priority}',
                title=f'{priority} Priority Feature',
                priority=priority,
                category_id=sample_category.id
            )
            db.session.add(feature)
        db.session.commit()

        features = Feature.query.all()
        priorities = [f.priority for f in features]
        assert 'High' in priorities
        assert 'Medium' in priorities
        assert 'Low' in priorities

    def test_feature_complexities(self, client, sample_category):
        """Test different complexity levels"""
        for complexity in ['XS', 'S', 'M', 'L', 'XL']:
            feature = Feature(
                id=f'F-{complexity}',
                title=f'{complexity} Complexity Feature',
                engineering_complexity=complexity,
                category_id=sample_category.id
            )
            db.session.add(feature)
        db.session.commit()

        features = Feature.query.all()
        complexities = [f.engineering_complexity for f in features]
        assert all(c in complexities for c in ['XS', 'S', 'M', 'L', 'XL'])
