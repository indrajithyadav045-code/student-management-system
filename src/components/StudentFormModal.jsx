import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  Edit3, 
  GraduationCap 
} from 'lucide-react';
import { DEPARTMENTS, YEARS_OF_STUDY, GENDERS } from '../data/initialStudents';
import { validateStudentForm } from '../utils/validators';

const initialFormData = {
  fullName: '',
  registerNumber: '',
  email: '',
  phone: '',
  department: '',
  yearOfStudy: '',
  gender: '',
  dob: '',
  address: ''
};

export default function StudentFormModal({
  isOpen,
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  existingStudents = [],
  onSubmit,
  onClose
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          fullName: initialData.fullName || '',
          registerNumber: initialData.registerNumber || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          department: initialData.department || '',
          yearOfStudy: initialData.yearOfStudy || '',
          gender: initialData.gender || '',
          dob: initialData.dob || '',
          address: initialData.address || ''
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, mode, initialData]);

  // Keyboard accessibility (Escape key to dismiss)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Validate individual field and update error state
    const validation = validateStudentForm(
      formData,
      existingStudents,
      mode === 'edit' ? initialData?.id : null
    );
    setErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field] || null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validation = validateStudentForm(
      formData,
      existingStudents,
      mode === 'edit' ? initialData?.id : null
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit payload
    onSubmit({
      ...formData,
      fullName: formData.fullName.trim(),
      registerNumber: formData.registerNumber.trim().toUpperCase(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    });
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-container"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>
            {isEdit ? <Edit3 size={22} color="#0284c7" /> : <GraduationCap size={22} color="#4f46e5" />}
            <span>{isEdit ? 'Update Student Record' : 'Register New Student'}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className={`form-control ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  autoFocus
                />
                {touched.fullName && errors.fullName && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Register Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="registerNumber">
                  Register Number <span className="required-star">*</span>
                </label>
                <input
                  id="registerNumber"
                  name="registerNumber"
                  type="text"
                  placeholder="e.g. REG-2024-CS01"
                  className={`form-control ${touched.registerNumber && errors.registerNumber ? 'is-invalid' : ''}`}
                  value={formData.registerNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur('registerNumber')}
                />
                {touched.registerNumber && errors.registerNumber && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.registerNumber}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. student@university.edu"
                  className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && errors.email && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                />
                {touched.phone && errors.phone && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required-star">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className={`form-control ${touched.department && errors.department ? 'is-invalid' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={() => handleBlur('department')}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {touched.department && errors.department && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.department}</span>
                  </div>
                )}
              </div>

              {/* Year of Study */}
              <div className="form-group">
                <label className="form-label" htmlFor="yearOfStudy">
                  Year of Study <span className="required-star">*</span>
                </label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  className={`form-control ${touched.yearOfStudy && errors.yearOfStudy ? 'is-invalid' : ''}`}
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  onBlur={() => handleBlur('yearOfStudy')}
                >
                  <option value="">Select Year</option>
                  {YEARS_OF_STUDY.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {touched.yearOfStudy && errors.yearOfStudy && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.yearOfStudy}</span>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender <span className="required-star">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-control ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={() => handleBlur('gender')}
                >
                  <option value="">Select Gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {touched.gender && errors.gender && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.gender}</span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label className="form-label" htmlFor="dob">
                  Date of Birth <span className="required-star">*</span>
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  className={`form-control ${touched.dob && errors.dob ? 'is-invalid' : ''}`}
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={() => handleBlur('dob')}
                />
                {touched.dob && errors.dob && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.dob}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="address">
                  Permanent Address <span className="required-star">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="2"
                  placeholder="Street address, city, state, zip code"
                  className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                />
                {touched.address && errors.address && (
                  <div className="error-message">
                    <AlertCircle size={13} />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{isEdit ? 'Update Student Record' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
