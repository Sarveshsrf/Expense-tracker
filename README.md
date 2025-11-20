# Expense Tracker — Full ZIP (Frontend + Backend)

This archive contains a simple Expense Tracker frontend and a Node.js + Express + MongoDB backend.

## Structure
```
expense-tracker_full/
  frontend/
    index.html
    style.css
    script.js
  backend/
    package.json
    server.js
    models/Transaction.js
    routes/transactions.js
    routes/export.js
    .env.example
    Dockerfile
    docker-compose.yml
```

## Quick choice — Easiest to run (recommended)
If you already have Docker installed, run the whole stack with one command (MongoDB + app):
```bash
cd backend
docker-compose up --build
```
Backend will be available at: http://localhost:5000

Open `frontend/index.html` in your browser (double-click) or serve it with a static server.
Frontend expects backend API at: http://localhost:5000/api

---

## Step-by-step (without Docker) — easiest manual approach

### 1) Install Node & npm
Make sure Node.js (>=16) and npm are installed.

### 2) Start MongoDB
Option A — Install MongoDB locally and start service.
Option B — Use Docker:
```bash
docker run -d --name mongo -p 27017:27017 -v mongo-data:/data/db mongo:6
```

### 3) Install backend dependencies
```bash
cd backend
npm install
```

### 4) Create .env file
Copy `.env.example` to `.env` and edit if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_tracker_db
```

### 5) Run backend
```bash
npm run dev
# or
node server.js
```
You should see `MongoDB connected` and `Server started on port 5000`.

### 6) Open the frontend
Open `frontend/index.html` in browser. The frontend will call the backend at http://localhost:5000/api

---

## API endpoints
- GET  /api/transactions
- POST /api/transactions
- PUT  /api/transactions/:id
- DELETE /api/transactions/:id
- GET  /api/export  (CSV export)

---

## Notes
- Frontend will fallback to localStorage if backend is unreachable.
- Use Postman or curl to test API directly.
- To deploy: use MongoDB Atlas for DB and host Node app on Render/Heroku/Railway.