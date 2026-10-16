from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import json
import os
import uuid
from pathlib import Path
from dotenv import load_dotenv

import crud
import models
import schemas
from database import SessionLocal, engine
from crud import get_password_hash, verify_password, get_user_by_username

# Load .env file
load_dotenv()

# ── Public URL (for building absolute URLs to uploaded files) ──
PUBLIC_URL = os.getenv("PUBLIC_URL", "").rstrip("/")
# In dev, if no PUBLIC_URL is set, we'll return relative URLs (Vite proxy handles them)
# In production, set PUBLIC_URL=https://yourdomain.com

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("Fatal error: SECRET_KEY environment variable not set; service refusing to start!")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Automatically generate the boxx_data.db file and all tables
models.Base.metadata.create_all(bind=engine)

# ── Static files & uploads ──
BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
security = HTTPBearer()

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://47.102.43.26:8080", "http://47.102.43.26:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency: Opens a session for each request and closes it afterward
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return db_user


# ── Auth endpoints ──

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username")
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI! The backend is running."}


# ── File upload endpoint ──

ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm', '.ogg', '.mov'}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' not allowed")

    # Date-based folder: uploads/2026/10/
    now = datetime.now(timezone.utc)
    year_str = str(now.year)
    month_str = f"{now.month:02d}"
    date_dir = UPLOAD_DIR / year_str / month_str
    date_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename: uuid4_originalname.ext
    stem = Path(file.filename).stem
    unique_name = f"{uuid.uuid4().hex}_{stem}{ext}"
    file_path = date_dir / unique_name

    # Save the file
    content = await file.read()
    file_path.write_bytes(content)

    # Return the URL path that GrapesJS can use
    url_path = f"/uploads/{year_str}/{month_str}/{unique_name}"
    # If PUBLIC_URL is configured, return an absolute URL
    if PUBLIC_URL:
        file_url = f"{PUBLIC_URL}{url_path}"
    else:
        file_url = url_path  # relative — works with Vite proxy in dev
    return {"url": file_url, "filename": f"{year_str}/{month_str}/{unique_name}"}


# ── Bubble endpoints ──

@app.post("/bubbles", response_model=schemas.BubbleResponse)
def create_bubble(
    bubble: schemas.BubbleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_bubble(db=db, bubble=bubble, author_id=current_user.id)


@app.get("/bubbles", response_model=list[schemas.BubbleResponse])
def list_bubbles(skip: int = 0, limit: int = 100, tag: str = None, db: Session = Depends(get_db)):
    bubbles = crud.get_bubbles(db, skip=skip, limit=limit, tag=tag)
    # Attach author_name for convenience
    result = []
    for b in bubbles:
        resp = schemas.BubbleResponse(
            id=b.id,
            title=b.title,
            html_content=b.html_content,
            tags=json.loads(b.tags) if b.tags else [],
            author_id=b.author_id,
            author_name=b.author.username if b.author else None,
            created_at=b.created_at,
        )
        result.append(resp)
    return result


@app.get("/bubbles/{bubble_id}", response_model=schemas.BubbleResponse)
def get_bubble(bubble_id: int, db: Session = Depends(get_db)):
    bubble = crud.get_bubble(db, bubble_id=bubble_id)
    if not bubble:
        raise HTTPException(status_code=404, detail="Bubble not found")
    return schemas.BubbleResponse(
        id=bubble.id,
        title=bubble.title,
        html_content=bubble.html_content,
        tags=json.loads(bubble.tags) if bubble.tags else [],
        author_id=bubble.author_id,
        author_name=bubble.author.username if bubble.author else None,
        created_at=bubble.created_at,
    )