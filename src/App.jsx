import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

import { INITIAL_STUDENTS } from './data/initialStudents';
import { getStoredStudents, saveStoredStudents } from './utils/storage';

// CSS imports
import './styles/global.css';
import './styles/sidebar.css';
import './styles/header.css';
import './styles/dashboard.css';
import './styles/students.css';

const AVATAR_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
  '#6366f1'
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Student Records State (Persistent with LocalStorage)
  const [students, setStudents] = useState(() => {
    return getStoredStudents(INITIAL_STUDENTS);
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // Sync to LocalStorage on students state change
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  // Toast Helpers
  const addToast = (type, title, message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message, duration: 4000 }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD Operations

  // 1. Create Student
  const handleOpenRegisterModal = () => {
    setFormMode('create');
    setSelectedStudentForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleCreateStudent = (formData) => {
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newStudent = {
      ...formData,
      id: `std-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarBg: randomColor
    };

    setStudents((prev) => [newStudent, ...prev]);
    setIsFormModalOpen(false);
    addToast(
      'success',
      'Registration Completed',
      `${newStudent.fullName} (${newStudent.registerNumber}) registered successfully!`
    );
  };

  // 2. Edit Student
  const handleOpenEditModal = (student) => {
    setFormMode('edit');
    setSelectedStudentForEdit(student);
    setIsFormModalOpen(true);
  };

  const handleUpdateStudent = (formData) => {
    if (!selectedStudentForEdit) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudentForEdit.id
          ? {
              ...s,
              ...formData,
              id: s.id,
              createdAt: s.createdAt,
              avatarBg: s.avatarBg || AVATAR_COLORS[0]
            }
          : s
      )
    );

    setIsFormModalOpen(false);
    setSelectedStudentForEdit(null);

    // If view modal was open for this student, update view as well
    if (selectedStudentForView && selectedStudentForView.id === selectedStudentForEdit.id) {
      setSelectedStudentForView({
        ...selectedStudentForView,
        ...formData
      });
    }

    addToast(
      'success',
      'Record Updated',
      `Student record for ${formData.fullName} updated successfully.`
    );
  };

  // 3. View Student Profile
  const handleViewStudent = (student) => {
    setSelectedStudentForView(student);
  };

  // 4. Delete Student
  const handlePromptDelete = (student) => {
    setSelectedStudentForDelete(student);
  };

  const handleConfirmDelete = (studentId) => {
    const studentToDelete = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setSelectedStudentForDelete(null);

    // If currently viewing deleted student, close view modal
    if (selectedStudentForView && selectedStudentForView.id === studentId) {
      setSelectedStudentForView(null);
    }

    addToast(
      'info',
      'Record Deleted',
      `${studentToDelete ? studentToDelete.fullName : 'Student'} has been removed from university records.`
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterModal={handleOpenRegisterModal}
        studentCount={students.length}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Layout */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          studentCount={students.length}
        />

        <main className="content-area">
          {activeTab === 'dashboard' ? (
            <Dashboard
              students={students}
              onNavigateToStudents={() => setActiveTab('students')}
              onOpenRegisterModal={handleOpenRegisterModal}
              onViewStudent={handleViewStudent}
            />
          ) : (
            <Students
              students={students}
              onOpenRegisterModal={handleOpenRegisterModal}
              onViewStudent={handleViewStudent}
              onEditStudent={handleOpenEditModal}
              onDeleteStudent={handlePromptDelete}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}

      {/* Register & Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={selectedStudentForEdit}
        existingStudents={students}
        onSubmit={formMode === 'create' ? handleCreateStudent : handleUpdateStudent}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedStudentForEdit(null);
        }}
      />

      {/* View Student Profile Modal */}
      <StudentDetailsModal
        isOpen={Boolean(selectedStudentForView)}
        student={selectedStudentForView}
        onClose={() => setSelectedStudentForView(null)}
        onEdit={(student) => {
          setSelectedStudentForView(null);
          handleOpenEditModal(student);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedStudentForDelete)}
        student={selectedStudentForDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedStudentForDelete(null)}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
