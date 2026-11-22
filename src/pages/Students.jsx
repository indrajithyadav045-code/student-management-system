import React, { useState, useMemo } from 'react';
import { UserPlus, Download } from 'lucide-react';
import SearchFilter from '../components/SearchFilter';
import StudentTable from '../components/StudentTable';

export default function Students({
  students,
  onOpenRegisterModal,
  onViewStudent,
  onEditStudent,
  onDeleteStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search term match (Name, Register Number, or Email)
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchesName = student.fullName?.toLowerCase().includes(query);
        const matchesReg = student.registerNumber?.toLowerCase().includes(query);
        const matchesEmail = student.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesReg && !matchesEmail) {
          return false;
        }
      }

      // 2. Department filter
      if (selectedDept && student.department !== selectedDept) {
        return false;
      }

      // 3. Year of study filter
      if (selectedYear && student.yearOfStudy !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedDept, selectedYear]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedYear('');
  };

  // Improved CSV Export Function with proper escaping, BOM, and Blob download
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      'Register Number',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Department',
      'Year of Study',
      'Gender',
      'Date of Birth',
      'Permanent Address',
      'Registration Date'
    ];

    const escapeCSVCell = (val) => {
      if (val === null || val === undefined) return '""';
      // Double up any quotes and wrap in quotes
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredStudents.map((s) => [
      escapeCSVCell(s.registerNumber),
      escapeCSVCell(s.fullName),
      escapeCSVCell(s.email),
      escapeCSVCell(s.phone),
      escapeCSVCell(s.department),
      escapeCSVCell(s.yearOfStudy),
      escapeCSVCell(s.gender),
      escapeCSVCell(s.dob),
      escapeCSVCell(s.address),
      escapeCSVCell(s.createdAt ? new Date(s.createdAt).toISOString() : '')
    ]);

    // Prepend UTF-8 BOM (\uFEFF) to guarantee Excel/spreadsheet compatibility
    const csvContent = '\uFEFF' + [
      headers.join(','), 
      ...rows.map((row) => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Meaningful filename containing the current date
    const todayStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `students_directory_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="students-page">
      {/* Page Header */}
      <div className="page-title-bar">
        <div>
          <h1>Student Directory</h1>
          <p>
            Manage active admissions, browse departmental records, update student details, and verify credentials.
          </p>
        </div>

        <div className="header-action-group">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
            disabled={filteredStudents.length === 0}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onOpenRegisterModal}
          >
            <UserPlus size={16} />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onResetFilters={handleResetFilters}
        totalResults={filteredStudents.length}
        totalStudents={students.length}
      />

      {/* Students Data Table */}
      <StudentTable
        students={filteredStudents}
        onViewStudent={onViewStudent}
        onEditStudent={onEditStudent}
        onDeleteStudent={onDeleteStudent}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
