from app import db
from app.models import Project


class ProjectService:
    """Service layer for project operations"""

    @staticmethod
    def create_project(name, description=""):
        """Create a new project"""
        project = Project(name=name, description=description)
        db.session.add(project)
        db.session.commit()
        return project

    @staticmethod
    def get_all_projects():
        """Get all projects ordered by name"""
        return Project.query.order_by(Project.name).all()

    @staticmethod
    def get_project_by_id(project_id):
        """Get project by ID"""
        return Project.query.get(project_id)

    @staticmethod
    def update_project(project_id, name=None, description=None):
        """Update a project"""
        project = Project.query.get_or_404(project_id)

        if name is not None:
            project.name = name
        if description is not None:
            project.description = description

        db.session.commit()
        return project

    @staticmethod
    def delete_project(project_id):
        """Delete a project (cascades to categories and features)"""
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return True
