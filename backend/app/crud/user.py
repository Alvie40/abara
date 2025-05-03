from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import User
from app.schemas.auth import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user_by_email(db: AsyncSession, *, email: str) -> Optional[User]:
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, *, obj_in: UserCreate) -> User:
    hashed_password = pwd_context.hash(obj_in.password)
    db_obj = User(
        email=obj_in.email,
        password=hashed_password,
        name=obj_in.name,
        is_admin=obj_in.is_admin
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj