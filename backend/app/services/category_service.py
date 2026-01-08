from app import db
from app.models import Category

class CategoryService:
    """Service layer for category operations"""

    @staticmethod
    def create_category(name, description=''):
        """Create a new category"""
        # Generate new ID based on existing count
        existing_count = Category.query.count()
        new_id = str(existing_count + 1)

        category = Category(id=new_id, name=name, description=description)
        db.session.add(category)
        db.session.commit()
        return category

    @staticmethod
    def get_all_categories():
        """Get all categories with features"""
        return Category.query.all()

    @staticmethod
    def get_category_by_id(category_id):
        """Get category by ID"""
        return Category.query.get(category_id)

    @staticmethod
    def update_category(category_id, name=None, description=None):
        """Update a category"""
        category = Category.query.get_or_404(category_id)

        if name is not None:
            category.name = name
        if description is not None:
            category.description = description

        db.session.commit()
        return category

    @staticmethod
    def delete_category(category_id):
        """Delete a category (cascades to features)"""
        category = Category.query.get_or_404(category_id)
        db.session.delete(category)
        db.session.commit()
        return True
