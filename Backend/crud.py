from sqlalchemy.orm import Session
import bcrypt
import models
import schemas


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt directly (bypasses the broken passlib)."""
    # bcrypt 5.x rejects passwords >72 bytes, so we pre-hash via sha256 if needed
    if len(password.encode("utf-8")) > 72:
        import hashlib
        password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using bcrypt directly."""
    # Apply the same truncation if the password was >72 bytes
    if len(plain_password.encode("utf-8")) > 72:
        import hashlib
        plain_password = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_user_by_username(db: Session, username: str):
    # Query the database to see if a user with this username already exists
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    # 1. Hash the plain-text password received from the frontend
    hashed_password = get_password_hash(user.password)

    # 2. Create a new SQLAlchemy User object (leaving out the plain password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        id_number=user.id_number
    )

    # 3. Add the new user to the database session
    db.add(db_user)

    # 4. Commit the transaction to save it permanently in your .db file
    db.commit()

    # 5. Refresh the object so it includes the newly generated ID from the database
    db.refresh(db_user)

    return db_user