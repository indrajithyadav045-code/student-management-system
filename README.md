# CampusFlow — Student Management REST API (Week 3 Backend)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.4-blue.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust, modular, and secure **Student Management RESTful API** developed with **Node.js, Express.js, and MySQL 8.4**. Built as the **Week 3 Backend Milestone** for **CampusFlow – Student Management System**, ready for independent execution and future frontend integration in Week 4.

---

## 📌 Project Overview

This backend powers institutional student data operations with:
- **Full CRUD REST Endpoints** (`POST`, `GET`, `PUT`, `DELETE`).
- **Parameterized SQL Queries** preventing SQL Injection attacks.
- **Server-Side Validation Engine** (`express-validator`) enforcing strict data constraints.
- **Centralized Error Handling** shielding database passwords, SQL internals, and stack traces from clients.
- **Connection Pooling** with `mysql2/promise` for high throughput and resilient connection management.
- **Multi-Factor Search & Filtering** supporting full name, registration number, email, department, and academic year.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js (v18+) | Server-side JavaScript execution environment |
| **Framework** | Express.js (v4.21) | HTTP routing, middleware pipeline, REST handling |
| **Database** | MySQL 8.4 | Relational persistence, indexing, and unique constraints |
| **DB Driver** | `mysql2` | High-performance MySQL driver with Promise support |
| **Validation** | `express-validator` | Declarative request body and parameter validation rules |
| **CORS** | `cors` | Cross-Origin Resource Sharing for React frontend access |
| **Configuration** | `dotenv` | Environment variable management |
| **Testing** | Postman | End-to-end API testing suite |

---

## 📁 Project Architecture

```text
campusflow-backend/
├── config/
│   └── db.js                       # MySQL connection pool & startup connection probe
├── controllers/
│   └── studentController.js        # Controller handlers for CRUD & health operations
├── database/
│   └── schema.sql                  # Database, table DDL, indexes, and seed records
├── middleware/
│   ├── errorHandler.js             # Centralized error handler & duplicate key interceptor
│   └── notFound.js                 # 404 Route Not Found middleware
├── routes/
│   └── studentRoutes.js            # Express router declarations with attached validators
├── tests/
│   ├── student-api-tests.md        # Comprehensive 12-scenario Postman testing manual
│   └── CampusFlow_Postman_Collection.json # Importable Postman Collection (v2.1)
├── utils/
│   └── response.js                 # Standardized JSON response envelope utilities
├── validators/
│   └── studentValidator.js         # Input validation rules & custom regex formatters
├── .env.example                    # Environment variable template
├── .gitignore                      # Exclusions (node_modules, .env, logs)
├── package.json                    # Package metadata & scripts
├── server.js                       # Application entry point & server bootstrapper
└── README.md                       # Comprehensive documentation
```

---

## 🗄️ MySQL Database Setup

### 1. Database Specifications
- **Database Name:** `campusflow_db`
- **Table Name:** `students`
- **Collation:** `utf8mb4_unicode_ci`

### 2. Table Schema DDL
```sql
CREATE DATABASE IF NOT EXISTS campusflow_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campusflow_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  register_number VARCHAR(25) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year_of_study VARCHAR(30) NOT NULL,
  gender VARCHAR(30) NOT NULL,
  dob DATE NOT NULL,
  address VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Unique Constraints
  CONSTRAINT uq_students_register_number UNIQUE (register_number),
  CONSTRAINT uq_students_email UNIQUE (email),

  -- Performance Indexes
  INDEX idx_students_department (department),
  INDEX idx_students_year_of_study (year_of_study),
  INDEX idx_students_full_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Initialize Database
Open MySQL Workbench or MySQL CLI:
```bash
mysql -u root -p < database/schema.sql
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your credentials inside `.env`:
```env
# Server Port
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=campusflow_db
DB_PORT=3306

# Allowed Frontend Client Origin
CLIENT_ORIGIN=http://localhost:3000
```

> **Security Note:** `.env` is listed in `.gitignore` and must never be committed to GitHub.

---

## 🚀 Running the Server Locally

### 1. Install Dependencies
```bash
cd campusflow-backend
npm install
```

### 2. Start the Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (Auto-reload with nodemon):**
  ```bash
  npm run dev
  ```

Once started, the console will output:
```text
====================================================
🚀 CampusFlow Backend Server running on port 5000
📍 Local URL: http://localhost:5000
🩺 Health check: http://localhost:5000/api/health
🎓 Students endpoint: http://localhost:5000/api/students
====================================================
```

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### 1. System Health Check
- **`GET /health`**
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "CampusFlow API is operational",
  "data": {
    "status": "UP",
    "database": "connected",
    "timestamp": "2026-11-22T08:50:00.000Z",
    "uptimeSeconds": 12,
    "environment": "development"
  }
}
```

---

### 2. Register New Student
- **`POST /students`**
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "full_name": "Pooja Hegde",
  "register_number": "REG-2026-CS99",
  "email": "pooja.hegde@university.edu",
  "phone": "9876501234",
  "department": "Computer Science & Engineering",
  "year_of_study": "1st Year",
  "gender": "Female",
  "dob": "2006-03-25",
  "address": "456 Tech Park Residency, Whitefield, Bangalore"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": 9,
    "full_name": "Pooja Hegde",
    "register_number": "REG-2026-CS99",
    "email": "pooja.hegde@university.edu",
    "phone": "9876501234",
    "department": "Computer Science & Engineering",
    "year_of_study": "1st Year",
    "gender": "Female",
    "dob": "2006-03-25",
    "address": "456 Tech Park Residency, Whitefield, Bangalore",
    "created_at": "2026-11-22T08:50:00.000Z",
    "updated_at": "2026-11-22T08:50:00.000Z"
  }
}
```

---

### 3. Get All Students (with Search & Filtering)
- **`GET /students`**
- **Optional Query Parameters:**
  - `?search=Sharma` (matches full name, register number, or email)
  - `?department=Mechanical Engineering`
  - `?year_of_study=3rd Year`
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [ ... ]
}
```

---

### 4. Get Student by ID
- **`GET /students/:id`**
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Student details retrieved successfully",
  "data": {
    "id": 1,
    "full_name": "Aarav Sharma",
    "register_number": "REG-2024-CS01",
    "email": "aarav.sharma@university.edu",
    "phone": "9876543210",
    "department": "Computer Science & Engineering",
    "year_of_study": "1st Year",
    "gender": "Male",
    "dob": "2006-04-15",
    "address": "42 Silicon Avenue, Sector 4, Bangalore, Karnataka"
  }
}
```
- **Response `404 Not Found` (if ID does not exist):**
```json
{
  "success": false,
  "message": "Student not found with ID: 999999"
}
```

---

### 5. Update Student Record
- **`PUT /students/:id`**
- **Headers:** `Content-Type: application/json`
- **Request Body:** Full updated student details
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Student record updated successfully",
  "data": { ... }
}
```

---

### 6. Delete Student Record
- **`DELETE /students/:id`**
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Student 'Pooja Hegde' deleted successfully",
  "data": {
    "deleted_id": 9,
    "full_name": "Pooja Hegde",
    "register_number": "REG-2026-CS99"
  }
}
```

---

## 🧪 Postman Testing

We have included a complete Postman Collection file in the repository:
📂 `tests/CampusFlow_Postman_Collection.json`

### To Import and Run:
1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Select `tests/CampusFlow_Postman_Collection.json`.
4. Ensure your server is running on `http://localhost:5000`.
5. Run the requests sequentially to verify all 12 scenarios.

For the full scenario manual with expected request and response bodies, consult `tests/student-api-tests.md`.

---

## 🔧 Troubleshooting & Common Errors

| Error Symptom | Cause | Solution |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL server is stopped | Start MySQL service via Windows Services (`services.msc`) or MySQL Workbench |
| `ER_ACCESS_DENIED_ERROR` | Incorrect password in `.env` | Update `DB_PASSWORD` in your `.env` file |
| `ER_BAD_DB_ERROR` | Database not created | Execute `schema.sql` to initialize `campusflow_db` |
| `HTTP 409 Conflict` | Duplicate register number or email | Register numbers and emails must be unique in the university database |
| `HTTP 400 Bad Request` | Missing field or invalid format | Check the `errors` array in the response for field-specific guidance |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
