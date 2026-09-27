from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# This creates a local file named forum.db in your Backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./boxx_data.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# creat the session to deliver the data, and do some setting ,binding the sessionmaker to that engine.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()