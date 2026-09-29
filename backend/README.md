# TeenSpend Backend API

Production-ready Node.js & Express REST API for **TeenSpend — Teenager Expense Tracker**, built with clean MVC architecture, PostgreSQL (Supabase), JWT authorization, and bcrypt password hashing.

---

## Architecture

```text
HTTP Request
   ↓
Middleware (Helmet, CORS, Rate Limit, Auth, Validation)
   ↓
Routes (Express Routers)
   ↓
Controllers (HTTP response formatting, status codes)
   ↓
Services (Business logic, suggestion rules, aggregations)
   ↓
Models (Supabase / PostgreSQL data access layer)
   ↓
Database (PostgreSQL / Supabase)
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP Server port | `5000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | (Set a 32+ char secret) |
| `JWT_EXPIRES_IN` | JWT expiration duration | `7d` |
| `SUPABASE_URL` | Supabase Project URL | Optional in dev (auto memory fallback) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secret Service Role Key | Server-side only! Never expose to client. |

### 3. Run Database Migrations
If using Supabase cloud, copy and run `src/database/schema.sql` in your Supabase SQL Editor.

### 4. Seed Development Data
```bash
npm run seed
```
Creates default categories, monthly budgets, and 20+ realistic teenager expenses for demo user:
- **Email**: `teen@teenspend.app`
- **Password**: `Password#123`

### 5. Run the Server
```bash
# Development (with nodemon auto-restart)
npm run dev

# Production
npm start
```

### 6. Run Automated Tests
```bash
npm test
```
Runs 19 integration tests covering registration, login, authentication, expense CRUD, security ownership constraints, budget tracking, and dashboard calculations.
