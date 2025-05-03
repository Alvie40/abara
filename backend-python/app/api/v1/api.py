from fastapi import APIRouter

from app.api.v1.endpoints import auth, books, orders

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])