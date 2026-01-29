"""Add RBAC support - user roles and engineer assignment

Revision ID: 6ac58a01aabf
Revises: 0b7587a64b37
Create Date: 2026-01-29 05:42:00.910514

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ac58a01aabf'
down_revision = '0b7587a64b37'
branch_labels = None
depends_on = None


def upgrade():
    # Create UserRole enum type
    userrole_enum = sa.Enum('ADMIN', 'PRODUCT_MANAGER', 'ENGINEER', 'VIEWER', name='userrole')
    userrole_enum.create(op.get_bind(), checkfirst=True)

    # Add role column to users table with default VIEWER
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.Enum('ADMIN', 'PRODUCT_MANAGER', 'ENGINEER', 'VIEWER', name='userrole'), nullable=False, server_default='VIEWER'))

    # Add assigned_engineer_id column to features table
    with op.batch_alter_table('features', schema=None) as batch_op:
        batch_op.add_column(sa.Column('assigned_engineer_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_features_assigned_engineer', 'users', ['assigned_engineer_id'], ['id'], ondelete='SET NULL')
        batch_op.create_index(batch_op.f('ix_features_assigned_engineer_id'), ['assigned_engineer_id'], unique=False)

    # Update first user to be admin (if exists)
    connection = op.get_bind()
    result = connection.execute(sa.text("SELECT id FROM users ORDER BY created_at LIMIT 1"))
    first_user = result.fetchone()
    if first_user:
        connection.execute(sa.text(f"UPDATE users SET role = 'ADMIN' WHERE id = {first_user[0]}"))
    # ### end Alembic commands ###


def downgrade():
    # Remove assigned_engineer_id column from features table
    with op.batch_alter_table('features', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_features_assigned_engineer_id'))
        batch_op.drop_constraint('fk_features_assigned_engineer', type_='foreignkey')
        batch_op.drop_column('assigned_engineer_id')

    # Remove role column from users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('role')

    # Drop UserRole enum type
    userrole_enum = sa.Enum('ADMIN', 'PRODUCT_MANAGER', 'ENGINEER', 'VIEWER', name='userrole')
    userrole_enum.drop(op.get_bind(), checkfirst=True)
    # ### end Alembic commands ###
