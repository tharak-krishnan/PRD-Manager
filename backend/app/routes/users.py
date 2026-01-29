from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services import AuthService
from app.utils.permissions import require_role
from app.models import UserRole

users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["GET"])
@jwt_required()
@require_role(UserRole.ADMIN)
def get_all_users():
    """Get all users (admin only)"""
    try:
        users = AuthService.get_all_users()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@users_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@jwt_required()
@require_role(UserRole.ADMIN)
def update_user_role(user_id):
    """Update user role (admin only)"""
    data = request.get_json()

    if not data.get("role"):
        return jsonify({"error": "Role is required"}), 400

    try:
        user = AuthService.update_user_role(user_id, data["role"])
        return jsonify(user.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid role"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@users_bp.route("/users/engineers", methods=["GET"])
@jwt_required()
@require_role(UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
def get_engineers():
    """Get all engineer users for assignment dropdown (Admin/PM only)"""
    try:
        engineers = AuthService.get_engineers()
        return (
            jsonify([{"id": e.id, "username": e.username, "email": e.email} for e in engineers]),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
