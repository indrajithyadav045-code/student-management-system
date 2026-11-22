/**
 * Email format validator
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Phone number validator (supports 10-digit Indian/US numbers and international with +)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Standard phone check: optional leading +, then 10 to 14 digits
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validates the student registration/edit form
 * @param {Object} formData 
 * @param {Array} existingStudents 
 * @param {string|null} currentStudentId - if editing, exclude current student from uniqueness check
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateStudentForm = (formData, existingStudents = [], currentStudentId = null) => {
  const errors = {};

  // Full Name
  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = 'Name must be at least 3 characters long';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
    errors.fullName = 'Name can only contain alphabets and basic punctuation';
  }

  // Register Number
  if (!formData.registerNumber || !formData.registerNumber.trim()) {
    errors.registerNumber = 'Register Number is required';
  } else {
    const regNormalized = formData.registerNumber.trim().toUpperCase();
    if (regNormalized.length < 4) {
      errors.registerNumber = 'Register Number must be at least 4 characters';
    } else {
      // Uniqueness check
      const isDuplicate = existingStudents.some(
        (s) => s.id !== currentStudentId && s.registerNumber?.trim().toUpperCase() === regNormalized
      );
      if (isDuplicate) {
        errors.registerNumber = 'This Register Number is already assigned to another student';
      }
    }
  }

  // Email Address
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email Address is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address (e.g. student@university.edu)';
  } else {
    // Check if email already used by another student
    const emailNormalized = formData.email.trim().toLowerCase();
    const isEmailDuplicate = existingStudents.some(
      (s) => s.id !== currentStudentId && s.email?.trim().toLowerCase() === emailNormalized
    );
    if (isEmailDuplicate) {
      errors.email = 'This email is already registered';
    }
  }

  // Phone Number
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone Number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (10 digits)';
  }

  // Department
  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Please select an academic department';
  }

  // Year of Study
  if (!formData.yearOfStudy || !formData.yearOfStudy.trim()) {
    errors.yearOfStudy = 'Please select current year of study';
  }

  // Gender
  if (!formData.gender || !formData.gender.trim()) {
    errors.gender = 'Please select a gender option';
  }

  // Date of Birth
  if (!formData.dob || !formData.dob.trim()) {
    errors.dob = 'Date of birth is required';
  } else {
    const dobDate = new Date(formData.dob);
    const today = new Date();
    if (isNaN(dobDate.getTime())) {
      errors.dob = 'Please enter a valid date';
    } else if (dobDate >= today) {
      errors.dob = 'Date of birth must be in the past';
    } else {
      // Age check: reasonable university student age (15 to 70)
      const ageDiffMs = today.getTime() - dobDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (calculatedAge < 15) {
        errors.dob = 'Student must be at least 15 years old';
      }
    }
  }

  // Address
  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Residential address is required';
  } else if (formData.address.trim().length < 8) {
    errors.address = 'Please provide a complete address (at least 8 characters)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
