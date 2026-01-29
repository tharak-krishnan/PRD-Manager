from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User, UserRole


def require_role(*allowed_roles):
    """Decorator to require specific role(s) for endpoint access"""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(int(user_id))

            if not user:
                return jsonify({"error": "User not found"}), 404

            if user.role not in allowed_roles:
                return (
                    jsonify(
                        {
                            "error": "Insufficient permissions",
                            "required": [r.value for r in allowed_roles],
                            "current": user.role.value,
                        }
                    ),
                    403,
                )

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def get_current_user():
    """Helper to get current user from JWT"""
    user_id = get_jwt_identity()
    return User.query.get(int(user_id))


def can_edit_feature(user, feature):
    """Check if user can edit a specific feature (any field)"""
    if user.role == UserRole.ADMIN:
        return True
    elif user.role == UserRole.PRODUCT_MANAGER:
        return True
    elif user.role == UserRole.ENGINEER:
        return feature.assigned_engineer_id == user.id
    return False


def can_edit_engineering_fields(user, feature):
    """Check if user can edit engineering-specific fields"""
    if user.role == UserRole.ADMIN:
        return True
    elif user.role == UserRole.ENGINEER:
        return feature.assigned_engineer_id == user.id
    return False


def can_assign_engineer(user):
    """Check if user can assign engineers to features"""
    return user.role in [UserRole.ADMIN, UserRole.PRODUCT_MANAGER]
