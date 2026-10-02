from pydantic import BaseModel

# 1. This defines what React will SEND to the backend
class UserCreate(BaseModel):
    username: str
    password: str
    id_number: str

# 2. This defines what the backend will RETURN to React
class UserResponse(BaseModel):
    id: int
    username: str
    
    # This tells Pydantic to read data directly from the SQLAlchemy database model
    class Config:
        from_attributes = True

# 3. This defines what React will SEND to the backend for login
class UserLogin(BaseModel):
    username: str
    password: str