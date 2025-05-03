from typing import List
from pydantic import BaseModel, EmailStr

class AddressSchema(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str

class OrderBookCreate(BaseModel):
    book_id: int
    quantity: int = 1

class OrderCreate(BaseModel):
    name: str
    email: EmailStr
    address: AddressSchema
    phone: str
    total_price: float
    books: List[OrderBookCreate]

class OrderBook(OrderBookCreate):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class Order(BaseModel):
    id: int
    user_id: int
    name: str
    email: EmailStr
    address: AddressSchema
    phone: str
    total_price: float
    books: List[OrderBook]

    class Config:
        from_attributes = True