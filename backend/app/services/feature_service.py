from app import db
from app.models import Feature, Priority, TShirtSize, Category

class FeatureService:
    """Service layer for feature operations"""

    @staticmethod
    def create_feature(category_id, title, priority='Medium', description='', kpi='',
                      customer_name='', engineering_comment='', engineering_signoff=False,
                      engineering_complexity='M', release_date=''):
        """Create a new feature in a category"""
        # Get category to generate feature ID
        category = Category.query.get_or_404(category_id)
        feature_count = category.features.count()
        new_feature_id = f"{category_id}.{feature_count + 1}"

        feature = Feature(
            id=new_feature_id,
            category_id=category_id,
            title=title,
            priority=Priority(priority),
            description=description,
            kpi=kpi,
            customer_name=customer_name,
            engineering_comment=engineering_comment,
            engineering_signoff=engineering_signoff,
            engineering_complexity=TShirtSize(engineering_complexity),
            release_date=release_date
        )

        db.session.add(feature)
        db.session.commit()
        return feature

    @staticmethod
    def get_features_by_category(category_id):
        """Get all features for a category"""
        return Feature.query.filter_by(category_id=category_id).all()

    @staticmethod
    def get_feature_by_id(feature_id):
        """Get feature by ID"""
        return Feature.query.get(feature_id)

    @staticmethod
    def update_feature(feature_id, **kwargs):
        """Update a feature"""
        feature = Feature.query.get_or_404(feature_id)

        # Update fields if provided
        if 'title' in kwargs:
            feature.title = kwargs['title']
        if 'priority' in kwargs:
            feature.priority = Priority(kwargs['priority'])
        if 'description' in kwargs:
            feature.description = kwargs['description']
        if 'kpi' in kwargs:
            feature.kpi = kwargs['kpi']
        if 'customerName' in kwargs:
            feature.customer_name = kwargs['customerName']
        if 'engineeringComment' in kwargs:
            feature.engineering_comment = kwargs['engineeringComment']
        if 'engineeringSignoff' in kwargs:
            feature.engineering_signoff = kwargs['engineeringSignoff']
        if 'engineeringComplexity' in kwargs:
            feature.engineering_complexity = TShirtSize(kwargs['engineeringComplexity'])
        if 'releaseDate' in kwargs:
            feature.release_date = kwargs['releaseDate']

        db.session.commit()
        return feature

    @staticmethod
    def delete_feature(feature_id):
        """Delete a feature"""
        feature = Feature.query.get_or_404(feature_id)
        db.session.delete(feature)
        db.session.commit()
        return True
