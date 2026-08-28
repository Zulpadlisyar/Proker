/**
 * SDN 2 Ngeposari - Shared Execution Guards & State Trackers
 * Helpers for anti-spam submission locks, debounced listeners, and unsaved changes tracking.
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

  const SchoolGuards = {
    setButtonSubmitting,
    debounce,
    createUnsavedChangesTracker
  };

  root.SchoolGuards = SchoolGuards;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolGuards;
  }
})(typeof window !== 'undefined' ? window : global);
