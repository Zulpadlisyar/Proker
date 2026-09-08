/**
 * SDN 2 Ngeposari - Universal Standalone Confirmation Modal Component
 * Completely replaces browser native alert/confirm popups with a beautiful,
 * accessible, glassmorphism modal dialog.
 */

(function (root) {
  'use strict';

  const ConfirmModal = {
    _overlay: null,
    _activeResolve: null,
    _previousActiveElement: null,

    // Ensure CSS styles are injected into document head
    _injectStyles() {
      if (document.getElementById('confirm-modal-standalone-styles')) return;
      const style = document.createElement('style');
      style.id = 'confirm-modal-standalone-styles';
      style.textContent = `
        .custom-confirm-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: rgba(15, 23, 42, 0.72) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
          opacity: 0;
          visibility: hidden;
          transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), visibility 220ms !important;
          box-sizing: border-box !important;
        }
        .custom-confirm-overlay.open {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .custom-confirm-card {
          position: relative !important;
          background-color: #ffffff !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 20px !important;
          padding: 32px 24px 24px !important;
          max-width: 440px !important;
          width: 100% !important;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(15, 23, 42, 0.06) !important;
          text-align: center !important;
          transform: scale(0.92) translateY(14px) !important;
          transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          overflow: hidden !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-sizing: border-box !important;
        }
        .custom-confirm-overlay.open .custom-confirm-card {
          transform: scale(1) translateY(0) !important;
        }
        .custom-confirm-close {
          position: absolute !important;
          top: 14px !important;
          right: 14px !important;
          width: 32px !important;
          height: 32px !important;
          background: #F1F5F9 !important;
          border: 1px solid transparent !important;
          border-radius: 50% !important;
          color: #64748B !important;
          font-size: 18px !important;
          line-height: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 160ms ease !important;
          padding: 0 !important;
        }
        .custom-confirm-close:hover {
          background: #E2E8F0 !important;
          color: #0F172A !important;
          transform: scale(1.08) !important;
        }
        .custom-confirm-icon-wrap {
          width: 68px !important;
          height: 68px !important;
          border-radius: 50% !important;
          margin: 0 auto 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 200ms ease !important;
        }
        .custom-confirm-icon-wrap.icon-type-danger {
          background-color: #FEE2E2 !important;
          color: #DC2626 !important;
          box-shadow: 0 0 0 8px rgba(254, 226, 226, 0.6) !important;
        }
        .custom-confirm-icon-wrap.icon-type-warning {
          background-color: #FEF3C7 !important;
          color: #D97706 !important;
          box-shadow: 0 0 0 8px rgba(254, 243, 199, 0.6) !important;
        }
        .custom-confirm-icon-wrap.icon-type-info {
          background-color: #E0E7FF !important;
          color: #4F46E5 !important;
          box-shadow: 0 0 0 8px rgba(224, 231, 255, 0.6) !important;
        }
        .custom-confirm-title {
          font-size: 1.28rem !important;
          font-weight: 700 !important;
          color: #0F172A !important;
          margin: 0 0 8px !important;
          letter-spacing: -0.01em !important;
          line-height: 1.35 !important;
        }
        .custom-confirm-desc {
          font-size: 0.93rem !important;
          color: #64748B !important;
          line-height: 1.55 !important;
          margin: 0 0 16px !important;
        }
        .custom-confirm-item-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          background-color: #F8FAFC !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 8px !important;
          padding: 8px 14px !important;
          margin: 0 auto 18px !important;
          max-width: 90% !important;
          font-size: 0.86rem !important;
          box-sizing: border-box !important;
        }
        .custom-confirm-item-badge .badge-label {
          color: #94A3B8 !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .custom-confirm-item-badge .badge-name {
          font-weight: 700 !important;
          color: #0F172A !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        .custom-confirm-actions {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
          margin-top: 8px !important;
        }
        .custom-confirm-actions .btn-confirm-action {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          padding: 12px 18px !important;
          font-size: 0.92rem !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          transition: all 160ms ease !important;
          min-height: 44px !important;
          text-decoration: none !important;
          box-sizing: border-box !important;
        }
        .confirm-action-cancel {
          background-color: #F1F5F9 !important;
          color: #475569 !important;
          border: 1px solid #E2E8F0 !important;
        }
        .confirm-action-cancel:hover {
          background-color: #E2E8F0 !important;
          color: #0F172A !important;
        }
        .confirm-action-confirm.btn-danger {
          background-color: #DC2626 !important;
          color: #FFFFFF !important;
          border: 1px solid #DC2626 !important;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.32) !important;
        }
        .confirm-action-confirm.btn-danger:hover {
          background-color: #B91C1C !important;
          border-color: #B91C1C !important;
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.45) !important;
          transform: translateY(-1px) !important;
        }
        .confirm-action-confirm.btn-warning {
          background-color: #D97706 !important;
          color: #FFFFFF !important;
          border: 1px solid #D97706 !important;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.32) !important;
        }
        .confirm-action-confirm.btn-warning:hover {
          background-color: #B45309 !important;
          border-color: #B45309 !important;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45) !important;
          transform: translateY(-1px) !important;
        }
        .confirm-action-confirm.btn-primary {
          background-color: #2F6B45 !important;
          color: #FFFFFF !important;
          border: 1px solid #2F6B45 !important;
          box-shadow: 0 4px 14px rgba(47, 107, 69, 0.32) !important;
        }
        .confirm-action-confirm.btn-primary:hover {
          background-color: #214B31 !important;
          border-color: #214B31 !important;
          box-shadow: 0 6px 20px rgba(47, 107, 69, 0.45) !important;
          transform: translateY(-1px) !important;
        }
      `;
      document.head.appendChild(style);
    },

    // Ensure DOM element is present in body
    _ensureDOM() {
      this._injectStyles();
      let overlay = document.getElementById('custom-confirm-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'custom-confirm-overlay';
        overlay.className = 'custom-confirm-overlay';
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'custom-confirm-title');
        overlay.setAttribute('aria-describedby', 'custom-confirm-desc');
        overlay.style.display = 'none';

        overlay.innerHTML = `
          <div class="custom-confirm-card">
            <button type="button" id="custom-confirm-close-btn" class="custom-confirm-close" aria-label="Tutup dialog">&times;</button>
            
            <div id="custom-confirm-icon-wrap" class="custom-confirm-icon-wrap icon-type-danger">
              <svg id="custom-confirm-icon-trash" class="custom-confirm-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <svg id="custom-confirm-icon-warn" class="custom-confirm-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <svg id="custom-confirm-icon-info" class="custom-confirm-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>

            <h3 id="custom-confirm-title" class="custom-confirm-title">Hapus Data?</h3>
            <p id="custom-confirm-desc" class="custom-confirm-desc">Apakah Anda yakin ingin menghapus data ini? Tindakan tidak dapat dibatalkan.</p>
            
            <div id="custom-confirm-item-badge" class="custom-confirm-item-badge" style="display: none;">
              <span class="badge-label">Item:</span>
              <span id="custom-confirm-item-text" class="badge-name"></span>
            </div>

            <div class="custom-confirm-actions">
              <button type="button" id="custom-confirm-btn-cancel" class="btn-confirm-action confirm-action-cancel">Batal</button>
              <button type="button" id="custom-confirm-btn-confirm" class="btn-confirm-action confirm-action-confirm btn-danger">
                <svg id="custom-confirm-btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span id="custom-confirm-confirm-text">Ya, Hapus</span>
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
      }
      this._overlay = overlay;
      return overlay;
    },

    /**
     * Show confirmation modal
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    show(options = {}) {
      return new Promise((resolve) => {
        const {
          title = 'Konfirmasi Hapus',
          message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan tidak dapat dibatalkan.',
          itemName = '',
          confirmText = 'Ya, Hapus',
          cancelText = 'Batal',
          type = 'danger',
          icon = type === 'danger' ? 'trash' : (type === 'warning' ? 'warning' : 'info')
        } = options;

        const overlay = this._ensureDOM();
        this._previousActiveElement = document.activeElement;

        const titleEl = document.getElementById('custom-confirm-title');
        const descEl = document.getElementById('custom-confirm-desc');
        const badgeEl = document.getElementById('custom-confirm-item-badge');
        const itemTextEl = document.getElementById('custom-confirm-item-text');
        const iconWrap = document.getElementById('custom-confirm-icon-wrap');
        const trashIcon = document.getElementById('custom-confirm-icon-trash');
        const warnIcon = document.getElementById('custom-confirm-icon-warn');
        const infoIcon = document.getElementById('custom-confirm-icon-info');
        const btnCancel = document.getElementById('custom-confirm-btn-cancel');
        const btnConfirm = document.getElementById('custom-confirm-btn-confirm');
        const btnConfirmText = document.getElementById('custom-confirm-confirm-text');
        const btnConfirmIcon = document.getElementById('custom-confirm-btn-icon');
        const btnClose = document.getElementById('custom-confirm-close-btn');

        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = message;

        if (badgeEl && itemTextEl) {
          if (itemName) {
            itemTextEl.textContent = itemName;
            badgeEl.style.display = 'inline-flex';
          } else {
            badgeEl.style.display = 'none';
          }
        }

        if (iconWrap) {
          iconWrap.className = 'custom-confirm-icon-wrap icon-type-' + type;
        }
        if (trashIcon) trashIcon.style.display = (icon === 'trash') ? 'block' : 'none';
        if (warnIcon) warnIcon.style.display = (icon === 'warning') ? 'block' : 'none';
        if (infoIcon) infoIcon.style.display = (icon === 'info') ? 'block' : 'none';

        if (btnCancel) btnCancel.textContent = cancelText;
        if (btnConfirmText) btnConfirmText.textContent = confirmText;

        if (btnConfirm) {
          btnConfirm.className = 'btn-confirm-action confirm-action-confirm ' + 
            (type === 'danger' ? 'btn-danger' : (type === 'warning' ? 'btn-warning' : 'btn-primary'));
          if (btnConfirmIcon) {
            btnConfirmIcon.style.display = (icon === 'trash') ? 'inline-block' : 'none';
          }
        }

        let settled = false;

        const cleanup = () => {
          overlay.classList.remove('open');
          setTimeout(() => {
            if (!overlay.classList.contains('open')) {
              overlay.style.display = 'none';
            }
          }, 220);
          window.removeEventListener('keydown', handleKey);
          overlay.removeEventListener('click', handleBackdrop);
          if (btnCancel) btnCancel.removeEventListener('click', handleCancel);
          if (btnClose) btnClose.removeEventListener('click', handleCancel);
          if (btnConfirm) btnConfirm.removeEventListener('click', handleConfirm);
          if (this._previousActiveElement && typeof this._previousActiveElement.focus === 'function') {
            try { this._previousActiveElement.focus(); } catch (e) {}
          }
        };

        const handleCancel = (e) => {
          if (e) e.preventDefault();
          if (settled) return;
          settled = true;
          cleanup();
          resolve(false);
        };

        const handleConfirm = (e) => {
          if (e) e.preventDefault();
          if (settled) return;
          settled = true;
          cleanup();
          resolve(true);
        };

        const handleBackdrop = (e) => {
          if (e.target === overlay) handleCancel(e);
        };

        const handleKey = (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel(e);
          }
        };

        if (btnCancel) btnCancel.addEventListener('click', handleCancel);
        if (btnClose) btnClose.addEventListener('click', handleCancel);
        if (btnConfirm) btnConfirm.addEventListener('click', handleConfirm);
        overlay.addEventListener('click', handleBackdrop);
        window.addEventListener('keydown', handleKey);

        overlay.style.display = 'flex';
        void overlay.offsetWidth;
        overlay.classList.add('open');

        if (btnCancel) {
          setTimeout(() => btnCancel.focus(), 60);
        }
      });
    }
  };

  // Export globally
  root.ConfirmModal = ConfirmModal;
  root.showConfirmModal = function (options) {
    return ConfirmModal.show(options);
  };
})(typeof window !== 'undefined' ? window : this);
