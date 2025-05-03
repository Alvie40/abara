from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Book
from app.schemas.book import BookCreate, BookUpdate

async def get_book(db: AsyncSession, book_id: int) -> Optional[Book]:
    result = await db.execute(select(Book).filter(Book.id == book_id))
    return result.scalar_one_or_none()

async def get_books(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    trending: bool | None = None
) -> List[Book]:
    query = select(Book)
    if trending is not None:
        query = query.filter(Book.trending == trending)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())

async def create_book(db: AsyncSession, book_in: BookCreate) -> Book:
    db_book = Book(**book_in.model_dump())
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def update_book(
    db: AsyncSession,
    book_id: int,
    book_in: BookUpdate
) -> Optional[Book]:
    book = await get_book(db, book_id)
    if not book:
        return None
    
    for field, value in book_in.model_dump(exclude_unset=True).items():
        setattr(book, field, value)
    
    await db.commit()
    await db.refresh(book)
    return book

async def delete_book(db: AsyncSession, book_id: int) -> bool:
    book = await get_book(db, book_id)
    if not book:
        return False
    await db.delete(book)
    await db.commit()
    return True