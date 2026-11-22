/**
 * Email format validator (RFC5322-compliant pattern)
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Phone number validator:
 * - Accepts 10-digit Indian mobile numbers (e.g. 9876543210, starting with 6, 7, 8, or 9, or standard 10 digits)
 * - Supports international numbers with a leading + (e.g. +91 9876543210, +1 555-123-4567, with 10 to 15 digits)
 * - Rejects non-numeric characters (aside from allowed formatting spaces, dashes, parentheses, and leading +)
 * - Rejects numbers that are too short or too long
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();

  // International format with leading +: must have + followed by 10 to 15 digits
  if (trimmed.startsWith('+')) {
    const digitsOnly = trimmed.slice(1).replace(/[\s\-()]/g, '');
    // Ensure all characters after + are digits and within 10-15 digits
    return /^[0-9]{10,15}$/.test(digitsOnly);
  }

  // Standard domestic format (e.g. Indian 10-digit mobile number)
  const digitsOnly = trimmed.replace(/[\s\-()]/g, '');
  // Disallow any unexpected alpha or special characters
  if (!/^[0-9]+$/.test(digitsOnly)) {
    return false;
  }

  // Must be strictly 10 digits
  return /^[6-9][0-9]{9}$/.test(digitsOnly) || /^[0-9]{10}$/.test(digitsOnly);
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

  // 1. Full Name
  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else {
    const trimmedName = formData.fullName.trim();
    if (trimmedName.length < 3) {
      errors.fullName = 'Name must be at least 3 characters long';
    } else if (trimmedName.length > 80) {
      errors.fullName = 'Name cannot exceed 80 characters';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.fullName = 'Name can only contain alphabetic letters and spaces';
    }
  }

  // 2. Register Number
  if (!formData.registerNumber || !formData.registerNumber.trim()) {
    errors.registerNumber = 'Register Number is required';
  } else {
    const regNormalized = formData.registerNumber.trim().toUpperCase();
    if (regNormalized.length < 3) {
      errors.registerNumber = 'Register Number must be at least 3 characters';
    } else if (regNormalized.length > 25) {
      errors.registerNumber = 'Register Number cannot exceed 25 characters';
    } else {
      // Uniqueness check: ignore the record currently being edited
      const isDuplicate = existingStudents.some(
        (s) => s.id !== currentStudentId && s.registerNumber?.trim().toUpperCase() === regNormalized
      );
      if (isDuplicate) {
        errors.registerNumber = 'This Register Number is already assigned to another student';
      }
    }
  }

  // 3. Email Address
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email Address is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address (e.g. name@university.edu)';
  } else {
    // Uniqueness check: ignore the record currently being edited
    const emailNormalized = formData.email.trim().toLowerCase();
    const isEmailDuplicate = existingStudents.some(
      (s) => s.id !== currentStudentId && s.email?.trim().toLowerCase() === emailNormalized
    );
    if (isEmailDuplicate) {
      errors.email = 'This email is already registered to another student';
    }
  }

  // 4. Phone Number
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone Number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number or international number with +';
  }

  // 5. Department
  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Please select an academic department';
  }

  // 6. Year of Study
  if (!formData.yearOfStudy || !formData.yearOfStudy.trim()) {
    errors.yearOfStudy = 'Please select current year of study';
  }

  // 7. Gender
  if (!formData.gender || !formData.gender.trim()) {
    errors.gender = 'Please select a gender option';
  }

  // 8. Date of Birth
  if (!formData.dob || !formData.dob.trim()) {
    errors.dob = 'Date of birth is required';
  } else {
    const parts = formData.dob.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const dobDate = new Date(formData.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(dobDate.getTime()) || parts.length !== 3 || isNaN(year) || isNaN(month) || isNaN(day)) {
      errors.dob = 'Please enter a valid calendar date';
    } else if (dobDate >= today) {
      errors.dob = 'Date of birth cannot be today or in the future';
    } else if (year < 1920) {
      errors.dob = 'Please enter a realistic birth year';
    } else {
      // Calculate exact age in years
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 15) {
        errors.dob = 'Student must be at least 15 years old for university enrollment';
      } else if (age > 85) {
        errors.dob = 'Please enter a valid date of birth';
      }
    }
  }

  // 9. Residential Address
  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Residential address is required';
  } else if (formData.address.trim().length < 8) {
    errors.address = 'Please provide a complete address (minimum 8 characters)';
  } else if (formData.address.trim().length > 300) {
    errors.address = 'Address cannot exceed 300 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
