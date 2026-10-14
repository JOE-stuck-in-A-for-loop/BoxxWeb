from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    id_number = Column(String)

    bubbles = relationship("Bubble", back_populates="author")


class Bubble(Base):
    __tablename__ = "bubbles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    html_content = Column(Text)
    tags = Column(Text, default="[]")  # JSON array: ["程序","金融"]
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    author = relationship("User", back_populates="bubbles")