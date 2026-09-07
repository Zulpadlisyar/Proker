/**
 * SDN 2 Ngeposari - Shared Execution Guards, State Trackers & Error Highlighting System
 * Helpers for anti-spam submission locks, debounced listeners, unsaved changes tracking,
 * and prominent error field spotlighting with red borders ("Sorot Bagian yang Eror").
 */

(function (root) {
  'use strict';

  function setButtonSubmitting(btn, isSubmitting, text = 'Menyimpan...') {
    if (!btn) return;
    if (isSubmitting) {
      btn.disabled = true;
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = `<span class="btn-spinner"></span>${text}`;
    } else {
      btn.disabled = false;
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
    }
  }

  function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function createUnsavedChangesTracker() {
    let isDirty = false;
    let activeFormId = null;

    return {
      markDirty() {
        isDirty = true;
      },
      clearDirty() {
        isDirty = false;
      },
      isDirty() {
        return isDirty;
      },
      setActiveForm(formId) {
        activeFormId = formId;
      },
      getActiveForm() {
        return activeFormId;
      },
      attach(formElement) {
        if (!formElement) return;
        const inputs = formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(el => {
          el.addEventListener('input', () => { isDirty = true; });
          el.addEventListener('change', () => { isDirty = true; });
        });
      }
    };
  }

  /**
   * Sorot langsung ke elemen yang eror & beri border merah:
   * 1. Scrolls the erroneous element into center view smoothly.
   * 2. Focuses the input element.
   * 3. Adds red border (.is-invalid class) and subtle shake animation.
   * 4. Injects or updates .field-error-feedback message below the element.
   * 5. Automatically binds listeners ('input', 'change') to clear the error state as soon as the user edits.
   *
   * @param {HTMLElement|string} target - The DOM element or query selector with error
   * @param {string} [errorMessage] - Human-readable explanation of the error
   * @param {Object} [options] - Optional configurations (preventFocus, container)
   */
  function highlightError(target, errorMessage = '', options = {}) {
    if (typeof document === 'undefined') return null;
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;

    // 1. Remove previous error feedback on this element if present
    clearError(el);

    // 2. Add error class & accessibility state
    el.classList.add('is-invalid');
    el.classList.add('input-error');
    el.setAttribute('aria-invalid', 'true');

    // Retrigger shake animation by resetting animation property
    el.style.animation = 'none';
    void el.offsetWidth; // Force DOM reflow
    el.style.animation = '';

    // 3. Inject field error feedback message if provided
    if (errorMessage) {
      const feedbackEl = document.createElement('div');
      feedbackEl.className = 'field-error-feedback';
      feedbackEl.setAttribute('role', 'alert');
      feedbackEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${errorMessage}</span>
      `;

      // If element is wrapped inside an input group or dropzone, insert after wrapper
      const parent = el.closest('.input-group') || el.closest('.image-upload-area') || el;
      if (parent.nextSibling) {
        parent.parentNode.insertBefore(feedbackEl, parent.nextSibling);
      } else {
        parent.parentNode.appendChild(feedbackEl);
      }
    }

    // 4. "Sorot langsung": Scroll smoothly to center of viewport
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } catch (_) {
      try { el.scrollIntoView(); } catch (e) {}
    }

    // 5. Set focus directly to the erroneous field
    if (!options.preventFocus && typeof el.focus === 'function') {
      try {
        el.focus({ preventScroll: true });
      } catch (_) {
        try { el.focus(); } catch (e) {}
      }
    }

    // 6. Auto-clear red border & error message when user interacts
    const clearHandler = () => {
      clearError(el);
      el.removeEventListener('input', clearHandler);
      el.removeEventListener('change', clearHandler);
    };
    el.addEventListener('input', clearHandler, { once: true });
    el.addEventListener('change', clearHandler, { once: true });

    return el;
  }

  /**
   * Clear error state, red border and feedback message for a specific element
   */
  function clearError(target) {
    if (typeof document === 'undefined') return;
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    el.classList.remove('is-invalid');
    el.classList.remove('input-error');
    el.removeAttribute('aria-invalid');

    // Remove any adjacent feedback element
    const parent = el.closest('.input-group') || el.closest('.image-upload-area') || el;
    if (parent && parent.parentNode) {
      const feedback = parent.parentNode.querySelector(':scope > .field-error-feedback');
      if (feedback) feedback.remove();
    }
  }

  /**
   * Clear all error states and messages within a container or document
   */
  function clearAllErrors(container = (typeof document !== 'undefined' ? document : null)) {
    if (!container) return;
    const rootEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!rootEl) return;

    rootEl.querySelectorAll('.is-invalid, .input-error').forEach(el => {
      el.classList.remove('is-invalid', 'input-error');
      el.removeAttribute('aria-invalid');
    });

    rootEl.querySelectorAll('.field-error-feedback').forEach(f => f.remove());
  }

  /**
   * Bind native form validation so missing required fields get automatically
   * highlighted with red border & centered into view ("Sorot Langsung").
   */
  function bindFormValidation(formElement) {
    if (!formElement) return;

    formElement.addEventListener('invalid', (e) => {
      const field = e.target;
      if (!field) return;

      // Prevent generic native browser tooltip so our custom red highlight works seamlessly
      e.preventDefault();

      let msg = field.validationMessage || 'Kolom ini wajib diisi dengan benar.';
      if (field.validity && field.validity.valueMissing) {
        msg = 'Kolom ini wajib diisi.';
      } else if (field.validity && field.validity.typeMismatch && field.type === 'email') {
        msg = 'Format alamat email tidak valid (contoh: nama@email.com).';
      }

      highlightError(field, msg);
    }, true);
  }

  /**
   * Broken image load listener: highlights broken image with red dashed border
   */
  function initImageErrorTracking(container = (typeof document !== 'undefined' ? document : null)) {
    if (!container) return;
    const rootEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!rootEl) return;

    rootEl.querySelectorAll('img').forEach(img => {
      if (img.dataset.errorTracked) return;
      img.dataset.errorTracked = 'true';
      img.addEventListener('error', () => {
        img.classList.add('img-error');
      });
    });
  }

  const SchoolGuards = {
    setButtonSubmitting,
    debounce,
    createUnsavedChangesTracker,
    highlightError,
    clearError,
    clearAllErrors,
    bindFormValidation,
    initImageErrorTracking
  };

  root.SchoolGuards = SchoolGuards;
  if (typeof root !== 'undefined') {
    root.highlightError = highlightError;
    root.clearError = clearError;
    root.clearAllErrors = clearAllErrors;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolGuards;
  }
})(typeof window !== 'undefined' ? window : global);
