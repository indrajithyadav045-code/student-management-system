-- =====================================================================
-- CAMPUSFLOW - STUDENT MANAGEMENT SYSTEM
-- MySQL 8.4 Database Schema
-- Database: campusflow_db
-- =====================================================================

-- 1. Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS campusflow_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. Switch to Database
USE campusflow_db;

-- 3. Create Students Table
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

  -- Performance Indexes for search & filtering
  INDEX idx_students_department (department),
  INDEX idx_students_year_of_study (year_of_study),
  INDEX idx_students_full_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Sample Seed Data (Realistic Student Records for Testing)
-- =====================================================================

INSERT INTO students (full_name, register_number, email, phone, department, year_of_study, gender, dob, address)
VALUES 
  ('Aarav Sharma', 'REG-2024-CS01', 'aarav.sharma@university.edu', '9876543210', 'Computer Science & Engineering', '1st Year', 'Male', '2006-04-15', '42 Silicon Avenue, Sector 4, Bangalore, Karnataka'),
  ('Ananya Iyer', 'REG-2023-EC14', 'ananya.iyer@university.edu', '9812345678', 'Electronics & Communication', '2nd Year', 'Female', '2005-08-22', '18 Lakeview Road, Anna Nagar, Chennai, Tamil Nadu'),
  ('Rohan Varma', 'REG-2022-ME08', 'rohan.varma@university.edu', '9765432109', 'Mechanical Engineering', '3rd Year', 'Male', '2004-01-10', '74 Industrial Greens, Shivaji Park, Mumbai, Maharashtra'),
  ('Sneha Patel', 'REG-2021-IT33', 'sneha.patel@university.edu', '9988776655', 'Information Technology', '4th Year', 'Female', '2003-11-05', '105 Heritage Residency, Navrangpura, Ahmedabad, Gujarat'),
  ('Kavya Menon', 'REG-2024-CS19', 'kavya.menon@university.edu', '9823456789', 'Computer Science & Engineering', '1st Year', 'Female', '2006-07-30', '23 Palm Grove, Marine Drive, Kochi, Kerala'),
  ('Vikram Malhotra', 'REG-2024-EE05', 'vikram.m@university.edu', '9845123456', 'Electrical & Electronics', '1st Year', 'Male', '2006-02-18', '12 Defense Colony, South Delhi, New Delhi'),
  ('Meera Deshmukh', 'REG-2023-CV12', 'meera.d@university.edu', '9732165498', 'Civil Engineering', '2nd Year', 'Female', '2005-09-14', '59 Hill View Enclave, Kothrud, Pune, Maharashtra'),
  ('Aditya Roy', 'REG-2022-BA02', 'aditya.roy@university.edu', '9890123456', 'Business Administration', '3rd Year', 'Male', '2004-06-25', '88 Salt Lake City, Sector 5, Kolkata, West Bengal')
ON DUPLICATE KEY UPDATE id=id;
