from sqlalchemy.orm import Session
import bcrypt
import hashlib
import models
import schemas


# ── Password helpers ──

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt directly (bypasses the broken passlib)."""
    if len(password.encode("utf-8")) > 72:
        password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using bcrypt directly."""
    if len(plain_password.encode("utf-8")) > 72:
        plain_password = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# ── User CRUD ──

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        id_number=user.id_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ── Bubble CRUD ──

def create_bubble(db: Session, bubble: schemas.BubbleCreate, author_id: int):
    db_bubble = models.Bubble(
        title=bubble.title,
        html_content=bubble.html_content,
        author_id=author_id,
    )
    db.add(db_bubble)
    db.commit()
    db.refresh(db_bubble)
    return db_bubble


def get_bubbles(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Bubble)
        .order_by(models.Bubble.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_bubble(db: Session, bubble_id: int):
    return db.query(models.Bubble).filter(models.Bubble.id == bubble_id).first()