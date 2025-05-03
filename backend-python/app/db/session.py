from contextlib import asynccontextmanager
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import AsyncAdaptedQueuePool
from app.core.config import settings

# Create async engine with connection pooling
engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)

# Create async session factory
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

@asynccontextmanager
async def get_db_context():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()