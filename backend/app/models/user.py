import enum
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class UserRole(str, enum.Enum):
    """User roles for RBAC"""

    ADMIN = "admin"
    PRODUCT_MANAGER = "product_manager"
    ENGINEER = "engineer"
    VIEWER = "viewer"


class User(db.Model):
    """User model for authentication"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.VIEWER)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships for features
    assigned_features = db.relationship(
        "Feature",
        foreign_keys="[Feature.assigned_engineer_id]",
        backref="assigned_engineer",
        lazy=True
    )
    signed_off_features = db.relationship(
        "Feature",
        foreign_keys="[Feature.signed_off_by_id]",
        backref="signed_off_by",
        lazy=True
    )

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        """String representation of User"""
        return f"<User {self.username}>"
