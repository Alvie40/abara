from pydantic import BaseModel

class BookBase(BaseModel):
    title: str
    description: str
    category: str
    cover_image: str
    old_price: float
    new_price: float
    trending: bool = False

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int

    class Config:
        from_attributes = True