import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getHealthCheck
} from '../controllers/studentController.js';
import {
  studentRegistrationRules,
  studentUpdateRules,
  studentIdRule,
  studentQueryRules,
  validate
} from '../validators/studentValidator.js';

const router = Router();

// System Health Check
router.get('/health', getHealthCheck);

// Student CRUD Routes
router
  .route('/students')
  .get(studentQueryRules, validate, getAllStudents)
  .post(studentRegistrationRules, validate, createStudent);

router
  .route('/students/:id')
  .get(studentIdRule, validate, getStudentById)
  .put(studentUpdateRules, validate, updateStudent)
  .delete(studentIdRule, validate, deleteStudent);

export default router;
