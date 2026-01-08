from app import db
from app.models import User

class AuthService:
    """Service layer for authentication operations"""

    @staticmethod
    def create_user(username, email, password):
        """Create a new user"""
        user = User(username=username, email=email)
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
