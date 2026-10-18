/**
 * registrationValidator.js
 *
 * Centralized, pure validation logic for user registration.
 * Extracts business rules away from presentation components to ensure
 * clean SRP (Single Responsibility Principle) and 100% unit-testability.
 */

/**
 * Validates password criteria: Elder-friendly rules:
 * - Minimum 8 characters
 * - At least one letter (a-z, A-Z)
 * - At least one number (0-9)
 * - No special symbol required
 *
 * @param {string} pwd
 * @returns {{ hasLength: boolean, hasLetter: boolean, hasNumber: boolean }}
 */
export const checkPasswordCriteria = (pwd = '') => {
  const val = String(pwd || '');
  return {
    hasLength: val.length >= 8,
    hasLetter: /[a-zA-Z]/.test(val),
    hasNumber: /[0-9]/.test(val),
  };
};

/**
 * Calculates a 0-3 password strength score based on satisfied criteria.
 * @param {string} pwd
 * @returns {number} 0, 1, 2, or 3
 */
export const calculatePasswordStrength = (pwd = '') => {
  if (!pwd) return 0;
  const criteria = checkPasswordCriteria(pwd);
  let score = 0;
  if (criteria.hasLength) score++;
  if (criteria.hasLetter) score++;
  if (criteria.hasNumber) score++;
  return score;
};

/**
 * Validates an uploaded verification image file.
 * Must be JPG, JPEG, PNG, or WebP and <= 5MB.
 *
 * @param {File|Blob|null} file
 * @param {string} label
 * @returns {string|null} Error message or null if valid
 */
export const validateImageFile = (file, label = 'Image') => {
  if (!file) return null;
  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const validExts = ['jpg', 'jpeg', 'png', 'webp'];
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const isExtValid = validExts.includes(ext);
  const isMimeValid = !file.type || validMimes.includes(file.type.toLowerCase()) || file.type.startsWith('image/');

  if (!isExtValid || !isMimeValid) {
    return `Please upload a valid image file for ${label} (JPG, JPEG, PNG, or WebP only).`;
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return `${label} image size must not exceed 5MB.`;
  }

  return null;
};

/**
 * Validates the full registration form.
 * Returns an object containing field error messages keyed by field name.
 * If empty, form is 100% valid.
 *
 * @param {Object} form
 * @param {Object} options
 * @param {File|null} options.idCardFile
 * @param {File|null} options.idSelfieFile
 * @param {boolean} options.hasAgreedToDisclaimer
 * @returns {Record<string, string>}
 */
export const validateRegistrationForm = (form = {}, options = {}) => {
  const errors = {};
  const { idCardFile, idSelfieFile, hasAgreedToDisclaimer } = options;

  // 1. Role & Affiliation
  if (form.role === 'student') {
    if (!form.student_type) {
      errors.student_type = 'Please select RSO or SSG.';
    }
    const org = String(form.organization_name || '').trim();
    if (!org) {
      errors.organization_name = form.student_type === 'rso'
        ? 'Organization name is required.'
        : 'Officer position is required.';
    } else if (org.length < 2) {
      errors.organization_name = 'Must be at least 2 characters.';
    }
    if (!form.college) {
      errors.college = 'Please select your college.';
    }
  } else if (form.role === 'employee') {
    if (!form.employee_type) {
      errors.employee_type = 'Please select your staff classification.';
    } else if (!form.college) {
      errors.college = form.employee_type === 'Teaching Staff'
        ? 'Please select your assigned college.'
        : form.employee_type === 'Research and Extension Staff'
        ? 'Please select your assigned center.'
        : 'Please select your assigned building.';
    }
  }

  // 2. Personal Info
  const fn = String(form.first_name || '').trim();
  if (!fn) {
    errors.first_name = 'First name is required.';
  } else if (fn.length < 2 || !/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(fn) || !/[a-zA-ZÀ-ÿ]/.test(fn)) {
    errors.first_name = 'Must be at least 2 characters (letters only).';
  }

  const ln = String(form.last_name || '').trim();
  if (!ln) {
    errors.last_name = 'Last name is required.';
  } else if (ln.length < 2 || !/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(ln) || !/[a-zA-ZÀ-ÿ]/.test(ln)) {
    errors.last_name = 'Must be at least 2 characters (letters only).';
  }

  const idNum = String(form.student_id_number || '').trim();
  if (!idNum) {
    errors.student_id_number = form.role === 'student'
      ? 'Student ID number is required.'
      : 'Employee ID number is required.';
  } else if (form.role === 'student') {
    if (!/^\d{7}$/.test(idNum)) {
      errors.student_id_number = 'Must be exactly 7 digits.';
    }
  } else {
    if (!/^[A-Za-z0-9\-]{4,15}$/.test(idNum)) {
      errors.student_id_number = '4–15 alphanumeric characters.';
    }
  }

  const contact = String(form.contact_number || '').trim();
  if (!contact) {
    errors.contact_number = 'Contact number is required.';
  } else if (!contact.startsWith('09')) {
    errors.contact_number = 'Must start with 09.';
  } else if (!/^09\d{9}$/.test(contact)) {
    errors.contact_number = 'Must be exactly 11 digits.';
  }

  const em = String(form.email || '').trim();
  if (!em) {
    errors.email = 'Email address is required.';
  } else {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(em)) {
      errors.email = 'Please enter a valid email format (e.g. name@bsu.edu.ph).';
    }
  }

  // 3. Password
  const pwd = form.password || '';
  if (!pwd) {
    errors.password = 'Password is required.';
  } else if (pwd.length < 8) {
    errors.password = 'Must be at least 8 characters.';
  } else if (!/[a-zA-Z]/.test(pwd)) {
    errors.password = 'Must include at least one letter.';
  } else if (!/[0-9]/.test(pwd)) {
    errors.password = 'Must include at least one number.';
  }

  if (!form.password_confirm) {
    errors.password_confirm = 'Please confirm your password.';
  } else if (form.password !== form.password_confirm) {
    errors.password_confirm = 'Passwords do not match.';
  }

  // 4. Verification Files & Terms
  if (!idCardFile) {
    errors.id_card = 'Front ID photo is required.';
  }
  if (!idSelfieFile) {
    errors.id_selfie = 'Selfie with ID is required.';
  }
  if (!hasAgreedToDisclaimer) {
    errors.disclaimer = 'You must agree to the Data Privacy Notice & Terms of Use.';
  }

  return errors;
};
