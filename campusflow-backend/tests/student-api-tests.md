# CampusFlow REST API — Complete Postman Testing Guide

This guide details all 12 API test scenarios required to verify the **CampusFlow Student Management REST API**.

**Base URL:** `http://localhost:5000/api`  
**Headers for all POST / PUT requests:**  
`Content-Type: application/json`

---

## Test Suite Overview

| # | Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| 1 | Server Liveness Check | `GET` | `/health` | `200 OK` |
| 2 | Database Readiness Check | `GET` | `/ready` | `200 OK` (or `503` if DB down) |
| 3 | Register a New Student | `POST` | `/students` | `201 Created` |
| 4 | Retrieve All Students | `GET` | `/students` | `200 OK` |
| 5 | Retrieve a Student by ID | `GET` | `/students/:id` | `200 OK` |
| 6 | Search Students (Query) | `GET` | `/students?search=Sharma` | `200 OK` |
| 7 | Filter by Department | `GET` | `/students?department=Computer Science %26 Engineering` | `200 OK` |
| 8 | Update Student Details | `PUT` | `/students/:id` | `200 OK` |
| 9 | Delete a Student Record | `DELETE` | `/students/:id` | `200 OK` |
| 10 | Test Duplicate Register Number | `POST` | `/students` | `409 Conflict` |
| 11 | Test Invalid Email Format | `POST` | `/students` | `400 Bad Request` |
| 12 | Test Missing Required Fields | `POST` | `/students` | `400 Bad Request` |
| 13 | Test Non-Existent Student ID | `GET` | `/students/999999` | `404 Not Found` |

---

## Detailed Test Cases

### 1. Server Liveness Check
Verify Express web server is alive and accepting requests.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "CampusFlow API server is alive",
  "data": {
    "status": "UP",
    "timestamp": "2026-11-22T08:50:00.000Z",
    "uptimeSeconds": 42,
    "environment": "development"
  }
}
```

---

### 2. Database Readiness Check
Verify MySQL connectivity and active database access.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/ready`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK` (when MySQL is running) or `503 Service Unavailable` (when MySQL is stopped)
- **Expected Response (when connected):**
```json
{
  "success": true,
  "message": "Database connection is healthy and ready",
  "data": {
    "status": "READY",
    "database": "connected",
    "timestamp": "2026-11-22T08:50:00.000Z"
  }
}
```
- **Expected Response (when MySQL is stopped):**
```json
{
  "success": false,
  "message": "Database is unavailable. Please verify MySQL service is running.",
  "data": {
    "status": "NOT_READY",
    "database": "disconnected",
    "error_code": "ECONNREFUSED",
    "timestamp": "2026-11-22T08:50:00.000Z"
  }
}
```

---

### 2. Register a New Student
Register a valid student record.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/students`
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
- **Expected Status:** `201 Created`
- **Expected Response:**
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

### 3. Retrieve All Students
Fetch all registered student records.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
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
  ]
}
```

---

### 4. Retrieve a Student by ID
Fetch details of a single student by primary key.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students/1`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
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
    "address": "42 Silicon Avenue, Sector 4, Bangalore, Karnataka",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### 5. Search Students by Query
Search across student full name, register number, or email.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students?search=Sharma`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 1,
      "full_name": "Aarav Sharma",
      "register_number": "REG-2024-CS01",
      "email": "aarav.sharma@university.edu",
      "phone": "9876543210",
      "department": "Computer Science & Engineering"
    }
  ]
}
```

---

### 6. Filter by Department
Filter student records by academic department.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students?department=Information%20Technology`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 4,
      "full_name": "Sneha Patel",
      "register_number": "REG-2021-IT33",
      "email": "sneha.patel@university.edu",
      "department": "Information Technology"
    }
  ]
}
```

---

### 7. Update Student Details
Update existing student information.

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/students/1`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "full_name": "Aarav Sharma",
  "register_number": "REG-2024-CS01",
  "email": "aarav.sharma@university.edu",
  "phone": "9876549999",
  "department": "Computer Science & Engineering",
  "year_of_study": "2nd Year",
  "gender": "Male",
  "dob": "2006-04-15",
  "address": "Updated Address, Silicon Valley, Sector 7, Bangalore"
}
```
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Student record updated successfully",
  "data": {
    "id": 1,
    "full_name": "Aarav Sharma",
    "register_number": "REG-2024-CS01",
    "year_of_study": "2nd Year",
    "phone": "9876549999",
    "address": "Updated Address, Silicon Valley, Sector 7, Bangalore"
  }
}
```

---

### 8. Delete a Student Record
Remove a student by ID.

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/students/9`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
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

### 9. Test Duplicate Register Number
Attempt to register with an existing register number.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/students`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "full_name": "Duplicate Tester",
  "register_number": "REG-2024-CS01",
  "email": "unique.email@university.edu",
  "phone": "9876543210",
  "department": "Mechanical Engineering",
  "year_of_study": "1st Year",
  "gender": "Male",
  "dob": "2005-01-01",
  "address": "Campus Hostel Room 101"
}
```
- **Expected Status:** `409 Conflict`
- **Expected Response:**
```json
{
  "success": false,
  "message": "Register number 'REG-2024-CS01' is already registered to another student."
}
```

---

### 10. Test Invalid Email Format
Attempt to register with an improperly formatted email address.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/students`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "full_name": "Test Student",
  "register_number": "REG-TEST-01",
  "email": "not-an-email",
  "phone": "9876543210",
  "department": "Civil Engineering",
  "year_of_study": "1st Year",
  "gender": "Male",
  "dob": "2005-01-01",
  "address": "Campus Hostel Room 102"
}
```
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address (e.g. student@university.edu)",
      "value": "not-an-email"
    }
  ]
}
```

---

### 11. Test Missing Required Fields
Attempt to register with empty fields.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/students`
- **Headers:** `Content-Type: application/json`
- **Request Body:** `{}`
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": [
    { "field": "full_name", "message": "Full Name is required" },
    { "field": "register_number", "message": "Register Number is required" },
    { "field": "email", "message": "Email Address is required" },
    { "field": "phone", "message": "Phone Number is required" },
    { "field": "department", "message": "Department is required" },
    { "field": "year_of_study", "message": "Year of Study is required" },
    { "field": "gender", "message": "Gender is required" },
    { "field": "dob", "message": "Date of Birth is required" },
    { "field": "address", "message": "Residential Address is required" }
  ]
}
```

---

### 12. Test Non-Existent Student ID
Attempt to retrieve a student with an ID that does not exist in the database.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students/999999`
- **Headers:** None
- **Body:** None
- **Expected Status:** `404 Not Found`
- **Expected Response:**
```json
{
  "success": false,
  "message": "Student not found with ID: 999999"
}
```
