from datetime import datetime
import enum
from app import db

class Priority(str, enum.Enum):
    """Priority levels for features"""
    HIGH = 'High'
    MEDIUM = 'Medium'
    LOW = 'Low'

class TShirtSize(str, enum.Enum):
    """T-shirt sizing for engineering complexity"""
    XS = 'XS'
    S = 'S'
    M = 'M'
    L = 'L'
    XL = 'XL'

class Feature(db.Model):
    """Feature model with full PRD metadata"""
    __tablename__ = 'features'

    id = db.Column(db.String(50), primary_key=True)
    category_id = db.Column(db.String(50), db.ForeignKey('categories.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(500), nullable=False)
    priority = db.Column(db.Enum(Priority), nullable=False, default=Priority.MEDIUM)
    description = db.Column(db.Text, nullable=True)
    kpi = db.Column(db.Text, nullable=True)
    customer_name = db.Column(db.String(200), nullable=True)
    engineering_comment = db.Column(db.Text, nullable=True)
    engineering_signoff = db.Column(db.Boolean, default=False, nullable=False)
    engineering_complexity = db.Column(db.Enum(TShirtSize), nullable=False, default=TShirtSize.M)
    release_date = db.Column(db.String(7), nullable=True)  # YYYY-MM format
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert feature to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'priority': self.priority.value,
            'description': self.description,
            'kpi': self.kpi,
            'customerName': self.customer_name,
            'engineeringComment': self.engineering_comment,
            'engineeringSignoff': self.engineering_signoff,
            'engineeringComplexity': self.engineering_complexity.value,
            'releaseDate': self.release_date
        }
