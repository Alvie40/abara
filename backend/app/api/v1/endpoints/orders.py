from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.endpoints.auth import get_current_user
from app.crud.order import create_order, get_user_orders
from app.db.session import get_db
from app.models.models import User
from app.schemas.order import Order, OrderCreate

router = APIRouter()

@router.get("/user-orders", response_model=List[Order])
async def list_user_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = await get_user_orders(db, current_user.id)
    return orders

@router.post("/", response_model=Order)
async def create_new_order(
    *,
    db: AsyncSession = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    order = await create_order(db, order_in, current_user.id)
    return order