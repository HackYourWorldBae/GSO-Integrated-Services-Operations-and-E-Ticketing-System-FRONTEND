import { describe, it, expect } from 'vitest';
import {
  checkPasswordCriteria,
  calculatePasswordStrength,
  validateImageFile,
  validateRegistrationForm,
} from '../registrationValidator';

describe('registrationValidator', () => {
  describe('checkPasswordCriteria & calculatePasswordStrength', () => {
    it('requires at least 8 chars, one letter, and one number', () => {
      const empty = checkPasswordCriteria('');
      expect(empty.hasLength).toBe(false);
      expect(empty.hasLetter).toBe(false);
      expect(empty.hasNumber).toBe(false);
      expect(calculatePasswordStrength('')).toBe(0);

      const short = checkPasswordCriteria('a1');
      expect(short.hasLength).toBe(false);
      expect(short.hasLetter).toBe(true);
      expect(short.hasNumber).toBe(true);
      expect(calculatePasswordStrength('a1')).toBe(2);

      const valid = checkPasswordCriteria('Pass1234');
      expect(valid.hasLength).toBe(true);
      expect(valid.hasLetter).toBe(true);
      expect(valid.hasNumber).toBe(true);
      expect(calculatePasswordStrength('Pass1234')).toBe(3);
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
  });
});
