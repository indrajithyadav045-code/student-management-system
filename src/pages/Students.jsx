import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Download, 
  Users, 
  Sparkles, 
  Filter 
} from 'lucide-react';
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

  // Export to CSV function (Working SaaS functionality)
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      'Register Number',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Year of Study',
      'Gender',
      'Date of Birth',
      'Address',
      'Registration Date'
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.registerNumber || ''}"`,
      `"${s.fullName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.department || ''}"`,
      `"${s.yearOfStudy || ''}"`,
      `"${s.gender || ''}"`,
      `"${s.dob || ''}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${s.createdAt ? new Date(s.createdAt).toISOString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
