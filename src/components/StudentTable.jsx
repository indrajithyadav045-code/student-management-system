import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  UserX
} from 'lucide-react';

export default function StudentTable({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onResetFilters
}) {
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to page 1 when the filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [students.length]);

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);

  // Helper for Year Badge
  const getYearBadgeClass = (year) => {
    if (year?.includes('1st')) return 'badge-year-1';
    if (year?.includes('2nd')) return 'badge-year-2';
    if (year?.includes('3rd')) return 'badge-year-3';
    return 'badge-year-4';
  };

  // Helper for avatar initials
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (students.length === 0) {
    return (
      <div className="card table-card">
        <div className="empty-state">
          <div className="empty-icon-circle">
            <UserX size={36} />
          </div>
          <h3>No Student Records Found</h3>
          <p>
            No records matched your search query or filter criteria. Try adjusting your search term or clearing the active filters.
          </p>
          {onResetFilters && (
            <button className="btn btn-secondary" onClick={onResetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('fullName')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Student Name</span>
                  {renderSortIcon('fullName')}
                </div>
              </th>
              <th className="sortable" onClick={() => handleSort('registerNumber')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Register No.</span>
                  {renderSortIcon('registerNumber')}
                </div>
              </th>
              <th>Contact Details</th>
              <th className="sortable" onClick={() => handleSort('department')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Department</span>
                  {renderSortIcon('department')}
                </div>
              </th>
              <th className="sortable" onClick={() => handleSort('yearOfStudy')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Academic Year</span>
                  {renderSortIcon('yearOfStudy')}
                </div>
              </th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-name-cell">
                    <div 
                      className="table-avatar" 
                      style={{ backgroundColor: student.avatarBg || '#4f46e5' }}
                    >
                      {getInitials(student.fullName)}
                    </div>
                    <div className="student-name-meta">
                      <span className="name">{student.fullName}</span>
                      <span className="subtext">{student.gender} • {student.dob || 'DOB N/A'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="reg-number-cell">{student.registerNumber}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                      <Mail size={13} style={{ color: '#94a3b8' }} />
                      <span>{student.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                      <Phone size={13} style={{ color: '#94a3b8' }} />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-dept">{student.department}</span>
                </td>
                <td>
                  <span className={`badge ${getYearBadgeClass(student.yearOfStudy)}`}>
                    {student.yearOfStudy}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="action-btn view"
                      onClick={() => onViewStudent(student)}
                      title="View Student Profile"
                      aria-label={`View details for ${student.fullName}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => onEditStudent(student)}
                      title="Edit Student Record"
                      aria-label={`Edit ${student.fullName}`}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => onDeleteStudent(student)}
                      title="Delete Student Record"
                      aria-label={`Delete ${student.fullName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="table-footer">
        <div>
          Showing page <strong>{validCurrentPage}</strong> of <strong>{totalPages}</strong> ({sortedStudents.length} items)
        </div>
        
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={validCurrentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${page === validCurrentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
