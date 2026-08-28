/**
 * SDN 2 Ngeposari - Reusable EmptyState Component
 * Generates semantic, accessible empty state placeholders across public and admin interfaces.
 */

(function (root) {
  'use strict';

  function createEmptyState(options = {}) {
    const {
      title = 'Belum ada data',
      description = 'Data belum tersedia saat ini.',
      actionHtml = '',
      iconSvg = ''
    } = options;

    return `
      <div class="empty-state-container" style="grid-column: 1/-1; text-align:center; padding: 3.5rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid var(--border); box-shadow: var(--shadow-thin);">
        ${iconSvg ? `<div style="margin-bottom: 12px; color: var(--text-muted);">${iconSvg}</div>` : `
          <div style="margin-bottom: 12px; color: var(--text-muted); display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; background:var(--surface-alt);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        `}
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary); margin: 0 0 6px;">${title}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 440px; margin: 0 auto ${actionHtml ? '16px' : '0'}; line-height: 1.5;">${description}</p>
        ${actionHtml ? `<div style="margin-top: 14px;">${actionHtml}</div>` : ''}
      </div>
    `;
  }

  function createErrorState(options = {}) {
    const {
      title = 'Gagal Memuat Data',
      description = 'Terjadi kendala saat memproses data. Silakan muat ulang halaman atau periksa koneksi Anda.',
      retryCallback = 'location.reload()',
      retryLabel = 'Coba Lagi'
    } = options;

    return `
      <div class="empty-state-container error-state-card" style="grid-column: 1/-1; text-align:center; padding: 3.5rem 1.5rem; background-color: var(--surface); border-radius: var(--radius-card); border: 1px solid #FECACA; box-shadow: var(--shadow-thin);">
        <div class="error-state-icon" style="margin: 0 auto 12px; color: #DC2626; display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; background:#FEE2E2;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text); margin: 0 0 6px;">${title}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px; line-height: 1.5;">${description}</p>
        <div>
          <button type="button" class="btn btn-primary" onclick="${retryCallback}" style="padding: 8px 20px; font-size: 0.88rem; cursor:pointer;">${retryLabel}</button>
        </div>
      </div>
    `;
  }

  const SchoolEmptyState = {
    createEmptyState,
    createErrorState
  };

  root.SchoolEmptyState = SchoolEmptyState;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolEmptyState;
  }
})(typeof window !== 'undefined' ? window : global);
