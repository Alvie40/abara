"""seed books

Revision ID: 20240501000001
Revises: 20240501000000
Create Date: 2024-05-01 00:00:01.000000

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
    # Sample books data
    books = [
        {
            "title": "The Art of Programming",
            "description": "A comprehensive guide to modern programming practices and patterns.",
            "category": "Programming",
            "cover_image": "/assets/books/programming.jpg",
            "old_price": 59.99,
            "new_price": 49.99,
            "trending": True
        },
        {
            "title": "Data Science Fundamentals",
            "description": "Learn the basics of data science and machine learning.",
            "category": "Data Science",
            "cover_image": "/assets/books/data-science.jpg",
            "old_price": 69.99,
            "new_price": 54.99,
            "trending": True
        },
        {
            "title": "Web Development with React",
            "description": "Master React.js and modern web development techniques.",
            "category": "Web Development",
            "cover_image": "/assets/books/react.jpg",
            "old_price": 49.99,
            "new_price": 39.99,
            "trending": True
        },
        {
            "title": "Python for Beginners",
            "description": "Start your programming journey with Python.",
            "category": "Programming",
            "cover_image": "/assets/books/python.jpg",
            "old_price": 39.99,
            "new_price": 29.99,
            "trending": True
        },
        {
            "title": "Cloud Architecture Patterns",
            "description": "Design scalable and resilient cloud applications.",
            "category": "Cloud Computing",
            "cover_image": "/assets/books/cloud.jpg",
            "old_price": 79.99,
            "new_price": 64.99,
            "trending": False
        },
        {
            "title": "DevOps Handbook",
            "description": "Implementation guide for DevOps practices.",
            "category": "DevOps",
            "cover_image": "/assets/books/devops.jpg",
            "old_price": 65.99,
            "new_price": 59.99,
            "trending": False
        }
    ]

    conn = op.get_bind()
    for book in books:
        conn.execute(
            sa.text(
                """
                INSERT INTO book (title, description, category, cover_image, old_price, new_price, trending)
                VALUES (:title, :description, :category, :cover_image, :old_price, :new_price, :trending)
                """
            ),
            book
        )

def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(sa.text('DELETE FROM book'))