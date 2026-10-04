from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 1. User schemas — unchanged

class UserCreate(BaseModel):
    username: str
    password: str
    id_number: str

class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str


# 2. Bubble schemas

class BubbleCreate(BaseModel):
    title: str
    html_content: str

class BubbleResponse(BaseModel):
    id: int
    title: str
    html_content: str
    author_id: int
    author_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True