from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Order, OrderBook
from app.schemas.order import OrderCreate

async def get_user_orders(db: AsyncSession, user_id: int) -> List[Order]:
    result = await db.execute(
        select(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
    )
    return list(result.scalars().all())

async def create_order(
    db: AsyncSession,
    order_in: OrderCreate,
    user_id: int
) -> Order:
    # Create order
    db_order = Order(
        user_id=user_id,
        name=order_in.name,
        email=order_in.email,
        address=order_in.address.model_dump(),
        phone=order_in.phone,
        total_price=order_in.total_price
    )
    db.add(db_order)
    await db.flush()  # Get the order ID

    # Create order books
    for book in order_in.books:
        order_book = OrderBook(
            order_id=db_order.id,
            book_id=book.book_id,
            quantity=book.quantity
        )
        db.add(order_book)
    
    await db.commit()
    await db.refresh(db_order)
    return db_order