"""seed books

Revision ID: 20240501000001
Revises: 20240501000000
Create Date: 2024-05-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20240501000001'
down_revision: str = '20240501000000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.bulk_insert(
        sa.table(
            'books',
            sa.Column('id', sa.Integer()),
            sa.Column('title', sa.String()),
            sa.Column('author', sa.String()),
            sa.Column('description', sa.Text()),
            sa.Column('price', sa.Float()),
            sa.Column('stock', sa.Integer()),
            sa.Column('image', sa.String()),
        ),
        [
            {
                'id': 1,
                'title': 'The Great Gatsby',
                'author': 'F. Scott Fitzgerald',
                'description': 'A story of decadence and excess.',
                'price': 9.99,
                'stock': 50,
                'image': '/assets/books/great-gatsby.jpg'
            },
            {
                'id': 2,
                'title': '1984',
                'author': 'George Orwell',
                'description': 'A dystopian social science fiction novel.',
                'price': 12.99,
                'stock': 45,
                'image': '/assets/books/1984.jpg'
            },
            {
                'id': 3,
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'description': 'A romantic novel of manners.',
                'price': 8.99,
                'stock': 30,
                'image': '/assets/books/pride-prejudice.jpg'
            },
            {
                'id': 4,
                'title': 'To Kill a Mockingbird',
                'author': 'Harper Lee',
                'description': 'A novel of warmth and humor despite dealing with serious issues.',
                'price': 11.99,
                'stock': 40,
                'image': '/assets/books/mockingbird.jpg'
            },
        ]
    )


def downgrade() -> None:
    op.execute('DELETE FROM books WHERE id IN (1, 2, 3, 4)')