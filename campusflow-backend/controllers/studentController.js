import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Health Check Controller
 * GET /api/health
 */
export const getHealthCheck = async (req, res, next) => {
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1 AS health_check');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  return sendSuccess(res, 'CampusFlow API is operational', {
    status: 'UP',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
};

/**
 * Retrieve All Students with Optional Search & Filter
 * GET /api/students
 * Query params: ?search=... &department=... &year_of_study=...
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, department, year_of_study } = req.query;

    let querySql = `
      SELECT 
        id, 
        full_name, 
        register_number, 
        email, 
        phone, 
        department, 
        year_of_study, 
        gender, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
        address, 
        created_at, 
        updated_at
      FROM students
    `;

    const whereClauses = [];
    const queryParams = [];

    // Search by full_name, register_number, or email
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push('(full_name LIKE ? OR register_number LIKE ? OR email LIKE ?)');
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by department
    if (department && department.trim()) {
      whereClauses.push('department = ?');
      queryParams.push(department.trim());
    }

    // Filter by year_of_study
    if (year_of_study && year_of_study.trim()) {
      whereClauses.push('year_of_study = ?');
      queryParams.push(year_of_study.trim());
    }

    if (whereClauses.length > 0) {
      querySql += ' WHERE ' + whereClauses.join(' AND ');
    }

    querySql += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await pool.query(querySql, queryParams);

    return sendSuccess(res, 'Students retrieved successfully', rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a Single Student by ID
 * GET /api/students/:id
 */
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const querySql = `
      SELECT 
        id, 
        full_name, 
        register_number, 
        email, 
        phone, 
        department, 
        year_of_study, 
        gender, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
        address, 
        created_at, 
        updated_at
      FROM students
      WHERE id = ?
    `;

    const [rows] = await pool.query(querySql, [id]);

    if (rows.length === 0) {
      return sendError(res, `Student not found with ID: ${id}`, 404);
    }

    return sendSuccess(res, 'Student details retrieved successfully', rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Register a New Student
 * POST /api/students
 */
export const createStudent = async (req, res, next) => {
  try {
    const {
      full_name,
      register_number,
      email,
      phone,
      department,
      year_of_study,
      gender,
      dob,
      address
    } = req.body;

    const normalizedReg = register_number.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check for duplicate register number
    const [existingReg] = await pool.query(
      'SELECT id FROM students WHERE register_number = ?',
      [normalizedReg]
    );
    if (existingReg.length > 0) {
      return sendError(
        res,
        `Register number '${normalizedReg}' is already registered to another student.`,
        409
      );
    }

    // 2. Check for duplicate email
    const [existingEmail] = await pool.query(
      'SELECT id FROM students WHERE email = ?',
      [normalizedEmail]
    );
    if (existingEmail.length > 0) {
      return sendError(
        res,
        `Email address '${normalizedEmail}' is already registered to another student.`,
        409
      );
    }

    // 3. Parameterized INSERT
    const insertSql = `
      INSERT INTO students (
        full_name,
        register_number,
        email,
        phone,
        department,
        year_of_study,
        gender,
        dob,
        address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      full_name.trim(),
      normalizedReg,
      normalizedEmail,
      phone.trim(),
      department.trim(),
      year_of_study.trim(),
      gender.trim(),
      dob,
      address.trim()
    ]);

    // 4. Retrieve the newly created student record
    const [newStudentRows] = await pool.query(
      `SELECT 
        id, 
        full_name, 
        register_number, 
        email, 
        phone, 
        department, 
        year_of_study, 
        gender, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
        address, 
        created_at, 
        updated_at
      FROM students WHERE id = ?`,
      [result.insertId]
    );

    return sendSuccess(
      res,
      'Student registered successfully',
      newStudentRows[0],
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update an Existing Student Record
 * PUT /api/students/:id
 */
export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      register_number,
      email,
      phone,
      department,
      year_of_study,
      gender,
      dob,
      address
    } = req.body;

    // 1. Verify student exists
    const [existingRows] = await pool.query(
      'SELECT id FROM students WHERE id = ?',
      [id]
    );
    if (existingRows.length === 0) {
      return sendError(res, `Cannot update. Student not found with ID: ${id}`, 404);
    }

    const normalizedReg = register_number.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check duplicate register_number against other students
    const [dupRegRows] = await pool.query(
      'SELECT id FROM students WHERE register_number = ? AND id != ?',
      [normalizedReg, id]
    );
    if (dupRegRows.length > 0) {
      return sendError(
        res,
        `Register number '${normalizedReg}' is already assigned to another student.`,
        409
      );
    }

    // 3. Check duplicate email against other students
    const [dupEmailRows] = await pool.query(
      'SELECT id FROM students WHERE email = ? AND id != ?',
      [normalizedEmail, id]
    );
    if (dupEmailRows.length > 0) {
      return sendError(
        res,
        `Email address '${normalizedEmail}' is already registered to another student.`,
        409
      );
    }

    // 4. Parameterized UPDATE
    const updateSql = `
      UPDATE students SET
        full_name = ?,
        register_number = ?,
        email = ?,
        phone = ?,
        department = ?,
        year_of_study = ?,
        gender = ?,
        dob = ?,
        address = ?
      WHERE id = ?
    `;

    await pool.query(updateSql, [
      full_name.trim(),
      normalizedReg,
      normalizedEmail,
      phone.trim(),
      department.trim(),
      year_of_study.trim(),
      gender.trim(),
      dob,
      address.trim(),
      id
    ]);

    // 5. Retrieve updated record
    const [updatedRows] = await pool.query(
      `SELECT 
        id, 
        full_name, 
        register_number, 
        email, 
        phone, 
        department, 
        year_of_study, 
        gender, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
        address, 
        created_at, 
        updated_at
      FROM students WHERE id = ?`,
      [id]
    );

    return sendSuccess(res, 'Student record updated successfully', updatedRows[0], 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Student Record
 * DELETE /api/students/:id
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Verify student exists and capture details for response
    const [studentRows] = await pool.query(
      'SELECT id, full_name, register_number FROM students WHERE id = ?',
      [id]
    );

    if (studentRows.length === 0) {
      return sendError(res, `Cannot delete. Student not found with ID: ${id}`, 404);
    }

    const studentToDelete = studentRows[0];

    // 2. Parameterized DELETE
    await pool.query('DELETE FROM students WHERE id = ?', [id]);

    return sendSuccess(res, `Student '${studentToDelete.full_name}' deleted successfully`, {
      deleted_id: Number(id),
      full_name: studentToDelete.full_name,
      register_number: studentToDelete.register_number
    }, 200);
  } catch (error) {
    next(error);
  }
};
