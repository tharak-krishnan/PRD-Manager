from datetime import datetime
from app import db

class Category(db.Model):
    """Category model for organizing features"""
    __tablename__ = 'categories'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to features
    features = db.relationship('Feature', backref='category', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_features=True):
        """Convert category to dictionary"""
        result = {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

        if include_features:
            result['features'] = [f.to_dict() for f in self.features.all()]

        return result
