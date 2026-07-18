/**
 * GSO-Frontend Production-Grade Security Utility
 * Provides client-side input sanitization, XSS mitigation, secure file validation, and CSRF protection.
 */

// 1. String & Object Sanitization against XSS & script injections
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  // Strip dangerous HTML/script tags and inline event handlers
  return input
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*(iframe|object|embed|applet)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"])[^'"]*\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj instanceof File || obj instanceof Blob || obj instanceof Date) {
    return obj;
  }
  
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
}

// 2. Secure Attachment & File Validation
export function validateAttachment(file, options = {}) {
  const maxSizeMB = options.maxSizeMB || 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedExtensions = options.allowedExtensions || [
    'jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'
  ];
  
  if (!file || !(file instanceof File)) {
    return { isValid: false, error: 'Invalid file object provided.' };
  }
  
  // Check file size limit
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File "${file.name}" exceeds the maximum allowed size of ${maxSizeMB}MB.` 
    };
  }
  
  // Extract and verify file extension
  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
  if (!allowedExtensions.includes(ext)) {
    return { 
      isValid: false, 
      error: `File extension ".${ext}" is not allowed. Supported formats: ${allowedExtensions.join(', ')}.` 
    };
  }
  
  // Sanitize filename against path traversal and special characters
  const cleanName = file.name
    .replace(/(\.\.\/|\.\.\\)/g, '')
    .replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');
    
  let sanitizedFile = file;
  if (cleanName !== file.name) {
    sanitizedFile = new File([file], cleanName, { type: file.type });
  }
  
  return { isValid: true, error: null, sanitizedFile };
}

// 3. Security Headers Generator
export function getSecurityHeaders() {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff'
  };
  
  // Check for CSRF token meta tag (if served inside Laravel/traditional DOM shell)
  if (typeof document !== 'undefined') {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta && csrfMeta.content) {
      headers['X-CSRF-TOKEN'] = csrfMeta.content;
    }
  }
  
  return headers;
}
