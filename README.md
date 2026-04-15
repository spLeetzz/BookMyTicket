# BMS — Book My Ticket

A movie seat booking backend with JWT authentication and PostgreSQL row-level locking to prevent double bookings.

## How It Works

### Authentication

- **Register** → creates user, returns JWT access token + httpOnly refresh cookie
- **Login** → validates credentials, returns token pair
- **Refresh** → rotates refresh token (old one is deleted, new pair issued)
- **Logout** → deletes refresh token from DB, clears cookie
- **Google OAuth** → `/google` redirects to consent screen, `/google/callback` exchanges code for tokens

Access tokens are short-lived (e.g. `15m`). Refresh tokens are longer-lived (e.g. `7d`), stored hashed in the DB, and rotated on every use.

### Seat Booking with PostgreSQL Locks

The core problem: two users try to book the same seat at the same time. A simple check-then-update is vulnerable to race conditions.

This project uses `SELECT ... FOR UPDATE` inside a transaction to lock the row:

```
BEGIN
  SELECT * FROM seats WHERE id = $1 AND is_booked = false FOR UPDATE
  → if no row: ROLLBACK, seat is already taken
  → if row exists: it's locked, no other transaction can touch it
  UPDATE seats SET is_booked = true, booked_by = $2 WHERE id = $1
COMMIT
```

`FOR UPDATE` acquires an exclusive row lock. Any concurrent transaction trying to `SELECT FOR UPDATE` on the same row blocks until the first transaction commits or rolls back. This guarantees only one user can book a seat — no duplicates possible.

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 17 (or use Docker)

### 1. Clone and install

```bash
git clone <repo-url>
cd BMS
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user `user`, password `pass`, database `bookticket`.

### 3. Create `.env`

```bash
cp .env.example .env
```

Fill in the secrets — `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET` must be at least 10 characters. For Google OAuth, go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth client → Authorized redirect URI = `http://localhost:3000/google/callback`.

### 4. Run migrations

```bash
npx drizzle-kit migrate
```

### 5. Seed mock data (optional)

```bash
npm run seed
```

Creates 3 mock events with 20 seats each.

### 6. Start the server

```bash
# Dev (watch mode)
npm run dev

# Production
npm run build
npm start
```

Server starts on the port from `PORT` env variable (default `3000`).

## API Reference

### Auth

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/auth/register` | No | `{ firstName, lastName?, email, password }` |
| POST | `/auth/login` | No | `{ email, password }` |
| POST | `/auth/logout` | Cookie | — |
| POST | `/auth/refresh` | Cookie | — |
| GET | `/google` | No | — |
| GET | `/google/callback?code=&state=` | No | — |

**Responses** return `{ accessToken }` in JSON. Refresh token is set as an httpOnly cookie (`refreshToken`).

### Seats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seats` | No | All seats with booking status |
| PUT | `/seats/:seatId/:userId` | Yes | Book a seat |

Booking returns the updated seat object. If already booked → `409 Conflict`.

### Health

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/health` | No |

## Usage Examples

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}' \
  -c cookies.txt

# Book a seat (seatId=1, userId=1)
curl -X PUT http://localhost:3000/seats/1/1 \
  -H "Authorization: Bearer <accessToken>"

# Refresh token
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## Project Structure

```
src/
├── app/                    # Seat booking domain
│   ├── controller/         # HTTP handlers
│   ├── interfaces/         # TypeScript contracts
│   ├── repositories/       # DB queries (raw SQL with pg Pool)
│   ├── routes/             # Express router
│   ├── schemas/            # Zod validation
│   └── services/           # Business logic
├── auth/                   # Authentication domain
│   ├── controller/
│   ├── interfaces/
│   ├── repositories/       # Drizzle ORM queries
│   ├── routes/
│   ├── schemas/
│   └── services/
├── config/                 # Env validation, session config
├── db/                     # Drizzle schema, migrations, seed
├── middlewares/            # authenticate, errorHandler
├── utils/                  # JWT helpers, ApiError class
├── server.ts               # Express app setup
└── app.ts                  # Entry point
```

## Database Schema

```
users
├── id (serial, PK)
├── first_name (varchar 50)
├── last_name (varchar 50, nullable)
├── email (varchar 322, unique)
├── password_hash (varchar 255, nullable — null for OAuth users)
├── is_active (boolean, default true)
├── created_at, updated_at

events
├── id (serial, PK)
├── title (varchar 255)
├── venue (varchar 255)
├── event_at (timestamptz)
├── is_active (boolean)
├── created_at, updated_at

seats
├── id (serial, PK)
├── event_id (integer, FK → events)
├── seat_number (integer)
├── is_booked (boolean, default false)
├── booked_by (integer, FK → users, nullable)
├── booked_at (timestamptz, nullable)
├── is_active (boolean)
├── created_at, updated_at
├── UNIQUE (event_id, seat_number)

refresh_tokens
├── id (serial, PK)
├── user_id (integer, FK → users)
├── token_hash (varchar 255, unique)
├── expires_at (timestamptz)
├── created_at
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | TypeScript watch + auto-restart |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled app |
| `npm run studio` | Drizzle database GUI |
| `npm run seed` | Insert mock events + seats |
