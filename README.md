# TeenSpend — Teenager Expense Tracker

A modern, secure, and production-ready full-stack web application designed to help teenagers track daily spending, understand where their pocket money goes, visualize expenses with interactive charts, manage a monthly budget, and build smart, lifelong financial habits.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Architecture](#folder-architecture)
4. [Database Design & Supabase Setup](#database-design--supabase-setup)
5. [Security & Authentication](#security--authentication)
6. [Rule-Based Suggestion Engine](#rule-based-suggestion-engine)
7. [Installation & Setup](#installation--setup)
8. [Running the Application](#running-the-application)
9. [Running Tests & Seeding Data](#running-tests--seeding-data)
10. [REST API Documentation](#rest-api-documentation)
11. [Token Storage Strategy & Tradeoffs](#token-storage-strategy--tradeoffs)

---

## 1. Project Overview

TeenSpend gives teenagers a clean, friendly, and non-judgmental platform to manage their allowance and daily spending.

### Core Capabilities:
- **Record Every Expense**: Capture title, amount in Indian Rupees (`₹`), category, date, payment method (`UPI`, `Cash`, `Debit Card`, `Other`), and notes.
- **Monthly Budget Tracking**: Real-time progress bar with color-coded alerts (<70% normal, 70-90% caution, 90-100% alert, >100% exceeded).
- **Financial Analytics**: Interactive Recharts visualizations:
  1. Category Spending Donut Chart
  2. Daily Spending Line Chart
  3. Monthly Spending Trend Bar Chart (multi-month historical comparison)
  4. Horizontal Category Breakdown Bar Chart
  5. Payment Method Share Breakdown
- **Smart Spending Suggestions**: Deterministic, rule-based educational tips analyzing food share, shopping spikes, frequent small transactions (<₹100), and month-to-month changes.
- **Search & Filter**: Search by title/description, filter by category, payment method, date range, min/max amounts, and sort.
- **Mobile First & Dark Mode**: Responsive design with a floating "+" action button on phones, desktop sticky sidebar, and Light/Dark/System theme switcher.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v18) + Vite
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios (configured with interceptors)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Design System**: Vanilla CSS with modern custom tokens, dark mode, glassmorphism, responsive grids

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Architecture**: MVC (Model-View-Controller) with Routes → Controllers → Services → Models
- **Database**: PostgreSQL (via Supabase `@supabase/supabase-js`)
- **Security**: bcryptjs password hashing, JSON Web Tokens (JWT), Helmet, CORS, express-rate-limit

---

## 3. Folder Architecture

The project maintains strict physical separation between the frontend React application and backend Express API:

```text
teen-expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Supabase PostgreSQL client + zero-config fallback
│   │   │   └── env.js                  # Environment configuration & validation
│   │   ├── controllers/
│   │   │   ├── authController.js       # Auth endpoint handlers
│   │   │   ├── expenseController.js    # Expense CRUD & filter handlers
│   │   │   ├── budgetController.js     # Monthly budget handlers
│   │   │   ├── dashboardController.js  # Summaries, metrics & chart data
│   │   │   ├── profileController.js    # User profile & account deletion
│   │   │   └── categoryController.js   # Category listing
│   │   ├── models/
│   │   │   ├── userModel.js            # User database operations
│   │   │   ├── expenseModel.js         # Expense queries, search, pagination
│   │   │   ├── budgetModel.js          # Monthly budget upsert & history
│   │   │   └── categoryModel.js        # Category queries
│   │   ├── services/
│   │   │   ├── authService.js          # Hashing, token issuance, registration
│   │   │   ├── expenseService.js       # Expense business logic & validation
│   │   │   ├── budgetService.js        # Budget calculations & threshold status
│   │   │   ├── dashboardService.js     # Metric aggregation & chart transformations
│   │   │   └── suggestionService.js    # Rule-based educational advice engine
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   └── categoryRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT Bearer token validator
│   │   │   ├── validationMiddleware.js # Schema validation runner
│   │   │   └── errorMiddleware.js      # Centralized error & 404 handlers
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── expenseValidator.js
│   │   │   └── budgetValidator.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js          # Standardized JSON response formatting
│   │   │   ├── jwt.js                  # JWT sign & verify
│   │   │   └── password.js             # bcrypt password hashing
│   │   ├── database/
│   │   │   ├── schema.sql              # Supabase PostgreSQL schema, indexes & RLS
│   │   │   └── seed.js                 # Realistic seed data script
│   │   ├── app.js                      # Express app assembly & middlewares
│   │   └── server.js                   # Server boot & graceful shutdown
│   ├── tests/
│   │   └── api.test.js                 # 19 automated integration tests
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Header with greeting, theme switch, profile
    │   │   ├── Sidebar.jsx             # Desktop navigation sidebar
    │   │   ├── BottomNav.jsx           # Mobile bottom navigation with quick "+" action
    │   │   ├── SummaryCard.jsx         # Metric card with icons and trends
    │   │   ├── BudgetCard.jsx          # Budget progress bar & alerts
    │   │   ├── ExpenseCard.jsx         # Mobile transaction card
    │   │   ├── ExpenseTable.jsx        # Desktop responsive data table
    │   │   ├── ExpenseForm.jsx         # Create & edit expense form
    │   │   ├── ExpenseChart.jsx        # Daily spending Line Chart (Recharts)
    │   │   ├── CategoryChart.jsx       # Category Donut Chart (Recharts)
    │   │   ├── MonthlyBarChart.jsx     # Multi-month trend Bar Chart (Recharts)
    │   │   ├── CategoryComparisonChart.jsx # Category breakdown Bar Chart (Recharts)
    │   │   ├── SpendingSuggestions.jsx # Rule-based insight cards
    │   │   ├── EmptyState.jsx          # Friendly teenager empty states
    │   │   ├── Loader.jsx              # Spinners and skeleton loaders
    │   │   ├── ConfirmationModal.jsx   # Deletion confirmation dialog
    │   │   └── Pagination.jsx          # Page controls
    │   ├── pages/
    │   │   ├── Login.jsx               # Login with 1-click demo button
    │   │   ├── Register.jsx            # Registration with confirmation
    │   │   ├── Dashboard.jsx           # Main overview screen
    │   │   ├── Expenses.jsx            # Filterable expense history
    │   │   ├── AddExpense.jsx          # Dedicated add expense screen
    │   │   ├── Budget.jsx              # Monthly budget manager & history
    │   │   ├── Analytics.jsx           # Graphical charts page
    │   │   └── Profile.jsx             # Profile view, password change & account delete
    │   ├── context/
    │   │   ├── AuthContext.jsx         # User session & token state
    │   │   └── ThemeContext.jsx        # Light / Dark / System mode state
    │   ├── services/
    │   │   ├── api.js                  # Axios client with interceptors
    │   │   ├── authService.js
    │   │   ├── expenseService.js
    │   │   ├── budgetService.js
    │   │   └── dashboardService.js
    │   ├── utils/
    │   │   └── formatters.js           # INR (₹) and date formatters
    │   ├── App.jsx                     # Route declarations & ProtectedLayout
    │   ├── main.jsx                    # React root entrypoint
    │   └── index.css                   # Complete design system & custom CSS variables
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    ├── package.json
    └── README.md
```

---

## 4. Database Design & Supabase Setup

### Database Tables:
1. **`users`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `name VARCHAR(100) NOT NULL`
   - `email VARCHAR(255) UNIQUE NOT NULL`
   - `password_hash VARCHAR(255) NOT NULL`
   - `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`

2. **`categories`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `name VARCHAR(50) UNIQUE NOT NULL`
   - `icon VARCHAR(50) NOT NULL` (e.g. 🍔, 🚌, 📚, 🛍️, 🎮, ⚡, 💊, ✨, 📦)
   - `color VARCHAR(20)`
   - `created_at TIMESTAMPTZ`

3. **`expenses`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `user_id UUID REFERENCES users(id) ON DELETE CASCADE`
   - `category_id UUID REFERENCES categories(id) ON DELETE RESTRICT`
   - `title VARCHAR(150) NOT NULL`
   - `description TEXT`
   - `amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)`
   - `expense_date DATE NOT NULL DEFAULT CURRENT_DATE`
   - `payment_method VARCHAR(30) CHECK (payment_method IN ('Cash', 'UPI', 'Debit Card', 'Other'))`
   - `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`

4. **`budgets`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `user_id UUID REFERENCES users(id) ON DELETE CASCADE`
   - `month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12)`
   - `year INTEGER NOT NULL CHECK (year >= 2020)`
   - `amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)`
   - `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
   - `UNIQUE (user_id, month, year)`

### Indexes & Performance:
- `idx_users_email` on `users(email)`
- `idx_expenses_user_id` on `expenses(user_id)`
- `idx_expenses_user_date` on `expenses(user_id, expense_date DESC)`
- `idx_expenses_user_category` on `expenses(user_id, category_id)`
- `idx_budgets_user_period` on `budgets(user_id, year, month)`

### Setting Up Supabase:
1. Open your [Supabase Dashboard](https://app.supabase.com) and create a project.
2. Go to the **SQL Editor** tab.
3. Open `backend/src/database/schema.sql` and run the entire script. It automatically creates all tables, triggers, indexes, seeds default categories, and enables Row Level Security (RLS).
4. In your Supabase Project Settings > API, copy:
   - Project URL -> `SUPABASE_URL` in `backend/.env`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`

*(Note: If testing locally before setting up Supabase, the backend automatically runs in local in-memory PostgREST mode so you can build, run, and test immediately without blocking).*

---

## 5. Security & Authentication

- **Password Hashing**: Passwords are hashed using `bcryptjs` with 10 salt rounds. Plaintext passwords and password hashes are never exposed in any API response.
- **JWT Authorization**: Issued upon valid login with minimal payload (`id`, `email`). Protected routes verify the token using `authMiddleware`.
- **Ownership Verification**: Every expense and budget query, update, and deletion strictly checks `authenticated user_id === record.user_id`. Attempting to access another user's expense immediately returns `404 Not Found / Access Denied`.
- **Zero Client Exposure of Credentials**: The Supabase service-role key is used strictly server-side. The React frontend communicates **only** with the Express REST API.
- **Security Headers & Rate Limiting**: Helmet sets secure HTTP headers. Express Rate Limiter limits brute-force attempts on `/api/auth` endpoints.
- **Safe Error Handling**: Internal stack traces are suppressed in production responses to prevent information leakage.

---

## 6. Rule-Based Suggestion Engine

TeenSpend includes a deterministic, rule-based recommendation service (`suggestionService.js`) designed specifically for teenagers. It avoids judgmental language and focuses on constructive spending habits without giving stock, crypto, loan, or investment advice.

- **Rule 1 — Budget Usage (>= 90%)**: Warns when approaching or exceeding the planned monthly limit.
- **Rule 2 — Food Outflow (> 30% of total)**: Suggests packing snacks or planning weekly treats when food consumes a large share of pocket money.
- **Rule 3 — Shopping Spikes (>= 25% of total)**: Introduces the 48-hour rule to curb impulse buying.
- **Rule 4 — Entertainment Share (> 20% of total)**: Encourages student discounts and group activities.
- **Rule 5 — Frequent Micro-Purchases**: Detects small expenses (<= ₹100); if frequent (>= 4 purchases totaling >= ₹200), shows how small chai, soda, or snacks add up to significant amounts.
- **Rule 6 — Month-to-Month Spending Increase (> 15%)**: Notifies users when current spending is outpacing the prior month.
- **Rule 7 — Healthy Remaining Budget (< 65% utilized)**: Positively reinforces good pacing and suggests keeping the remainder as an emergency cushion.

---

## 7. Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Step 1: Clone or navigate to the repository
```bash
cd teen-expense-tracker
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 8. Running the Application

### Start Backend API Server
In one terminal window:
```bash
cd teen-expense-tracker/backend
npm run dev
```
The server will start on `http://localhost:5000`.

### Start Frontend Application
In a second terminal window:
```bash
cd teen-expense-tracker/frontend
npm run dev
```
The application will launch on `http://localhost:5173`. Open this URL in your web browser.

---

## 9. Running Tests & Seeding Data

### Run Automated Backend Tests
```bash
cd teen-expense-tracker/backend
npm test
```
Executes the test suite with 19 comprehensive tests verifying:
- Health check
- User registration & duplicate email rejection (409)
- Password validation (422)
- Login & invalid credential rejection (401)
- Protected route authentication
- Category listing
- Monthly budget creation & retrieval
- Expense CRUD operations & negative amount validation
- Cross-user unauthorized data tampering prevention
- Dashboard calculations, charts datasets, and suggestion rules
- Expense deletion

### Seed Demo Teenager Account
```bash
cd teen-expense-tracker/backend
npm run seed
```
Creates test account:
- **Email**: `teen@teenspend.app`
- **Password**: `Password#123`
- Pre-seeds 3 months of budgets and 20+ realistic expenses across Food, Metro Travel, Textbooks, Gaming, and Mobile Recharges.

*(You can also click the **"Use Demo Account"** button on the Login page to fill these credentials automatically).*

---

## 10. REST API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### `POST /auth/register`
Creates a new user account.
- **Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "password": "Password#123",
    "confirmPassword": "Password#123"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Welcome to TeenSpend! Your account was created successfully.",
    "data": {
      "user": { "id": "...", "name": "Aarav Sharma", "email": "aarav@example.com" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

#### `POST /auth/login`
Authenticates a user and returns a signed JWT.
- **Body**:
  ```json
  {
    "email": "aarav@example.com",
    "password": "Password#123"
  }
  ```
- **Response (200)**: Returns user info and JWT token.

#### `GET /auth/me`
Gets current authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: User profile object.

#### `POST /auth/change-password`
Updates user password.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }`

---

### Expense Endpoints

#### `GET /expenses`
Retrieves paginated, filtered, and sorted expenses for the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `15`, max `100`)
  - `category`: Filter by category UUID
  - `paymentMethod`: `Cash`, `UPI`, `Debit Card`, `Other`
  - `search`: Case-insensitive title search
  - `from`: Start date `YYYY-MM-DD`
  - `to`: End date `YYYY-MM-DD`
  - `minAmount`: Numeric minimum
  - `maxAmount`: Numeric maximum
  - `sort`: `newest`, `oldest`, `highest`, `lowest`
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Expenses retrieved successfully.",
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3
    }
  }
  ```

#### `POST /expenses`
Records a new expense.
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "College Canteen Lunch",
    "amount": 140,
    "category_id": "...",
    "expense_date": "2026-09-28",
    "payment_method": "UPI",
    "description": "Lunch with classmates"
  }
  ```
- **Response (201)**: Returns the newly created expense object with category details.

#### `PUT /expenses/:id`
Updates an existing expense (verifies user ownership).
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: Updated expense.

#### `DELETE /expenses/:id`
Permanently deletes an expense (verifies user ownership).
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: `{ "success": true, "message": "Expense deleted successfully." }`

---

### Budget Endpoints

#### `GET /budget`
Returns budget status for a given period.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `month` (1-12), `year` (YYYY)
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "month": 9,
      "year": 2026,
      "budget": 10000,
      "spent": 6250,
      "remaining": 3750,
      "percentage": 63,
      "status": "normal",
      "statusMessage": "You're spending comfortably within your budget."
    }
  }
  ```

#### `POST /budget`
Sets or updates the monthly budget.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "month": 9, "year": 2026, "amount": 10000 }`

#### `GET /budget/history`
Returns historical budgets and actual amounts spent across previous months.

---

### Dashboard & Analytics Endpoints

#### `GET /dashboard/summary`
Returns top cards (Monthly Budget, Total Spent, Remaining, Daily Average, Tx Count, Month Comparison).

#### `GET /dashboard/recent`
Returns latest 5-8 transactions.

#### `GET /dashboard/analytics`
Returns structured chart datasets:
- `categoryDonut`: Array for pie/donut chart with names, icons, colors, amounts, percentages.
- `dailySpending`: Array for line chart mapping every day of the month.
- `monthlyTrend`: Array for bar chart comparing spending vs budget across the last 6 months.
- `categoryComparison`: Array for horizontal category comparison bar chart.
- `paymentMethods`: Cash vs UPI vs Debit Card breakdown.

#### `GET /dashboard/suggestions`
Returns 2–4 personalized educational suggestions computed from deterministic rules.

---

### Profile Endpoints

#### `GET /profile`: View user profile.
#### `PUT /profile`: Update display name.
#### `DELETE /profile`: Cascading deletion of account and all associated transactions and budgets.

---

## 11. Token Storage Strategy & Tradeoffs

In this web application, authentication uses JSON Web Tokens (JWT). When choosing client-side storage, developers face specific security tradeoffs:

### Strategy Implemented in TeenSpend:
- The token is placed in `localStorage` by `AuthContext`, and injected into outgoing HTTP requests via Axios request interceptors (`Authorization: Bearer <token>`).
- If an API request returns `401 Unauthorized` (e.g. token expired), the Axios response interceptor immediately cleans up local tokens and directs the user to `/login?sessionExpired=true`.

### Tradeoff Discussion:
1. **`localStorage`**:
   - *Pros*: Simple, reliable across subdomains and during local multi-port development (`localhost:5173` talking to `localhost:5000`), completely immune to Cross-Site Request Forgery (CSRF).
   - *Tradeoff*: Vulnerable to Cross-Site Scripting (XSS) if untrusted third-party scripts execute in the browser. TeenSpend mitigates XSS through strict input validation, React's native string escaping, and Helmet security headers (`X-XSS-Protection`, `Content-Security-Policy`).
2. **`httpOnly` Cookies**:
   - *Alternative for Production*: Storing JWTs inside `httpOnly; Secure; SameSite=Strict` cookies completely prevents JavaScript from accessing tokens, eliminating XSS token theft. However, it requires a reverse proxy or same-site domain configuration and requires CSRF tokens (e.g. Double Submit Cookie pattern) to prevent cross-site request forgery.
   - *Recommendation for Enterprise Deployment*: When deploying TeenSpend under a unified production domain (e.g., `app.teenspend.com` and `api.teenspend.com`), configuring `httpOnly` cookies with `SameSite=Lax` or `Strict` and CSRF protection provides the strongest defense-in-depth posture.
