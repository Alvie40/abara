from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.endpoints.auth import get_current_user
from app.crud.book import get_book, get_books, create_book, update_book, delete_book
from app.db.session import get_db
from app.models.models import User
from app.schemas.book import Book, BookCreate, BookUpdate
from app.services.mcp_service import generate_description

router = APIRouter()

@router.get("/", response_model=List[Book])
async def list_books(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    books = await get_books(db, skip=skip, limit=limit)
    return books

@router.get("/{book_id}", response_model=Book)
async def read_book(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    book = await get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/", response_model=Book)
async def create_new_book(
    *,
    db: AsyncSession = Depends(get_db),
    book_in: BookCreate,
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Generate description using MCP if none provided
    if not book_in.description or book_in.description.strip() == "":
        book_in.description = await generate_description(book_in.title, book_in.category)

    book = await create_book(db, book_in)
    return book

@router.put("/{book_id}", response_model=Book)
async def update_existing_book(
    *,
    db: AsyncSession = Depends(get_db),
    book_id: int,
    book_in: BookUpdate,
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    book = await get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Generate description using MCP if none provided
    if not book_in.description or book_in.description.strip() == "":
        book_in.description = await generate_description(book_in.title, book_in.category)
    
    book = await update_book(db, book_id, book_in)
    return book

@router.delete("/{book_id}")
async def delete_existing_book(
    *,
    db: AsyncSession = Depends(get_db),
    book_id: int,
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    book = await get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    await delete_book(db, book_id)
    return {"ok": True}

@router.get("/home", response_model=dict)
async def get_home_books(
    db: AsyncSession = Depends(get_db)
):
    top_seller_books = await get_books(db, limit=4, trending=True)
    recommended_books = await get_books(db, skip=4, limit=4)
    return {
        "top_seller_books": top_seller_books,
        "recommended_books": recommended_books
    }