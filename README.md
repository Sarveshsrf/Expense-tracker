
# 📄 **✨ PROFESSIONAL README FOR YOUR GITHUB PROJECT**

*(Expense Tracker — Full Stack: JS + Node.js + MongoDB)*


# 🚀 Expense Tracker — Full Stack (Frontend + Backend)

A full-stack **Expense Tracking application** built using **HTML/CSS/JavaScript (frontend)** and **Node.js + Express + MongoDB (backend)**.
Supports **income/expense management, filters, charts, CSV export, and real-time data storage**.

This project demonstrates strong skills in **JavaScript, full-stack development, REST APIs, CRUD operations, and database design**.

---

## 🌟 Features

### 🎨 Frontend (HTML + CSS + JavaScript)

* Add income & expense entries
* Edit & delete transactions
* Filter by **month** & **category**
* Live updating **balance, total income, total expense**
* Colorful **bar chart visualization** (Canvas API)
* CSV export
* Fully responsive UI

### 🖥 Backend (Node.js + Express)

* REST API for all CRUD operations
* `/api/transactions` → create, read, update, delete
* `/api/export` → CSV export
* Mongoose schema + validations
* CORS enabled for frontend communication

### 🗄 Database (MongoDB)

* Stores all transactions
* Sortable, queryable, filterable
* Uses ISO date format

---

## 🏗️ Tech Stack

### **Frontend**

* HTML5
* CSS3
* JavaScript (ES6+)

### **Backend**

* Node.js
* Express.js
* Mongoose

### **Database**

* MongoDB (Local or Atlas)

---

## 📁 Project Structure

```
expense_tracker_full/
│
├── frontend/
│    ├── index.html
│    ├── style.css
│    └── script.js
│
├── backend/
│    ├── server.js
│    ├── package.json
│    ├── .env.example
│    ├── models/
│    └── routes/
│
└── README.md
```

---

# ⚙️ Installation & Setup (No Docker)

## 📌 1. Clone Repository

```bash
git clone https://github.com/<your-username>/expense-tracker-full.git
cd expense-tracker-full/backend
```

---

# 📌 2. Install Backend Dependencies

```bash
npm install
```

---

# 📌 3. Create Environment File

Copy:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_tracker_db
```

into a new `.env` file:

```bash
copy .env.example .env
```

---

# 📌 4. Start MongoDB

If installed as a Windows service:

```bash
net start MongoDB
```

If using Compass, open it → ensure it connects to `mongodb://localhost:27017`.

---

# 📌 5. Start Backend Server

```bash
npm run dev
```

Expected:

```
MongoDB connected
Server started on port 5000
```

---

# 📌 6. Run Frontend

Go to:

```
expense_tracker_full/frontend/index.html
```

Double-click to open in your browser.

---

# 🔗 API Endpoints (Backend)

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | /api/transactions     | Get all transactions  |
| POST   | /api/transactions     | Add a new transaction |
| PUT    | /api/transactions/:id | Update transaction    |
| DELETE | /api/transactions/:id | Delete transaction    |
| GET    | /api/export           | Download CSV export   |

Screenshot of the implemented project 
<img width="1902" height="1022" alt="image" src="https://github.com/user-attachments/assets/2469a71d-7e67-4299-b852-5a4b0f282e76" />


