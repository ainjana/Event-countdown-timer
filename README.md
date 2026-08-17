# ⏳ Event Countdown Timer (Full-Stack Production App)

A production-ready, full-stack **Event Countdown Timer** web application featuring an editorial luxury design system inspired by top-tier modern web aesthetics. Built with **Django REST Framework** on the backend and **React (Vite)** on the frontend with **PostgreSQL** support, **JWT Authentication**, and real-time client-side live countdowns.

---

## 1. Project Overview

The Event Countdown Timer allows authenticated users to create, manage, and monitor their upcoming milestone events such as:
* ✈️ **Trips**
* 🎂 **Birthdays**
* 🚀 **Product Launches**
* 💍 **Weddings**
* 📚 **Exams**
* 🥂 **Anniversaries**
* ✨ **Custom Events**

Each event displays a live real-time countdown showing:
$$\text{Days} : \text{Hours} : \text{Minutes} : \text{Seconds}$$

The countdown updates automatically every second on the client side without repeatedly hitting the backend server.

---

## 2. Features

- **JWT Authentication**: Register, Login, Token Refresh, and Profile (`/api/auth/me/`) management using Simple JWT.
- **User Isolation**: Secure object-level authorization ensuring users can only view, edit, or delete their own events.
- **Editorial Luxury UI Design**: Custom styling with soft off-white canvas (`#F4F3EF`), deep onyx contrast (`#111111`), floating glass pill Navbar, Playfair Display serif typography accents, and tactile pill buttons.
- **Real-Time Client Countdown**: Client-side interval updating live countdowns without refreshing the page or polling the backend.
- **Dynamic Countdown States**:
  - **Upcoming (> 24 Hours)**: Days : Hours : Minutes : Seconds
  - **Less than 1 Day (< 24 Hours)**: Hours : Minutes : Seconds
  - **Event Reached**: "🎉 Event Started!" state (no negative values).
- **Dashboard Analytics**: Top stats overview (Total Events, Upcoming, Today, Completed).
- **Search, Filter & Sort**: Search by title, filter by category pill, and sort by target date.
- **Delete Confirmation Modal**: Custom non-blocking modal confirmation dialog.
- **Comprehensive Test Suite**: Django backend unit test suite + Vitest frontend unit test suite.
- **Docker Ready**: One-command complete deployment via `docker compose up --build`.

---

## 3. Technology Stack

### Backend
- **Python 3.12+**
- **Django 5.0**
- **Django REST Framework**
- **Django Simple JWT** (JSON Web Tokens)
- **Django CORS Headers**
- **PostgreSQL** (with SQLite fallback for rapid local dev)

### Frontend
- **React 18**
- **Vite**
- **React Router DOM 6**
- **Axios** (with automatic JWT token refresh interceptor)
- **Lucide React Icons**
- **Vitest**

---

## 4. Environment Variables

### Backend `.env` (`/backend/.env`)

```env
SECRET_KEY=django-insecure-event-countdown-secret-key-change-in-production
DEBUG=True
USE_POSTGRES=False
DATABASE_NAME=event_countdown_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgrespassword
DATABASE_HOST=localhost
DATABASE_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

### Frontend `.env` (`/frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 5. Local Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (Linux/macOS)
# source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations events
python manage.py migrate

# Run backend unit tests
python manage.py test events

# Start development server
python manage.py runserver 8000
```

Backend will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Vitest test suite
npm run test

# Start Vite dev server
npm run dev
```

Frontend application will be available at `http://localhost:5173`.

---

## 6. Docker Container Deployment

Start the complete application stack (PostgreSQL + Django + React) using Docker Compose:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:8000/api/`
- **PostgreSQL**: `localhost:5432`

---

## 7. REST API Endpoint Documentation

### Authentication Endpoints

#### `POST /api/auth/register/`
Create a new user account and obtain access/refresh tokens.

*Request:*
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "password_confirm": "Password123!"
}
```

*Response (201 Created):*
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>"
}
```

#### `POST /api/auth/login/`
Obtain JWT token pair.

*Request:*
```json
{
  "username": "johndoe",
  "password": "Password123!"
}
```

*Response (200 OK):*
```json
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>"
}
```

#### `GET /api/auth/me/`
Fetch details of current authenticated user.

*Headers:* `Authorization: Bearer <jwt_access_token>`

---

### Event REST API Endpoints

#### `GET /api/events/`
Fetch authenticated user's events. Supports query parameters `search`, `category`, and `ordering`.

*Headers:* `Authorization: Bearer <jwt_access_token>`

#### `POST /api/events/`
Create a new countdown event.

*Headers:* `Authorization: Bearer <jwt_access_token>`

*Request:*
```json
{
  "title": "Goa Vacation Trip",
  "description": "Family trip to South Goa beaches",
  "category": "Trip",
  "target_date": "2026-12-20T10:00:00Z"
}
```

#### `GET /api/events/<id>/`
Retrieve a single event owned by the logged-in user.

#### `PUT /api/events/<id>/` / `PATCH /api/events/<id>/`
Update an event owned by the logged-in user.

#### `DELETE /api/events/<id>/`
Delete an event owned by the logged-in user.
