from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models
import schemas

# Set up the password hashing configuration using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    # Query the database to see if a user with this username already exists
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # 1. Hash the plain-text password received from the frontend
    hashed_password = pwd_context.hash(user.password)
    
    # 2. Create a new SQLAlchemy User object (leaving out the plain password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    
    # 3. Add the new user to the database session
    db.add(db_user)
    
    # 4. Commit the transaction to save it permanently in your .db file
    db.commit()
    
    # 5. Refresh the object so it includes the newly generated ID from the database
    db.refresh(db_user)
    
    return db_user