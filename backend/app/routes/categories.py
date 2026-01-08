from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services import CategoryService

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all categories with their features"""
    try:
        categories = CategoryService.get_all_categories()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Create a new category"""
    data = request.get_json()

    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400

    try:
        category = CategoryService.create_category(
            name=data['name'],
            description=data.get('description', '')
        )
        return jsonify(category.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories/<string:category_id>', methods=['GET'])
@jwt_required()
def get_category(category_id):
    """Get a specific category"""
    try:
        category = CategoryService.get_category_by_id(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        return jsonify(category.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories/<string:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """Update a category"""
    data = request.get_json()

    try:
        category = CategoryService.update_category(
            category_id,
            name=data.get('name'),
            description=data.get('description')
        )
        return jsonify(category.to_dict(include_features=False)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/categories/<string:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    """Delete a category and all its features"""
    try:
        CategoryService.delete_category(category_id)
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
