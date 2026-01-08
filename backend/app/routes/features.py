from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services import FeatureService

features_bp = Blueprint('features', __name__)

@features_bp.route('/categories/<string:category_id>/features', methods=['GET'])
@jwt_required()
def get_features(category_id):
    """Get all features for a category"""
    try:
        features = FeatureService.get_features_by_category(category_id)
        return jsonify([feature.to_dict() for feature in features]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@features_bp.route('/categories/<string:category_id>/features', methods=['POST'])
@jwt_required()
def create_feature(category_id):
    """Create a new feature in a category"""
    data = request.get_json()

    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    try:
        feature = FeatureService.create_feature(
            category_id=category_id,
            title=data['title'],
            priority=data.get('priority', 'Medium'),
            description=data.get('description', ''),
            kpi=data.get('kpi', ''),
            customer_name=data.get('customerName', ''),
            engineering_comment=data.get('engineeringComment', ''),
            engineering_signoff=data.get('engineeringSignoff', False),
            engineering_complexity=data.get('engineeringComplexity', 'M'),
            release_date=data.get('releaseDate', '')
        )
        return jsonify(feature.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@features_bp.route('/features/<string:feature_id>', methods=['PUT'])
@jwt_required()
def update_feature(feature_id):
    """Update a feature"""
    data = request.get_json()

    try:
        feature = FeatureService.update_feature(feature_id, **data)
        return jsonify(feature.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@features_bp.route('/features/<string:feature_id>', methods=['DELETE'])
@jwt_required()
def delete_feature(feature_id):
    """Delete a feature"""
    try:
        FeatureService.delete_feature(feature_id)
        return jsonify({'message': 'Feature deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
