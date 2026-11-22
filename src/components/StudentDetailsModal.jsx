import React, { useEffect } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Edit3, 
  Clock 
} from 'lucide-react';

export default function StudentDetailsModal({
  isOpen,
  student,
  onClose,
  onEdit
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Provided';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-container"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <User size={20} color="#4f46e5" />
            <span>Student Profile Dossier</span>
          </h2>
          <button 
            type="button" 
            className="btn-ghost btn-icon" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body profile-modal-body">
          {/* Hero Banner with Avatar */}
          <div className="profile-hero">
            <div 
              className="profile-avatar-large" 
              style={{ backgroundColor: student.avatarBg || '#4f46e5' }}
            >
              {getInitials(student.fullName)}
            </div>
            <div className="profile-hero-info">
              <h3>{student.fullName}</h3>
              <div className="reg-tag">
                <span>{student.registerNumber}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge-dept">{student.department}</span>
                <span className="badge badge-year-1">{student.yearOfStudy}</span>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="detail-section">
            <div className="detail-section-title">Academic Record</div>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{student.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Academic Level</span>
                <span className="detail-value">{student.yearOfStudy}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration ID</span>
                <span className="detail-value" style={{ fontFamily: 'monospace' }}>
                  {student.registerNumber}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Enrollment Status</span>
                <span className="detail-value" style={{ color: '#059669', fontWeight: 600 }}>
                  Active • Good Standing
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="detail-section">
            <div className="detail-section-title">Contact & Communication</div>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">University Email</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#64748b" />
                  <span className="detail-value">{student.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#64748b" />
                  <span className="detail-value">{student.phone}</span>
                </div>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Residential Address</span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={14} color="#64748b" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span className="detail-value">{student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="detail-section">
            <div className="detail-section-title">Personal Information</div>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Gender</span>
                <span className="detail-value">{student.gender || 'Not Specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#64748b" />
                  <span className="detail-value">{formatDate(student.dob)}</span>
                </div>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Record Created Timestamp</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#64748b" />
                  <span className="detail-value" style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {student.createdAt ? new Date(student.createdAt).toLocaleString() : 'System Initial Record'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(student);
            }}
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
