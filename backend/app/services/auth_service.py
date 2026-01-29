from app import db
from app.models import User, UserRole


class AuthService:
    """Service layer for authentication operations"""

    @staticmethod
    def create_user(username, email, password):
        """Create a new user with automatic role assignment"""
        # First user becomes admin, others default to viewer
        user_count = User.query.count()
        role = UserRole.ADMIN if user_count == 0 else UserRole.VIEWER

        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_user_by_username(username):
        """Get user by username"""
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(int(user_id))

    @staticmethod
    def update_user_role(user_id, new_role):
        """Update user role (admin only)"""
        user = User.query.get_or_404(user_id)
        user.role = UserRole(new_role)
        db.session.commit()
        return user

    @staticmethod
    def get_all_users():
        """Get all users (admin only)"""
        return User.query.all()

    @staticmethod
    def get_engineers():
        """Get all engineer users (for assignment dropdown)"""
        return User.query.filter_by(role=UserRole.ENGINEER).all()
