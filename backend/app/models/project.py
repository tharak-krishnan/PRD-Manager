from datetime import datetime
from app import db


class Project(db.Model):
    """Project model for organizing categories"""

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationship to categories
    categories = db.relationship(
        "Category", backref="project", lazy="select", cascade="all, delete-orphan"
    )

    def to_dict(self, include_categories=False):
        """Convert project to dictionary"""
        result = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_categories:
            result["categories"] = [
                c.to_dict(include_features=False) for c in self.categories
            ]

        return result

    def __repr__(self):
        """String representation of Project"""
        return f"<Project {self.name}>"
