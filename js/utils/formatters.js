/**
 * SDN 2 Ngeposari - Shared Formatting & Sanitization Utilities
 * Pure helper functions for date formatting, byte conversions, string normalization, and XSS sanitization.
 */

(function (root) {
  'use strict';

  function formatDate(dateStr, format = 'long') {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      if (format === 'short') {
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return String(dateStr);
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function normalizeName(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function truncateText(str, maxLength = 100) {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength).trim() + '...';
  }

  function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<[^>]*>/g, '')
      .replace(/[<>]/g, '')
      .trim();
  }

  function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .trim();
  }

  const SchoolFormatters = {
    formatDate,
    formatBytes,
    normalizeName,
    truncateText,
    sanitizeText,
    sanitizeHTML
  };

  root.SchoolFormatters = SchoolFormatters;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolFormatters;
  }
})(typeof window !== 'undefined' ? window : global);
