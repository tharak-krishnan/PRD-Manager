"""Add signed_off_by_id to features

Revision ID: 0954d7048fa1
Revises: cba1119ddd25
Create Date: 2026-01-30 05:08:04.500265

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0954d7048fa1'
down_revision = 'cba1119ddd25'
branch_labels = None
depends_on = None


def upgrade():
    # Add signed_off_by_id column to features table
    op.add_column('features', sa.Column('signed_off_by_id', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_features_signed_off_by_id'), 'features', ['signed_off_by_id'], unique=False)
    op.create_foreign_key('fk_features_signed_off_by_id', 'features', 'users', ['signed_off_by_id'], ['id'], ondelete='SET NULL')


def downgrade():
    # Remove signed_off_by_id column from features table
    op.drop_constraint('fk_features_signed_off_by_id', 'features', type_='foreignkey')
    op.drop_index(op.f('ix_features_signed_off_by_id'), table_name='features')
    op.drop_column('features', 'signed_off_by_id')
