import pytest
from app import db
from app.models import Project, Category, Feature


@pytest.mark.integration
class TestMultiProjectWorkflow:
    """End-to-end integration tests for multi-project functionality"""

    def test_complete_project_workflow(self, client, admin_headers):
        """Test creating project, adding categories and features, then deleting"""
        # Step 1: Create a project
        response = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'Workflow Project', 'description': 'Test workflow'}
        )
        assert response.status_code == 201
        project_id = response.json['id']

        # Step 2: Create categories for the project
        cat1_response = client.post(
            '/api/categories',
            headers=admin_headers,
            json={
                'name': 'Category 1',
                'description': 'First category',
                'project_id': project_id
            }
        )
        assert cat1_response.status_code == 201
        cat1_id = cat1_response.json['id']

        cat2_response = client.post(
            '/api/categories',
            headers=admin_headers,
            json={
                'name': 'Category 2',
                'description': 'Second category',
                'project_id': project_id
            }
        )
        assert cat2_response.status_code == 201
        cat2_id = cat2_response.json['id']

        # Step 3: Add features to categories
        feature_response = client.post(
            f'/api/categories/{cat1_id}/features',
            headers=admin_headers,
            json={
                'title': 'Test Feature',
                'priority': 'High',
                'description': 'Feature description',
                'kpi': 'Test KPI',
                'customerName': 'Customer',
                'engineeringComment': 'Comment',
                'engineeringSignoff': True,
                'engineeringComplexity': 'M',
                'releaseDate': '2024-06'
            }
        )
        assert feature_response.status_code == 201
        feature_id = feature_response.json['id']

        # Step 4: Verify categories are filtered by project
        categories_response = client.get(
            f'/api/categories?project_id={project_id}',
            headers=admin_headers
        )
        assert categories_response.status_code == 200
        assert len(categories_response.json) == 2

        # Step 5: Delete project (should cascade to categories and features)
        delete_response = client.delete(
            f'/api/projects/{project_id}',
            headers=admin_headers
        )
        assert delete_response.status_code == 200

        # Step 6: Verify everything was deleted
        assert Project.query.get(project_id) is None
        assert Category.query.get(cat1_id) is None
        assert Category.query.get(cat2_id) is None
        assert Feature.query.get(feature_id) is None

    def test_project_isolation(self, client, admin_headers):
        """Test that categories from different projects are isolated"""
        # Create two projects
        proj1 = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'Project 1', 'description': 'First project'}
        )
        proj1_id = proj1.json['id']

        proj2 = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'Project 2', 'description': 'Second project'}
        )
        proj2_id = proj2.json['id']

        # Add categories to each project
        cat1 = client.post(
            '/api/categories',
            headers=admin_headers,
            json={'name': 'P1 Category', 'description': 'Cat 1', 'project_id': proj1_id}
        )
        assert cat1.status_code == 201

        cat2 = client.post(
            '/api/categories',
            headers=admin_headers,
            json={'name': 'P2 Category', 'description': 'Cat 2', 'project_id': proj2_id}
        )
        assert cat2.status_code == 201

        # Verify project 1 only sees its category
        proj1_cats = client.get(
            f'/api/categories?project_id={proj1_id}',
            headers=admin_headers
        )
        assert len(proj1_cats.json) == 1
        assert proj1_cats.json[0]['name'] == 'P1 Category'

        # Verify project 2 only sees its category
        proj2_cats = client.get(
            f'/api/categories?project_id={proj2_id}',
            headers=admin_headers
        )
        assert len(proj2_cats.json) == 1
        assert proj2_cats.json[0]['name'] == 'P2 Category'

    def test_default_project_data_migration(self, client, admin_headers):
        """Test that existing data gets assigned to default project"""
        # This tests the migration scenario where project_id=1 is the default

        # Create default project manually (simulates migration)
        default_project = Project(id=1, name='Default Project', description='Initial project')
        db.session.add(default_project)
        db.session.commit()

        # Create category assigned to default project
        cat = Category(
            id='legacy-cat',
            name='Legacy Category',
            description='Migrated category',
            project_id=1
        )
        db.session.add(cat)
        db.session.commit()

        # Verify category is assigned to default project
        response = client.get('/api/categories?project_id=1', headers=admin_headers)
        assert response.status_code == 200
        assert len(response.json) == 1
        assert response.json[0]['name'] == 'Legacy Category'
        assert response.json[0]['project_id'] == 1

    def test_multiple_users_multiple_projects(
        self, client, admin_headers, pm_headers, engineer_headers, viewer_headers
    ):
        """Test multiple users interacting with multiple projects"""
        # Admin creates project
        proj_response = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'Shared Project', 'description': 'All users can see'}
        )
        assert proj_response.status_code == 201
        project_id = proj_response.json['id']

        # PM creates category
        cat_response = client.post(
            '/api/categories',
            headers=pm_headers,
            json={
                'name': 'PM Category',
                'description': 'Created by PM',
                'project_id': project_id
            }
        )
        assert cat_response.status_code == 201
        cat_id = cat_response.json['id']

        # Engineer views project (read-only for project)
        get_proj = client.get(f'/api/projects/{project_id}', headers=engineer_headers)
        assert get_proj.status_code == 200
        assert get_proj.json['name'] == 'Shared Project'

        # Engineer cannot create category
        eng_cat = client.post(
            '/api/categories',
            headers=engineer_headers,
            json={
                'name': 'Eng Category',
                'description': 'Should fail',
                'project_id': project_id
            }
        )
        assert eng_cat.status_code == 403

        # Viewer can see projects but cannot create
        view_proj = client.get('/api/projects', headers=viewer_headers)
        assert view_proj.status_code == 200
        assert len(view_proj.json) >= 1

        view_create = client.post(
            '/api/projects',
            headers=viewer_headers,
            json={'name': 'Should Fail', 'description': 'Viewer cannot create'}
        )
        assert view_create.status_code == 403

    def test_cascade_delete_complex_structure(self, client, admin_headers):
        """Test cascade delete with multiple levels: Project -> Categories -> Features"""
        # Create project
        proj = client.post(
            '/api/projects',
            headers=admin_headers,
            json={'name': 'Complex Project', 'description': 'Test cascade'}
        )
        project_id = proj.json['id']

        # Create 3 categories
        category_ids = []
        for i in range(3):
            cat = client.post(
                '/api/categories',
                headers=admin_headers,
                json={
                    'name': f'Category {i+1}',
                    'description': f'Cat {i+1}',
                    'project_id': project_id
                }
            )
            category_ids.append(cat.json['id'])

        # Add 5 features to each category (15 total)
        feature_ids = []
        for cat_id in category_ids:
            for j in range(5):
                feat = client.post(
                    f'/api/categories/{cat_id}/features',
                    headers=admin_headers,
                    json={
                        'title': f'Feature {j+1}',
                        'priority': 'Medium',
                        'description': 'Test',
                        'kpi': 'KPI',
                        'customerName': 'Customer',
                        'engineeringComment': 'Comment',
                        'engineeringSignoff': False,
                        'engineeringComplexity': 'M',
                        'releaseDate': '2024-06'
                    }
                )
                feature_ids.append(feat.json['id'])

        # Verify all created
        assert len(category_ids) == 3
        assert len(feature_ids) == 15

        # Delete project
        delete_response = client.delete(
            f'/api/projects/{project_id}',
            headers=admin_headers
        )
        assert delete_response.status_code == 200

        # Verify everything cascaded
        assert Project.query.get(project_id) is None
        for cat_id in category_ids:
            assert Category.query.get(cat_id) is None
        for feat_id in feature_ids:
            assert Feature.query.get(feat_id) is None
