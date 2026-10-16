# 🧊 BoxxWeb — Project Documentation

> **Breaking Information Cocoons, One Bubble at a Time.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Components Breakdown](#components-breakdown)
   - [Backend (Python / FastAPI)](#backend-python--fastapi)
   - [Admin Frontend (React)](#admin-frontend-react)
   - [Public Frontend (React)](#public-frontend-react)
5. [Data Model](#data-model)
6. [Routing](#routing)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [i18n — Internationalization](#i18n--internationalization)
10. [Visual Design](#visual-design)
11. [How to Run](#how-to-run)
12. [Development Status](#development-status)

---

## Project Overview

**BoxxWeb** is a bilingual (English / Chinese) social-content platform built to encourage thoughtful content creation and break people out of **information cocoons** — the echo chambers formed by algorithmic content curation.

The platform's core content unit is the **"Bubble"** — a rich HTML post created using a visual drag-and-drop editor (GrapesJS). Users can browse, tag, and read bubbles. Authenticated users can create new bubbles and manage content. The home page features a philosophical text-animation sequence that cycles through the very problems Boxx aims to solve:

> *Information Cocoon → Misinformation → Malicious Personal Attacks → Discrimination and Bullying → Mindless Chatter → False Hype → Malicious Manipulation*

Each phrase has a unique destruction animation, visually "breaking" the problem before the next one appears.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Visual Editor** | GrapesJS 0.23 + grapesjs-blocks-basic |
| **3D Background** | Three.js 0.186 via custom GLSL shaders |
| **Backend** | Python 3.14+, FastAPI |
| **Database** | SQLite (via SQLAlchemy ORM) |
| **Auth** | JWT (python-jose) + bcrypt password hashing |
| **File Uploads** | FastAPI StaticFiles |
| **Internationalization** | Custom React Context-based i18n |
| **Styling** | CSS Modules, Custom CSS |
| **Package Manager** | npm (Frontends), pip (Backend) |

---

## Project Structure

```
BoxxWeb/
├── README.md                          # (this file)
├── Backend/                           # Python FastAPI backend
│   ├── main.py                        # FastAPI app entry point, routes, JWT auth
│   ├── database.py                    # SQLAlchemy engine & session config
│   ├── models.py                      # ORM models (User, Bubble)
│   ├── schemas.py                     # Pydantic request/response schemas
│   ├── crud.py                        # Database CRUD operations & password helpers
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Secret key (non-committed)
│   ├── boxx_data.db                   # SQLite database file
│   └── uploads/                       # Uploaded media files (organized by date)
│
├── Admin_Frontend/                    # Admin/dashboard React app (authenticated users)
│   ├── index.html
│   ├── vite.config.js                 # Vite config with API proxy
│   ├── package.json
│   └── src/
│       ├── main.jsx                   # Entry point (BrowserRouter, AuthProvider, I18nProvider)
│       ├── App.jsx                    # Root component & route definitions
│       ├── AuthContext.jsx            # Authentication state management
│       ├── api.js                     # API client (login, getBubbles, createBubble)
│       ├── i18n.jsx                   # Internationalization provider
│       ├── index.css                  # Global styles (Three.js canvas setup)
│       ├── langSwitcher.jsx           # Language switcher dropdown (top-right)
│       ├── langSwitcher.css
│       ├── locals/
│       │   ├── en.json                # English translations
│       │   └── zh.json                # Chinese translations
│       ├── home_background/
│       │   ├── background.jsx         # Three-layer layout (3D → text → content)
│       │   ├── threeBackground.jsx    # Three.js gradient canvas (GLSL shader)
│       │   └── textAnimations.js      # Phrase cycle with destruction effects
│       ├── home_GreetingText/
│       │   └── Greeting.jsx           # "Welcome to Boxx" header
│       ├── home_options/
│       │   ├── home_options.jsx       # Navigation buttons (Feed, Contact, Justify, Explore)
│       │   └── home_options.css
│       ├── home_userProfile/
│       │   ├── guest_information.jsx   # Login form (when logged out) or UserProfile
│       │   ├── guest_information.module.css
│       │   ├── userProfile.jsx         # Avatar, welcome message, logout button
│       │   └── userProfile.module.css
│       └── pages/
│           ├── pages.css               # Shared page styles (back button, cards)
│           ├── ChatPage.jsx            # Contact/chat placeholder page
│           ├── JustifyPage.jsx         # Justify placeholder page
│           ├── ExplorePage.jsx         # Explore placeholder page
│           ├── feed/
│           │   ├── FeedPage.jsx        # Bubble feed with tag filter
│           │   └── feedPage.css
│           └── editor/
│               ├── PostEditor.jsx      # GrapesJS visual editor for creating bubbles
│               └── postEditor.css
│
├── Public_Frontend/                   # Public-facing React app (all visitors)
│   ├── index.html
│   ├── vite.config.js                 # Same Vite config with API proxy
│   ├── package.json
│   └── src/
│       ├── main.jsx                   # Entry point (no AuthProvider)
│       ├── App.jsx                    # Routes (no admin/editor, has /bubble/:id)
│       ├── api.js                     # API client (read-only: no createBubble)
│       ├── i18n.jsx                   # Same i18n provider
│       ├── index.css
│       ├── langSwitcher.jsx           # Same language switcher
│       ├── langSwitcher.css
│       ├── locals/
│       │   ├── en.json
│       │   └── zh.json
│       ├── home_background/           # Same Three.js background & text animations
│       │   ├── background.jsx
│       │   ├── threeBackground.jsx
│       │   └── textAnimations.js
│       ├── home_GreetingText/
│       │   └── Greeting.jsx
│       ├── home_options/
│       │   ├── home_options.jsx
│       │   └── home_options.css
│       ├── home_userProfile/
│       │   ├── guest_information.jsx   # Read-only: no login form, just info display
│       │   ├── guest_information.module.css
│       └── pages/
│           ├── pages.css
│           ├── ChatPage.jsx
│           ├── JustifyPage.jsx
│           ├── ExplorePage.jsx
│           ├── FeedPage.jsx            # Feed with tag sidebar & bubble list
│           ├── feedPage.css
│           └── BubbleView.jsx          # Individual bubble detail view
│
├── learning_log/
│   └── react_basics.txt               # Personal learning notes
│
└── .claude/                           # Claude Code configuration
```

## Components Breakdown

### Backend (Python / FastAPI)

The backend is a RESTful API server running on `http://47.102.43.26:8000`.

#### `database.py` — Database Engine
- Uses SQLAlchemy with SQLite (`boxx_data.db`)
- Creates a `SessionLocal` factory for database sessions
- `check_same_thread=False` allows SQLite access across threads

#### `models.py` — ORM Models
| Model | Table | Fields |
|-------|-------|--------|
| **User** | `users` | `id`, `username` (unique), `hashed_password`, `id_number`, relationship to `bubbles` |
| **Bubble** | `bubbles` | `id`, `title`, `html_content` (full HTML from GrapesJS), `tags` (JSON array string), `author_id` (FK → users), `created_at` |

#### `schemas.py` — Pydantic Schemas
- **UserCreate**: `username`, `password`, `id_number`
- **UserLogin**: `username`, `password`
- **UserResponse**: `id`, `username`
- **BubbleCreate**: `title`, `html_content`, `tags` (string array)
- **BubbleResponse**: `id`, `title`, `html_content`, `tags`, `author_id`, `author_name`, `created_at`

#### `crud.py` — CRUD Operations
- Password hashing via **bcrypt** (with SHA-256 pre-hashing for passwords over 72 bytes)
- User operations: `get_user_by_username`, `create_user`
- Bubble operations: `create_bubble`, `get_bubbles` (with optional tag filter), `get_bubble`
- Tag filtering uses SQL `LIKE` via `contains()` on the JSON tags string

#### `main.py` — FastAPI Application
- **CORS**: Configured for `47.102.43.26:8080` and `47.102.43.26:8081` (public and admin frontends)
- **JWT Auth**: HS256 tokens with 24-hour expiry, `SECRET_KEY` from `.env`
- **Static Files**: `/uploads` mounted for media access
- **File Upload**: Allowed types include images (PNG, JPG, GIF, WebP, SVG) and videos (MP4, WebM, OGG, MOV); files organized in `uploads/YYYY/MM/` structure with UUID-based filenames

### Admin Frontend (React)

The admin frontend is the full-featured interface running on `http://47.102.43.26:8081`.

#### Authentication Flow
1. `AuthContext.jsx` wraps the entire app
2. On load, checks `localStorage` for `boxx_token`
3. If token exists, calls `GET /api/me` to validate and fetch user info
4. Login stores the JWT token and fetches user data
5. Logout removes the token and clears user state

#### PostEditor (GrapesJS)
The heart of content creation:
- Full GrapesJS drag-and-drop editor with blocks (columns, text, link, image, video)
- Custom upload handler that sends files to the FastAPI backend
- Video picker modal for selecting uploaded videos
- Image and video blocks added with proper asset manager integration
- Style manager with sectors: Background, Typography, Border, Dimension, Layout, Extra
- Tag selector (程序/Coding, 金融/Finance, 英文/English, 自我/Self)
- Publishing sends the full HTML (including inline CSS) to the backend

#### Three.js Background
Uses a custom GLSL shader for the background:
- **Vertex shader**: Standard UV pass-through
- **Fragment shader**: Diagonal gradient from `#D8ECFF` (bottom-left) to `#FFFFFF` (top-right) with:
  - Slow breathing animation (sin wave)
  - Subtle film grain to prevent color banding
- Orthographic camera renders a fullscreen plane

#### Text Animations
The home page cycles through 7 phrases with unique destruction animations:
| Phrase | Destruction Effect |
|--------|-------------------|
| Information Cocoon | Scale down + scattered letter explosion |
| Misinformation | RGB split/glitch + scanline flicker + blur dissolve |
| Malicious Personal Attacks | Radial letter shrapnel burst |
| Discrimination and Bullying | Horizontal squeeze + vertical split |
| Mindless Chatter | Letters float upward blurring away |
| False Hype | Inflate scale → bright burst → collapse |
| Malicious Manipulation | Alternating letter stretch |

### Public Frontend (React)

The public frontend is a read-only version running on `http://47.102.43.26:8080`.

**Differences from Admin Frontend:**
- No `AuthProvider` — no login/logout functionality
- No `/admin/editor` route
- Has `/bubble/:id` route for viewing individual bubbles
- Guest information section is informational only (no login form)
- Feed page has a tag sidebar for filtering
- API client is read-only (no `createBubble`)

---

## Data Model

```
┌───────────┐          ┌──────────────┐
│   User    │          │   Bubble     │
├───────────┤          ├──────────────┤
│ id (PK)   │◄─────────│ author_id    │
│ username  │  1:N     │ title        │
│ password  │          │ html_content │
│ id_number │          │ tags (JSON)  │
└───────────┘          │ created_at   │
                       └──────────────┘
```

---

## Routing

### Admin Frontend (`http://47.102.43.26:8081`)

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Home (Greeting + GuestInfo + HomeOptions) | No | Landing page with login |
| `/feed` | FeedPage | No | Browse all bubbles |
| `/contact` | ChatPage | No | Contact information |
| `/justify` | JustifyPage | No | Placeholder |
| `/explore` | ExplorePage | No | Placeholder |
| `/admin/editor` | PostEditor | **Yes** | Create new bubble |

### Public Frontend (`http://47.102.43.26:8080`)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with info |
| `/feed` | FeedPage | Browse with tag sidebar |
| `/contact` | ChatPage | Contact information |
| `/justify` | JustifyPage | Placeholder |
| `/explore` | ExplorePage | Placeholder |
| `/bubble/:id` | BubbleView | View single bubble |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | No | Health check |
| `POST` | `/register` | No | Register new user |
| `POST` | `/login` | No | Login, returns JWT |
| `GET` | `/me` | **Bearer** | Get current user |
| `POST` | `/upload` | **Bearer** | Upload file (image/video) |
| `POST` | `/bubbles` | **Bearer** | Create bubble |
| `GET` | `/bubbles` | No | List bubbles (`?tag=` optional) |
| `GET` | `/bubbles/{id}` | No | Get single bubble |

---

## Authentication & Authorization

- **Method**: JWT (JSON Web Tokens) with HS256 algorithm
- **Token storage**: `localStorage` key `boxx_token`
- **Token expiry**: 24 hours (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Password hashing**: bcrypt via direct library calls (bypasses passlib)
- **Protected routes**: `/admin/editor` redirects unauthenticated users to home
- **Protected API endpoints**: `/me`, `/upload`, `POST /bubbles` — require `Authorization: Bearer <token>` header

---

## i18n — Internationalization

Custom React Context-based translation system:
- **Auto-detection**: Detects browser language (`zh` or `en`)
- **Persistence**: Saves preference to `localStorage` key `boxx_locale`
- **Translation files**: JSON files in `locals/` directory
- **Usage**: `const { t } = useI18n();` then `t('greeting.welcome')` or `t('guestInfo.rules')` (returns array)
- **Parameter interpolation**: `t('userProfile.welcome', { username: 'Alice' })` → "Welcome, Alice!"
- **Language switcher**: Top-right dropdown on home page, only visible on `/`

---

## Visual Design

### Color Scheme
- **Primary text**: `#1F3A5F` / `#1a237e` (deep navy)
- **Accent**: `#1565c0` / `#1e88e5` (blue)
- **Background**: Gradient `#D8ECFF` → `#FFFFFF` via Three.js shader
- **UI elements**: Translucent white (`rgba(255,255,255,0.6-0.95)`) with backdrop blur

### Typography
- Font: Inter (Google Fonts), with system fallbacks
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Animated home text: `clamp(1.3rem, 4.5vw, 3.2rem)` — responsive sizing

### Navigation Buttons
| Button | Color | Action |
|--------|-------|--------|
| Feed | Orange (`#e67e22`) | `/feed` |
| Contact | Blue (`#3498db`) | `/contact` |
| Justify | Purple (`#9b59b6`) | `/justify` |
| Explore | Green (`#2ecc71`) | `/explore` |

---

## How to Run

### Backend

```bash
cd Backend
pip install -r requirements.txt
# Make sure .env has SECRET_KEY set
uvicorn main:app --reload
```

### Admin Frontend

```bash
cd Admin_Frontend
npm install
npm run dev          # Runs on http://127.0.0.1:5173 (dev) — build for production on port 8081
```

### Public Frontend

```bash
cd Public_Frontend
npm install
npm run dev          # Runs on http://127.0.0.1:5174 (dev) — build for production on port 8080
```

The Vite dev server proxies `/api/*` requests to `http://47.102.43.26:8000` and strips the `/api` prefix (e.g., `/api/login` → `http://127.0.0.1:8000/login`), and proxies `/uploads/*` directly to the backend.

---

## Development Status

### ✅ Completed
- Backend: Full CRUD API with JWT auth and file uploads
- Admin Frontend: GrapesJS editor, feed page, auth flow, language switching
- Public Frontend: Feed browsing with tag filtering, individual bubble view
- Three.js animated background
- Text animation sequence with destruction effects
- Internationalization (English / Chinese)
- Guest information & login form
- User profile display & logout

### 🚧 Placeholder / In Progress
- **ChatPage**: Displays contact info only (QQ group)
- **JustifyPage**: "Coming soon" placeholder
- **ExplorePage**: "Coming soon" placeholder

### 🔮 Potential Future Features
- Real-time chat functionality
- Comment system on bubbles
- User registration (register endpoint exists but no UI in admin frontend)
- User profiles & settings
- Mobile app or PWA support
- Search functionality
- Notifications
- Moderation tools

---

## Key Concepts

### "Bubbles"
The platform's core content unit — rich HTML posts created with the GrapesJS visual editor. The name is a double-meaning:
1. Each post is a discrete "bubble" of content
2. The platform aims to help users **pop** their information cocoons (filter bubbles)

### "Breaking Information Cocoons"
The platform's mission is encoded in its animated home screen, which visually destroys harmful digital phenomena (misinformation, echo chambers, cyberbullying) — symbolizing the platform's goal of fostering healthier online discourse.

---

*Generated from code analysis — October 2026*