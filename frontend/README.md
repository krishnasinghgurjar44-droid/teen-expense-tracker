# TeenSpend Frontend Application

Vibrant, responsive React + Vite web application for **TeenSpend — Teenager Expense Tracker**, designed specifically for teenagers to develop smart, lifelong money-saving habits.

---

## Features

- **Dashboard**: Monthly budget progress bar (<70% normal, 70-90% caution, 90-100% alert, >100% exceeded), summary metrics, daily average, recent expenses.
- **Visual Analytics**: Interactive Recharts graphs: Category Donut, Daily Spending Line Chart, Monthly Comparison Bar Chart, and Category Comparison Bar Chart.
- **Smart Suggestions**: Educational, non-judgmental spending tips (food share, shopping pauses, small recurring purchase detection).
- **Expense Management**: Multi-filter history (category, payment method, date range, min/max amount), search, sort, responsive table/cards layout.
- **Budget Manager**: Monthly budget setter, presets, utilization progress, and past month history.
- **Dark & Light Mode**: User selectable (Light, Dark, System) with localStorage persistence.
- **Mobile First**: Floating quick-add action bar for phone screens.

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
Default:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

#### Windows PowerShell note

If PowerShell reports that `npm.ps1` cannot be loaded because script execution is
disabled, the development server has not started yet, so the URL will not respond.
Use either of these Windows-safe options instead:

```powershell
npm.cmd run dev
```

or double-click `start-dev.cmd` in this folder. Once Vite reports that it is ready,
open the local URL it prints (normally `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
Builds optimized production assets to `dist/`.
