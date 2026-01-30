from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.exceptions import NotFound
from app.services import FeatureService
from app.utils.permissions import require_role, get_current_user, can_edit_feature
from app.models import UserRole

features_bp = Blueprint("features", __name__)


@features_bp.route("/categories/<string:category_id>/features", methods=["GET"])
@jwt_required()
def get_features(category_id):
    """Get all features for a category"""
    try:
        features = FeatureService.get_features_by_category(category_id)
        return jsonify([feature.to_dict() for feature in features]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@features_bp.route("/categories/<string:category_id>/features", methods=["POST"])
@jwt_required()
@require_role(UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
def create_feature(category_id):
    """Create a new feature in a category (Admin/PM only)"""
    data = request.get_json()
    user = get_current_user()

    if not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    # PM cannot set engineering fields on create
    if user.role == UserRole.PRODUCT_MANAGER:
        data.pop("engineeringComment", None)
        data.pop("engineeringSignoff", None)
        data.pop("engineeringComplexity", None)

    try:
        feature = FeatureService.create_feature(
            category_id=category_id,
            title=data["title"],
            priority=data.get("priority", "Medium"),
            description=data.get("description", ""),
            kpi=data.get("kpi", ""),
            customer_name=data.get("customerName", ""),
            engineering_comment=data.get("engineeringComment", ""),
            engineering_signoff=data.get("engineeringSignoff", False),
            engineering_complexity=data.get("engineeringComplexity", "M"),
            release_date=data.get("releaseDate", ""),
            assigned_engineer_id=data.get("assignedEngineerId"),
        )
        return jsonify(feature.to_dict()), 201
    except NotFound:
        return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@features_bp.route("/features/<string:feature_id>", methods=["PUT"])
@jwt_required()
def update_feature(feature_id):
    """Update a feature (role-based field restrictions)"""
    data = request.get_json()
    user = get_current_user()

    try:
        feature = FeatureService.get_feature_by_id(feature_id)
        if not feature:
            return jsonify({"error": "Feature not found"}), 404

        # Check base edit permission
        if not can_edit_feature(user, feature):
            return jsonify({"error": "Insufficient permissions to edit this feature"}), 403

        # Filter fields based on role
        if user.role == UserRole.ENGINEER:
            # Engineer can ONLY edit engineering fields on assigned features
            allowed_fields = {
                "engineeringComment",
                "engineeringSignoff",
                "engineeringComplexity",
            }
            data = {k: v for k, v in data.items() if k in allowed_fields}

            # If engineer is signing off, record who signed it off
            if data.get("engineeringSignoff"):
                data["signedOffById"] = user.id

        elif user.role == UserRole.PRODUCT_MANAGER:
            # PM cannot edit engineering fields
            data.pop("engineeringComment", None)
            data.pop("engineeringSignoff", None)
            data.pop("engineeringComplexity", None)
            data.pop("signedOffById", None)

        # Admin can edit everything (no filtering) but enforce sign-off logic
        elif user.role == UserRole.ADMIN:
            # If admin is signing off on behalf, record the sign-off
            if data.get("engineeringSignoff") and not feature.engineering_signoff:
                if "signedOffById" not in data:
                    data["signedOffById"] = user.id

        feature = FeatureService.update_feature(feature_id, **data)
        return jsonify(feature.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@features_bp.route("/features/<string:feature_id>", methods=["DELETE"])
@jwt_required()
@require_role(UserRole.ADMIN)
def delete_feature(feature_id):
    """Delete a feature (Admin only)"""
    try:
        FeatureService.delete_feature(feature_id)
        return jsonify({"message": "Feature deleted successfully"}), 200
    except NotFound:
        return jsonify({"error": "Feature not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
