from app import db
from app.models import Category, Project


class CategoryService:
    """Service layer for category operations"""

    @staticmethod
    def create_category(name, project_id, description=""):
        """Create a new category"""
        # Validate project exists
        project = Project.query.get_or_404(project_id)

        # Generate new ID based on existing count
        existing_count = Category.query.count()
        new_id = str(existing_count + 1)

        category = Category(
            id=new_id, name=name, description=description, project_id=project_id
        )
        db.session.add(category)
        db.session.commit()
        return category

    @staticmethod
    def get_all_categories(project_id=None):
        """Get all categories with optional project filter"""
        query = Category.query

        if project_id is not None:
            query = query.filter_by(project_id=project_id)

        return query.all()

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
