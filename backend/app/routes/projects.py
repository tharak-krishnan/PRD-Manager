from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.exceptions import NotFound
from app.services import ProjectService
from app.utils.permissions import require_role
from app.models import UserRole

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/projects", methods=["GET"])
@jwt_required()
def get_projects():
    """Get all projects"""
    try:
        projects = ProjectService.get_all_projects()
        return jsonify([project.to_dict() for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@projects_bp.route("/projects", methods=["POST"])
@jwt_required()
@require_role(UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
def create_project():
    """Create a new project"""
    data = request.get_json()

    if not data.get("name"):
        return jsonify({"error": "Name is required"}), 400

    try:
        project = ProjectService.create_project(
            name=data["name"], description=data.get("description", "")
        )
        return jsonify(project.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@projects_bp.route("/projects/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    """Get a specific project"""
    try:
        project = ProjectService.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        return jsonify(project.to_dict(include_categories=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@projects_bp.route("/projects/<int:project_id>", methods=["PUT"])
@jwt_required()
@require_role(UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
def update_project(project_id):
    """Update a project"""
    data = request.get_json()

    try:
        project = ProjectService.update_project(
            project_id, name=data.get("name"), description=data.get("description")
        )
        return jsonify(project.to_dict()), 200
    except NotFound:
        return jsonify({"error": "Project not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@projects_bp.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_required()
@require_role(UserRole.ADMIN)
def delete_project(project_id):
    """Delete a project and all its categories and features (cascades)"""
    try:
        ProjectService.delete_project(project_id)
        return jsonify({"message": "Project deleted successfully"}), 200
    except NotFound:
        return jsonify({"error": "Project not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
