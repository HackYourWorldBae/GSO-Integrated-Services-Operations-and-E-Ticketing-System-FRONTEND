import { describe, it, expect } from 'vitest';
import {
  checkPasswordCriteria,
  calculatePasswordStrength,
  validateImageFile,
  validateRegistrationForm,
} from '../registrationValidator';

describe('registrationValidator', () => {
  describe('checkPasswordCriteria & calculatePasswordStrength', () => {
    it('evaluates length, capital letters, small letters, and numbers correctly', () => {
      const empty = checkPasswordCriteria('');
      expect(empty.hasLength).toBe(false);
      expect(empty.hasUppercase).toBe(false);
      expect(empty.hasLowercase).toBe(false);
      expect(empty.hasNumber).toBe(false);
      expect(calculatePasswordStrength('')).toBe(0);

      const shortOnlySmallAndNum = checkPasswordCriteria('a1');
      expect(shortOnlySmallAndNum.hasLength).toBe(false);
      expect(shortOnlySmallAndNum.hasUppercase).toBe(false);
      expect(shortOnlySmallAndNum.hasLowercase).toBe(true);
      expect(shortOnlySmallAndNum.hasNumber).toBe(true);
      expect(calculatePasswordStrength('a1')).toBe(2);

      const withCapitalSmallAndNumShort = checkPasswordCriteria('Aa1');
      expect(withCapitalSmallAndNumShort.hasLength).toBe(false);
      expect(withCapitalSmallAndNumShort.hasUppercase).toBe(true);
      expect(withCapitalSmallAndNumShort.hasLowercase).toBe(true);
      expect(withCapitalSmallAndNumShort.hasNumber).toBe(true);
      expect(calculatePasswordStrength('Aa1')).toBe(3);

      const valid = checkPasswordCriteria('Pass1234');
      expect(valid.hasLength).toBe(true);
      expect(valid.hasUppercase).toBe(true);
      expect(valid.hasLowercase).toBe(true);
      expect(valid.hasNumber).toBe(true);
      expect(calculatePasswordStrength('Pass1234')).toBe(4);
    });
  });

  describe('validateImageFile', () => {
    it('accepts valid jpg, jpeg, png, webp <= 5MB', () => {
      const file = { name: 'photo.jpg', type: 'image/jpeg', size: 1024 * 1024 };
      expect(validateImageFile(file, 'ID')).toBeNull();
    });

    it('rejects files with invalid extensions or MIME types', () => {
      const pdf = { name: 'document.pdf', type: 'application/pdf', size: 1024 };
      expect(validateImageFile(pdf, 'Front ID')).toContain('JPG, JPEG, PNG, or WebP only');
    });

    it('rejects files exceeding 5MB', () => {
      const large = { name: 'huge.png', type: 'image/png', size: 6 * 1024 * 1024 };
      expect(validateImageFile(large, 'Selfie')).toContain('must not exceed 5MB');
    });
  });

  describe('validateRegistrationForm', () => {
    const validStudentForm = {
      role: 'student',
      student_type: 'rso',
      organization_name: 'CS Guild',
      college: 'College of Information Sciences',
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      student_id_number: '2023001',
      contact_number: '09123456789',
      email: 'juan@bsu.edu.ph',
      password: 'Password123',
      password_confirm: 'Password123',
    };

    const validOptions = {
      idCardFile: { name: 'id.jpg', type: 'image/jpeg', size: 5000 },
      idSelfieFile: { name: 'selfie.png', type: 'image/png', size: 5000 },
      hasAgreedToDisclaimer: true,
    };

    it('returns empty errors object when form is valid', () => {
      const errors = validateRegistrationForm(validStudentForm, validOptions);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('flags invalid student ID when not 7 digits', () => {
      const errors = validateRegistrationForm(
        { ...validStudentForm, student_id_number: '123' },
        validOptions
      );
      expect(errors.student_id_number).toBe('Must be exactly 7 digits.');
    });

    it('flags invalid contact number when not starting with 09 or not 11 digits', () => {
      const errors = validateRegistrationForm(
        { ...validStudentForm, contact_number: '08123456789' },
        validOptions
      );
      expect(errors.contact_number).toBe('Must start with 09.');
    });

    it('flags password mismatch and missing agreement', () => {
      const errors = validateRegistrationForm(
        { ...validStudentForm, password_confirm: 'Different123' },
        { ...validOptions, hasAgreedToDisclaimer: false }
      );
      expect(errors.password_confirm).toBe('Passwords do not match.');
      expect(errors.disclaimer).toContain('Data Privacy Notice');
    });

    it('validates password composition (capital, small letters, numbers, length)', () => {
      const missingCapital = validateRegistrationForm(
        { ...validStudentForm, password: 'password123', password_confirm: 'password123' },
        validOptions
      );
      expect(missingCapital.password).toBe('Must include at least one capital letter (A-Z).');

      const missingSmall = validateRegistrationForm(
        { ...validStudentForm, password: 'PASSWORD123', password_confirm: 'PASSWORD123' },
        validOptions
      );
      expect(missingSmall.password).toBe('Must include at least one small letter (a-z).');

      const missingNumber = validateRegistrationForm(
        { ...validStudentForm, password: 'PasswordWord', password_confirm: 'PasswordWord' },
        validOptions
      );
      expect(missingNumber.password).toBe('Must include at least one number.');

      const tooShort = validateRegistrationForm(
        { ...validStudentForm, password: 'Pass1', password_confirm: 'Pass1' },
        validOptions
      );
      expect(tooShort.password).toBe('Must be at least 8 characters.');
    });

    describe('employee role classification', () => {
      const baseEmployeeForm = {
        role: 'employee',
        first_name: 'Maria',
        last_name: 'Santos',
        student_id_number: 'EMP-10294',
        contact_number: '09171234567',
        email: 'maria.santos@bsu.edu.ph',
        password: 'Password123',
        password_confirm: 'Password123',
      };

      it('flags missing staff type if not selected', () => {
        const errors = validateRegistrationForm(baseEmployeeForm, validOptions);
        expect(errors.employee_type).toBe('Please select your staff classification.');
      });

      it('requires college when Teaching Staff is selected', () => {
        const errors = validateRegistrationForm(
          { ...baseEmployeeForm, staff_category: 'Teaching Staff', employee_type: 'Teaching Staff' },
          validOptions
        );
        expect(errors.college).toBe('Please select your assigned college.');
      });

      it('passes when Teaching Staff provides assigned college', () => {
        const errors = validateRegistrationForm(
          {
            ...baseEmployeeForm,
            staff_category: 'Teaching Staff',
            employee_type: 'Teaching Staff',
            college: 'College of Information Sciences',
          },
          validOptions
        );
        expect(Object.keys(errors)).toHaveLength(0);
      });

      it('requires subtype when Non-teaching Staff is selected without subtype', () => {
        const errors = validateRegistrationForm(
          { ...baseEmployeeForm, staff_category: 'Non-teaching Staff' },
          validOptions
        );
        expect(errors.employee_subtype).toBe('Please select a non-teaching staff subtype.');
      });

      it('requires center when Research & Extension subtype is selected without center', () => {
        const errors = validateRegistrationForm(
          {
            ...baseEmployeeForm,
            staff_category: 'Non-teaching Staff',
            employee_subtype: 'Research and Extension Staff',
            employee_type: 'Research and Extension Staff',
          },
          validOptions
        );
        expect(errors.college).toBe('Please select your assigned center.');
      });

      it('passes when Research & Extension subtype provides center', () => {
        const errors = validateRegistrationForm(
          {
            ...baseEmployeeForm,
            staff_category: 'Non-teaching Staff',
            employee_subtype: 'Research and Extension Staff',
            employee_type: 'Research and Extension Staff',
            college: 'Northern Philippines Root Crop Research and Training Center (NPRCRTC)',
          },
          validOptions
        );
        expect(Object.keys(errors)).toHaveLength(0);
      });

      it('requires building when Support / Administrative Staff subtype is selected without building', () => {
        const errors = validateRegistrationForm(
          {
            ...baseEmployeeForm,
            staff_category: 'Non-teaching Staff',
            employee_subtype: 'Support / Administrative Staff',
            employee_type: 'Support / Administrative Staff',
          },
          validOptions
        );
        expect(errors.college).toBe('Please select your assigned building.');
      });

      it('passes when Support / Administrative Staff provides building', () => {
        const errors = validateRegistrationForm(
          {
            ...baseEmployeeForm,
            staff_category: 'Non-teaching Staff',
            employee_subtype: 'Support / Administrative Staff',
            employee_type: 'Support / Administrative Staff',
            college: 'Administration Building',
          },
          validOptions
        );
        expect(Object.keys(errors)).toHaveLength(0);
      });
    });
  });
});
