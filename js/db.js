// DESIGN.md Compliance - Database & Cloud Sync Wrapper for SDN 2 Ngeposari Website
// Handles LocalStorage / IndexedDB for local-first speed and Firebase Firestore for cross-device sync.

const DB_NAME = 'SDN2NgeposariDB';
const DB_VERSION = 1;
const STORE_NAME = 'siteData';

/**
 * Client-Side Canvas Image Auto-Compression Utility
 * Compresses heavy mobile photos (5MB–10MB) into lightweight WebP/JPEG (~100KB–250KB)
 * @param {File} file - Original file from input
 * @param {Object} options - { maxWidth, maxHeight, quality, mimeType }
 * @returns {Promise<{dataUrl: string, originalSize: number, compressedSize: number, width: number, height: number, reductionPercent: number}>}
 */
async function compressImageFile(file, options = {}) {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.82,
    mimeType = 'image/webp'
  } = options;

  if (!file) throw new Error('File tidak valid.');

  // SVG images are vector: read directly as text/DataURL without rasterization
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({
        dataUrl: e.target.result,
        originalSize: file.size,
        compressedSize: file.size,
        width: 0,
        height: 0,
        reductionPercent: 0
      });
      reader.onerror = () => reject(new Error('Gagal membaca berkas SVG.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Scale down dimensions while preserving exact aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let optimizedDataUrl = null;
        try {
          optimizedDataUrl = canvas.toDataURL(mimeType, quality);
          if (!optimizedDataUrl.startsWith(`data:${mimeType}`)) {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch (err) {
          optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSize = Math.round((optimizedDataUrl.length * 3) / 4);
        const reductionPercent = file.size > 0 
          ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
          : 0;

        resolve({
          dataUrl: optimizedDataUrl,
          originalSize: file.size,
          compressedSize: compressedSize,
          width,
          height,
          reductionPercent
        });
      };
      img.onerror = () => reject(new Error('Berkas gambar rusak atau tidak dapat diproses.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });
}
window.compressImageFile = compressImageFile;

// Dynamic Clean Flat Editorial SVG Mockups for SDN 2 Ngeposari
function generateSVGPlaceholder(type, title) {
  let icon = '';
  let bgFill = '#EFF6FF';
  let iconColor = '#1D4ED8';
  let textColor = '#0F172A';
  let borderStroke = '#DBEAFE';

  if (type === 'library' || type === 'perpus') {
    icon = '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 6h10M6 10h10M6 14h10" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1D4ED8';
  } else if (type === 'computer') {
    icon = '<rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1D4ED8';
  } else if (type === 'sports' || type === 'senam') {
    icon = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 12a6 6 0 0 1 12 0M12 6a6 6 0 0 1 0 12" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#2563EB';
  } else if (type === 'health') {
    icon = '<path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v6M9 12h6" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#FEE2E2'; iconColor = '#DC2626';
  } else if (type === 'scout' || type === 'pramuka') {
    icon = '<path d="M12 2L2 7l10 5 10-5-10-5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1D4ED8';
  } else if (type === 'art') {
    icon = '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/>';
    bgFill = '#F0F9FF'; iconColor = '#0284C7';
  } else if (type === 'garden') {
    icon = '<path d="M12 2a15 15 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 15 15 0 0 0-9-9Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12a3 3 0 1 0 6 0" stroke="currentColor" stroke-width="2"/><path d="M12 2v18" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#ECFDF5'; iconColor = '#16A34A';
  } else if (type === 'upacara') {
    icon = '<path d="M4 22V2m0 2h14l-3 4 3 4H4" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1D4ED8';
  } else if (type === 'kelas' || type === 'class') {
    icon = '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#F8FAFC'; iconColor = '#1D4ED8';
  } else if (type === 'juara') {
    icon = '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#EFF6FF'; iconColor = '#1D4ED8';
  } else {
    icon = '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2"/>';
    bgFill = '#F8FAFC'; iconColor = '#64748B';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
    <rect width="100%" height="100%" fill="${bgFill}" />
    <rect x="15" y="15" width="370" height="220" rx="16" fill="none" stroke="${borderStroke}" stroke-width="1.5" />
    <g transform="translate(170, 75) scale(2.8)" color="${iconColor}">
      ${icon}
    </g>
    <text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="700" font-size="14">
      ${title}
    </text>
  </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// School Logo SVG compliance (sincere, bold outline design)
function generateLogoSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#1E40AF" rx="16" />
    <path d="M30 75 L30 45 L50 25 L70 45 L70 75 Z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
    <path d="M50 75 L50 50" stroke="#D97706" stroke-width="4" />
    <circle cx="50" cy="25" r="5" fill="#D97706" />
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// School Hero SVG compliance (clean outline structure, real school photo fallback mockup)
function generateHeroSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#F8F8F5" />
    <rect x="40" y="40" width="1120" height="520" rx="28" fill="none" stroke="#E7E7E2" stroke-width="2" />
    <line x1="40" y1="300" x2="1160" y2="300" stroke="#E7E7E2" stroke-width="1.5" stroke-dasharray="8 6" />
    <line x1="600" y1="40" x2="600" y2="560" stroke="#E7E7E2" stroke-width="1.5" stroke-dasharray="8 6" />
    
    <!-- Simple warm visual shapes -->
    <rect x="750" y="160" width="300" height="280" rx="20" fill="#1E40AF" opacity="0.08" />
    <circle cx="900" cy="300" r="110" fill="none" stroke="#D97706" stroke-width="3" stroke-dasharray="6 8" />
    <path d="M850 250 L950 350 M950 250 L850 350" stroke="#1E40AF" stroke-width="4" opacity="0.3" />
    
    <g transform="translate(80, 160)">
      <text x="0" y="40" fill="#1E40AF" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" letter-spacing="2px">
        SEKOLAH YANG TUMBUH BERSAMA
      </text>
      <text x="0" y="110" fill="#171717" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" letter-spacing="-1px">
        Tempat belajar, bertumbuh,
      </text>
      <text x="0" y="165" fill="#171717" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" letter-spacing="-1px">
        dan menemukan hal baru.
      </text>
      <text x="0" y="240" fill="#666666" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="18">
        Kenali lingkungan sekolah, kegiatan, fasilitas, dan cerita
      </text>
      <text x="0" y="270" fill="#666666" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="18">
        di balik aktivitas sehari-hari kami di SDN 2 Ngeposari.
      </text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}// Initial Data Seed - Delegates directly to centralized SchoolConstants
const INITIAL_DATA = (typeof window !== 'undefined' && window.SchoolConstants && window.SchoolConstants.INITIAL_DATA)
  ? window.SchoolConstants.INITIAL_DATA
  : {
      profile: { name: 'SD Negeri 2 Ngeposari', tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan', logo: 'images/logo.webp' },
      facilities: [],
      activities: [],
      gallery: [],
      contact: { address: 'Mojo RT 01/RW13, Ngeposari, Semanu, Gunungkidul, DI Yogyakarta, 55893', email: 'sdngeposari2semanu@gmail.com' },
      teachers: [],
      testimonials: [],
      academicCalendar: [],
      schoolHabits: [],
      comfortStandards: [],
      inquiries: [],
      categories: ['Akademik', 'Kepramukaan', 'Ekstrakurikuler', 'Prestasi', 'Sosial & Lingkungan', 'Umum']
    };

// IndexedDB Helper class to handle rich uploads
class IndexedStore {
  constructor() {
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return resolve(this);
      }
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this);
        };

        request.onerror = (event) => {
          console.warn('IndexedDB unavailable, falling back to LocalStorage:', event.target.error);
          resolve(this);
        };
      } catch (e) {
        console.warn('IndexedDB open error:', e);
        resolve(this);
      }
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return resolve(null);
      }
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  set(key, val) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return resolve(true);
      }
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(val, key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      } catch (e) {
        resolve(true);
      }
    });
  }
}

const idbStore = new IndexedStore();

// ==========================================================================
// CLOUD SYNC MANAGER (Firebase Firestore Cross-Device Offline-First Sync)
// ==========================================================================
window.CloudSyncManager = {
  firestore: null,
  app: null,
  isSyncing: false,
  lastSyncTime: null,
  
  getConfig() {
    try {
      const raw = localStorage.getItem('sdn2_firebase_config');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.projectId) return parsed;
      }
    } catch (e) {}

    // Centralized fallback configuration from constants.js across all domains
    if (typeof SchoolConstants !== 'undefined' && SchoolConstants.DEFAULT_FIREBASE_CONFIG && SchoolConstants.DEFAULT_FIREBASE_CONFIG.projectId) {
      return SchoolConstants.DEFAULT_FIREBASE_CONFIG;
    }
    if (typeof window !== 'undefined' && window.SchoolConstants && window.SchoolConstants.DEFAULT_FIREBASE_CONFIG && window.SchoolConstants.DEFAULT_FIREBASE_CONFIG.projectId) {
      return window.SchoolConstants.DEFAULT_FIREBASE_CONFIG;
    }
    return null;
  },

  saveConfig(config) {
    if (!config || !config.projectId) {
      localStorage.removeItem('sdn2_firebase_config');
      this.firestore = null;
      this.app = null;
      return false;
    }
    localStorage.setItem('sdn2_firebase_config', JSON.stringify(config));
    return this.initFirebase(config);
  },

  initFirebase(config = null) {
    const cfg = config || this.getConfig();
    if (!cfg || !cfg.projectId || typeof firebase === 'undefined') {
      return false;
    }

    try {
      if (!firebase.apps || firebase.apps.length === 0) {
        this.app = firebase.initializeApp(cfg);
      } else {
        this.app = firebase.app();
      }
      this.firestore = firebase.firestore();
      return true;
    } catch (e) {
      console.warn('[CloudSync] Firebase initialization error:', e);
      return false;
    }
  },

  isConfigured() {
    if (!this.firestore) {
      this.initFirebase();
    }
    return !!this.firestore;
  },

  async testConnection(config) {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK belum termuat. Periksa koneksi internet Anda.');
    }
    if (!config || !config.projectId) {
      throw new Error('Project ID Firebase wajib diisi.');
    }
    
    let tempApp = null;
    try {
      const appName = 'test_conn_' + Date.now();
      tempApp = firebase.initializeApp(config, appName);
      const db = tempApp.firestore();
      
      // Ping check doc
      await db.collection('system').doc('healthcheck').set({
        lastCheck: new Date().toISOString(),
        school: 'SDN 2 Ngeposari'
      }, { merge: true });
      
      await tempApp.delete();
      return true;
    } catch (err) {
      if (tempApp) {
        try { await tempApp.delete(); } catch(e) {}
      }
      throw err;
    }
  },

  async syncToCloud(data) {
    if (!this.isConfigured() || !data || this.isSyncing) return false;
    this.isSyncing = true;
    try {
      const cleanData = {
        profile: data.profile || {},
        teachers: data.teachers || [],
        facilities: data.facilities || [],
        activities: data.activities || [],
        categories: data.categories || [],
        gallery: data.gallery || [],
        testimonials: data.testimonials || [],
        academicCalendar: data.academicCalendar || [],
        schoolHabits: data.schoolHabits || [],
        comfortStandards: data.comfortStandards || [],
        inquiries: data.inquiries || [],
        contact: data.contact || {},
        adminPassword: data.adminPassword || (typeof localStorage !== 'undefined' ? localStorage.getItem('sdn2_admin_custom_password') : null) || 'asdd',
        updatedAt: new Date().toISOString(),
        syncedBy: 'Admin Web CMS'
      };
      
      await this.firestore.collection('school_data').doc('main_state').set(cleanData, { merge: true });
      this.lastSyncTime = new Date();
      localStorage.setItem('sdn2_last_cloud_sync', this.lastSyncTime.toISOString());
      console.info('[CloudSync] Berhasil menyinkronkan data ke Cloud Firestore');
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('cloud-sync-success', { detail: { time: this.lastSyncTime } }));
      }
      return true;
    } catch (err) {
      console.warn('[CloudSync] Gagal upload data ke cloud:', err);
      return false;
    } finally {
      this.isSyncing = false;
    }
  },

  async syncFromCloud() {
    if (!this.isConfigured() || this.isSyncing) return null;
    this.isSyncing = true;
    try {
      const doc = await this.firestore.collection('school_data').doc('main_state').get();
      if (doc.exists) {
        const cloudData = doc.data();
        this.lastSyncTime = new Date();
        localStorage.setItem('sdn2_last_cloud_sync', this.lastSyncTime.toISOString());
        console.info('[CloudSync] Berhasil mengunduh data terbaru dari Cloud Firestore');
        return cloudData;
      }
      return null;
    } catch (err) {
      console.warn('[CloudSync] Gagal mengunduh data dari cloud:', err);
      return null;
    } finally {
      this.isSyncing = false;
    }
  },

  unsubscribeSnapshot: null,

  listenToCloudUpdates(callback) {
    if (!this.isConfigured() || typeof callback !== 'function') return null;
    try {
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
        this.unsubscribeSnapshot = null;
      }
      this.unsubscribeSnapshot = this.firestore
        .collection('school_data')
        .doc('main_state')
        .onSnapshot((doc) => {
          if (doc.exists && !doc.metadata.hasPendingWrites) {
            const freshData = doc.data();
            callback(freshData);
          }
        }, (err) => {
          console.warn('[CloudSync] Snapshot listener error:', err);
        });
      return this.unsubscribeSnapshot;
    } catch (err) {
      console.warn('[CloudSync] Failed to setup real-time listener:', err);
      return null;
    }
  }
};

// Core DB Management Object with Security & Integrity Hardening
window.SchoolDB = {
  data: null,
  isInitialized: false,
  _recentMutations: new Map(),

  // Strict Sanitization to Prevent XSS
  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<[^>]*>/g, '')
      .replace(/[<>]/g, '')
      .trim();
  },

  sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    // Strip dangerous script, iframe, object, embed, javascript: protocols
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .trim();
  },

  // Audit Logging
  async logAudit(action, entity, detail) {
    if (!this.data) return;
    if (!Array.isArray(this.data.auditLogs)) {
      this.data.auditLogs = [];
    }
    
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      action: action, // 'TAMBAH', 'UBAH', 'HAPUS', 'RESET'
      entity: entity, // 'Profil', 'Guru', 'Fasilitas', 'Kegiatan', 'Galeri', 'Kontak'
      detail: detail,
      user: 'Administrator'
    };
    
    this.data.auditLogs.unshift(newLog);
    // Keep max 50 recent audit logs
    if (this.data.auditLogs.length > 50) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 50);
    }
    await this.save();
  },

  getAuditLogs(limit = 10) {
    if (!this.data || !Array.isArray(this.data.auditLogs)) {
      return [];
    }
    return this.data.auditLogs.slice(0, limit);
  },

  // Idempotency Check
  _checkIdempotency(key) {
    const now = Date.now();
    // Clean old keys > 5s
    for (const [k, time] of this._recentMutations.entries()) {
      if (now - time > 5000) this._recentMutations.delete(k);
    }
    if (this._recentMutations.has(key)) {
      console.warn(`[SchoolDB] Duplicate mutation blocked for key: ${key}`);
      return true; // Duplicate detected
    }
    this._recentMutations.set(key, now);
    return false;
  },

  async init() {
    if (this.isInitialized) return this;

    try {
      await idbStore.init();
      let savedData = await idbStore.get('siteData');
      
      if (!savedData) {
        const localRaw = localStorage.getItem('sdn2_db_data') || localStorage.getItem('sdn2_db_data_backup');
        if (localRaw) {
          try {
            savedData = JSON.parse(localRaw);
            await idbStore.set('siteData', savedData);
          } catch (e) {
            console.error('Error parsing localStorage backup data:', e);
          }
        }
      }

      if (!savedData) {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.data.auditLogs = [
          {
            id: 'log_init',
            timestamp: new Date().toISOString(),
            action: 'RESET',
            entity: 'Sistem',
            detail: 'Inisialisasi database awal bawaan',
            user: 'Sistem'
          }
        ];
        await this.save();
      } else {
        this.data = savedData;
        this.data.profile = { ...INITIAL_DATA.profile, ...this.data.profile };
        
        // Ensure official school identity sync
        if (!this.data.profile.name || this.data.profile.name === 'SDN 2 Ngeposari') {
          this.data.profile.name = 'SDN Ngeposari 2';
        }
        if (!this.data.profile.logo || this.data.profile.logo.startsWith('data:image/svg+xml') || this.data.profile.logo === 'images/logo.png') {
          this.data.profile.logo = 'images/logo.webp';
        }
        if (!this.data.profile.tagline || this.data.profile.tagline === 'Semanu, Gunungkidul') {
          this.data.profile.tagline = INITIAL_DATA.profile.tagline;
        }
        if (!this.data.profile.description || this.data.profile.description.startsWith('Menghadirkan lingkungan belajar')) {
          this.data.profile.description = INITIAL_DATA.profile.description;
        }
        this.data.profile.npsn = this.data.profile.npsn || '20401876';
        this.data.profile.nss = this.data.profile.nss || '101040310002';
        this.data.profile.akreditasi = this.data.profile.akreditasi || 'A';
        this.data.profile.totalStudents = this.data.profile.totalStudents || 143;
        this.data.profile.totalTeachers = this.data.profile.totalTeachers || 8;
        this.data.profile.totalPrincipal = this.data.profile.totalPrincipal || 1;
        this.data.profile.totalStaff = this.data.profile.totalStaff || 2;
        this.data.profile.totalClasses = this.data.profile.totalClasses || 6;
        if (!this.data.profile.vision || this.data.profile.vision.startsWith('Terwujudnya peserta')) {
          this.data.profile.vision = '-';
        }

        // Clean up broken/stretched missions if any corrupted words exist
        if (Array.isArray(this.data.profile.missions)) {
          this.data.profile.missions = this.data.profile.missions
            .filter(m => typeof m === 'string' && m.trim().length > 0)
            .map(m => m.replace(/(\S{35})/g, '$1 ').trim())
            .slice(0, 10);
        } else {
          this.data.profile.missions = JSON.parse(JSON.stringify(INITIAL_DATA.profile.missions));
        }

        this.data.contact = { ...INITIAL_DATA.contact, ...this.data.contact };
        if (!this.data.contact.email || this.data.contact.email.includes('info@sdn')) {
          this.data.contact.email = INITIAL_DATA.contact.email;
        }
        if (!this.data.contact.address || this.data.contact.address.includes('Jl. Karangmojo') || !this.data.contact.address.includes('Mojo RT 01/RW13')) {
          this.data.contact.address = INITIAL_DATA.contact.address;
        }
        if (!this.data.contact.maps || this.data.contact.maps.includes('0x2e7a372132eb2c0b')) {
          this.data.contact.maps = INITIAL_DATA.contact.maps;
        }
        this.data.contact.mapsUrl = INITIAL_DATA.contact.mapsUrl;
        this.data.contact.facebook = INITIAL_DATA.contact.facebook;
        this.data.contact.facebookUrl = INITIAL_DATA.contact.facebookUrl;
        this.data.contact.instagram = INITIAL_DATA.contact.instagram;
        this.data.contact.instagramUrl = INITIAL_DATA.contact.instagramUrl;
        this.data.contact.youtube = INITIAL_DATA.contact.youtube;
        this.data.contact.youtubeUrl = INITIAL_DATA.contact.youtubeUrl;

        if (!Array.isArray(this.data.facilities)) this.data.facilities = JSON.parse(JSON.stringify(INITIAL_DATA.facilities || []));
        if (!Array.isArray(this.data.activities)) this.data.activities = JSON.parse(JSON.stringify(INITIAL_DATA.activities || []));
        if (!Array.isArray(this.data.gallery)) this.data.gallery = JSON.parse(JSON.stringify(INITIAL_DATA.gallery || []));
        if (!Array.isArray(this.data.teachers) || this.data.teachers.length < 5) this.data.teachers = JSON.parse(JSON.stringify(INITIAL_DATA.teachers || []));
        if (!Array.isArray(this.data.testimonials)) this.data.testimonials = JSON.parse(JSON.stringify(INITIAL_DATA.testimonials || []));
        if (!Array.isArray(this.data.academicCalendar)) this.data.academicCalendar = JSON.parse(JSON.stringify(INITIAL_DATA.academicCalendar || []));
        if (!Array.isArray(this.data.schoolHabits)) this.data.schoolHabits = JSON.parse(JSON.stringify(INITIAL_DATA.schoolHabits || []));
        if (!Array.isArray(this.data.comfortStandards)) this.data.comfortStandards = JSON.parse(JSON.stringify(INITIAL_DATA.comfortStandards || []));
        if (!Array.isArray(this.data.inquiries)) this.data.inquiries = JSON.parse(JSON.stringify(INITIAL_DATA.inquiries || []));
        if (!Array.isArray(this.data.categories)) this.data.categories = (INITIAL_DATA.categories ? [...INITIAL_DATA.categories] : ['Akademik', 'Kepramukaan', 'Ekstrakurikuler', 'Prestasi', 'Sosial & Lingkungan', 'Umum']);
        if (!Array.isArray(this.data.auditLogs)) this.data.auditLogs = [];
        if (!this.data.adminPassword) {
          const savedPwd = (typeof localStorage !== 'undefined') ? localStorage.getItem('sdn2_admin_custom_password') : null;
          this.data.adminPassword = savedPwd || 'asdd';
        }
        
        // Ensure activities views start cleanly at 0 if not yet reset
        if (!this.data._viewsResetV6) {
          if (Array.isArray(this.data.activities)) {
            this.data.activities.forEach(a => {
              a.views = 0;
              try {
                localStorage.removeItem(`act_views_${a.id}`);
                sessionStorage.removeItem(`last_view_ts_${a.id}`);
              } catch (e) {}
            });
          }
          this.data._viewsResetV6 = true;
        }

        // Ensure activities and gallery use authentic school photos
        if (!this.data._authenticActivitiesV1) {
          if (Array.isArray(this.data.activities)) {
            const a1 = this.data.activities.find(a => a.id === 'a1');
            if (a1 && (a1.image.includes('unsplash') || a1.image.includes('photo-1509062522246'))) {
              a1.image = 'images/school/upacara_bendera.webp';
              a1.title = 'Upacara bendera senin dan pembinaan karakter';
            }
            const a2 = this.data.activities.find(a => a.id === 'a2');
            if (a2 && (a2.image.includes('unsplash') || a2.image.includes('photo-1497633762265'))) {
              a2.image = 'images/school/latihan_pramuka.webp';
              a2.title = 'Latihan rutin pramuka penggalang dan siaga';
            }
            const a3 = this.data.activities.find(a => a.id === 'a3');
            if (a3 && (a3.image.includes('unsplash') || a3.image.includes('photo-1542601906990'))) {
              a3.image = 'images/school/latihan_tari.webp';
              a3.title = 'Latihan seni tari tradisional dan olah kreasi';
            }
            const a4 = this.data.activities.find(a => a.id === 'a4');
            if (a4 && (a4.image.includes('kegiatan1') || a4.image.includes('unsplash') || a4.image.includes('hero'))) {
              a4.image = 'images/school/apotek_hidup.webp';
            }
            if (!this.data.activities.some(a => a.id === 'a4')) {
              this.data.activities.push({
                id: 'a4',
                title: 'Kerja bakti gerakan sekolah hijau',
                date: '2026-08-05',
                category: 'Sosial & Lingkungan',
                views: 0,
                excerpt: 'Aksi peduli lingkungan bersama guru dan siswa menjaga kebersihan serta menanam pohon di sekolah.',
                content: 'Sebagai sekolah yang berbudaya lingkungan, SDN Ngeposari 2 mengadakan kerja bakti bulanan. Siswa diajarkan memilah sampah organik dan non-organik, serta melakukan penanaman bibit tanaman hias dan apotek hidup di area taman sekolah.',
                image: 'images/school/apotek_hidup.webp'
              });
            }
          }
          if (Array.isArray(this.data.gallery)) {
            const g1 = this.data.gallery.find(g => g.id === 'g1');
            if (g1 && (g1.image.includes('kegiatan1') || g1.image.includes('unsplash'))) {
              g1.image = 'images/school/lab_komputer.webp';
              g1.caption = 'Praktik komputer & literasi digital siswa di lab IT';
            }
            const g2 = this.data.gallery.find(g => g.id === 'g2');
            if (g2 && (g2.image.includes('hero') || g2.image.includes('unsplash'))) {
              g2.image = 'images/school/gedung_sdn2_ngeposari.webp';
              g2.caption = 'Gedung utama dan halaman asri SDN 2 Ngeposari';
            }
            const g3 = this.data.gallery.find(g => g.id === 'g3');
            if (g3 && (g3.image.includes('fasilitas1') || g3.image.includes('unsplash'))) {
              g3.image = 'images/school/latihan_pramuka.webp';
              g3.caption = 'Latihan kepramukaan penggalang membentuk kedisiplinan';
            }
            const g4 = this.data.gallery.find(g => g.id === 'g4');
            if (g4 && (g4.image.includes('unsplash') || g4.image.includes('photo-1509062522246'))) {
              g4.image = 'images/school/upacara_bendera.webp';
              g4.caption = 'Upacara bendera & apel pembinaan karakter';
            }
            const g5 = this.data.gallery.find(g => g.id === 'g5');
            if (g5 && (g5.image.includes('unsplash') || g5.image.includes('photo-1521587760476'))) {
              g5.image = 'images/school/latihan_tari.webp';
              g5.caption = 'Latihan seni tari tradisional siswa di ruang kelas';
            }
            const g6 = this.data.gallery.find(g => g.id === 'g6');
            if (g6 && (g6.image.includes('hero') || g6.image.includes('unsplash') || g6.image.includes('school_hero_bg'))) {
              g6.image = 'images/school/apotek_hidup.webp';
              g6.caption = 'Kerja bakti pembersihan tanaman apotek hidup & sekolah hijau';
            }
          }
          this.data._authenticActivitiesV1 = true;
        }

        // Ensure teachers and principal match official school faculty records
        if (!this.data._authenticTeachersV2) {
          this.data.teachers = JSON.parse(JSON.stringify(INITIAL_DATA.teachers || []));
          if (this.data.profile) {
            if (!this.data.profile.principalName || this.data.profile.principalName.includes('Maryanto') || this.data.profile.principalName.includes('Hartono')) {
              this.data.profile.principalName = INITIAL_DATA.profile.principalName;
            }
            if (!this.data.profile.principalImage || this.data.profile.principalImage.includes('unsplash')) {
              this.data.profile.principalImage = INITIAL_DATA.profile.principalImage;
            }
            this.data.profile.totalTeachers = 8;
            this.data.profile.totalPrincipal = 1;
            this.data.profile.totalStaff = 2;
          }
          this.data._authenticTeachersV2 = true;
        }

        // 2026-09-06: Comprehensive Content & Footage Reset to Official 2026/2027 Baseline
        if (!this.data._officialReset2026V1) {
          if (!this.data.profile) this.data.profile = {};
          this.data.profile.vision = INITIAL_DATA.profile.vision;
          this.data.profile.visionYear = INITIAL_DATA.profile.visionYear;
          this.data.profile.visionIndicators = JSON.parse(JSON.stringify(INITIAL_DATA.profile.visionIndicators || []));
          this.data.profile.missions = JSON.parse(JSON.stringify(INITIAL_DATA.profile.missions || []));
          this.data.profile.values = JSON.parse(JSON.stringify(INITIAL_DATA.profile.values || []));
          this.data.profile.principalName = INITIAL_DATA.profile.principalName;
          this.data.profile.principalRole = INITIAL_DATA.profile.principalRole;
          this.data.profile.principalImage = INITIAL_DATA.profile.principalImage;
          this.data.profile.logo = 'images/logo.webp';
          this.data.profile.totalTeachers = 8;
          this.data.profile.totalPrincipal = 1;
          this.data.profile.totalStaff = 2;
          this.data.teachers = JSON.parse(JSON.stringify(INITIAL_DATA.teachers || []));
          this.data.activities = JSON.parse(JSON.stringify(INITIAL_DATA.activities || []));
          this.data.gallery = JSON.parse(JSON.stringify(INITIAL_DATA.gallery || []));
          
          this.data._resetBaseline = {
            data: JSON.parse(JSON.stringify(this.data)),
            timestamp: new Date().toISOString(),
            label: 'Data Resmi 2026/2027 (Visi, Misi & Footage Terlengkap)',
            schoolName: this.data.profile.name || 'SD Negeri 2 Ngeposari'
          };
          this.data._officialReset2026V1 = true;
        }

        // 2026-09-07: Synchronize deleted footage globally (purge any lingering references to deleted footage like fasilitas1.webp)
        if (Array.isArray(this.data.facilities)) {
          this.data.facilities = this.data.facilities.filter(f => {
            const img = (f.image || '').toLowerCase();
            const name = (f.name || '').toLowerCase();
            return !img.includes('fasilitas1') && !name.includes('ruang kelas asri & bersih');
          });
        }
        if (Array.isArray(this.data.gallery)) {
          this.data.gallery = this.data.gallery.filter(g => {
            const img = (g.image || '').toLowerCase();
            const caption = (g.caption || '').toLowerCase();
            return !img.includes('fasilitas1') && !caption.includes('ruang kelas ramah anak & bersih');
          });
        }

        // 2026-09-08: Ensure all facilities use authentic local school webp assets (no dead unsplash links)
        if (Array.isArray(this.data.facilities)) {
          this.data.facilities.forEach(f => {
            const lower = (f.name || '').toLowerCase();
            if (f.id === 'f1' || lower.includes('perpustakaan')) {
              if (!f.image || f.image.includes('kegiatan1') || f.image.includes('unsplash') || f.image.includes('fasilitas1')) {
                f.image = 'images/school/perpustakaan.webp';
              }
            } else if (f.id === 'f2' || lower.includes('komputer') || lower.includes('lab')) {
              if (!f.image || f.image.includes('pramuka') || f.image.includes('unsplash')) {
                f.image = 'images/school/lab_komputer.webp';
              }
            } else if (f.id === 'f3' || lower.includes('lapangan') || lower.includes('olahraga')) {
              if (!f.image || f.image.includes('upacara') || f.image.includes('unsplash')) {
                f.image = 'images/school/lapangan.webp';
              }
            } else if (f.id === 'f4' || lower.includes('uks') || lower.includes('kesehatan')) {
              if (!f.image || f.image.includes('gedung') || f.image.includes('unsplash')) {
                f.image = 'images/school/ruang_uks.webp';
              }
            }
          });
        }

        // 2026-09-08: Ensure activities and gallery do not contain deleted assets (kegiatan1, hero.webp)
        if (Array.isArray(this.data.activities)) {
          this.data.activities.forEach(a => {
            if (a.image && (a.image.includes('kegiatan1') || a.image.includes('hero.webp'))) {
              a.image = 'images/school/apotek_hidup.webp';
            }
          });
        }
        if (Array.isArray(this.data.gallery)) {
          this.data.gallery.forEach(g => {
            if (g.image && g.image.includes('kegiatan1')) {
              g.image = 'images/school/lab_komputer.webp';
            }
            if (g.image && g.image.includes('hero.webp')) {
              g.image = 'images/school/gedung_sdn2_ngeposari.webp';
            }
          });
        }

        // 2026-09-07: Ensure testimonials use polite male/female silhouette avatars
        if (Array.isArray(this.data.testimonials)) {
          this.data.testimonials.forEach(t => {
            if (!t.avatar || t.avatar.includes('unsplash') || t.avatar.includes('photo-')) {
              const lower = ((t.name || '') + ' ' + (t.role || '')).toLowerCase();
              const isMale = lower.match(/\b(bapak|bpk|ayah|pak|pria|laki|sugiyanto)\b/);
              t.avatar = isMale ? 'images/avatars/silhouette-male.svg' : 'images/avatars/silhouette-female.svg';
            }
          });
        }
        
        await this.save();
      }

      this.isInitialized = true;
      console.log('Database initialized successfully with security rules.');

      // Initialize Cloud Sync & Real-time Cross-Domain Listener
      if (typeof window !== 'undefined' && window.CloudSyncManager) {
        window.CloudSyncManager.initFirebase();
        if (window.CloudSyncManager.isConfigured()) {
          // Fast cloud fetch with a 2.5s timeout race so offline/slow environments are never delayed
          try {
            await Promise.race([
              this.syncFromCloud(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud sync timeout')), 2500))
            ]);
          } catch (e) {
            console.warn('[SchoolDB] Initial fast cloud sync deferred/timed out (using local cached data):', e.message || e);
          }

          // Attach real-time Firestore listener for live cross-origin updates
          window.CloudSyncManager.listenToCloudUpdates(async (freshCloudData) => {
            console.info('[SchoolDB] Real-time cloud push received from Firestore.');
            await this._applyCloudData(freshCloudData);
          });
        }
      }

      return this;
    } catch (err) {
      console.error('Database failed to initialize:', err);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.data.auditLogs = [];
      this.isInitialized = true;
      return this;
    }
  },

  async save() {
    if (!this.data) return;
    try {
      await idbStore.set('siteData', this.data);
      try {
        localStorage.setItem('sdn2_db_data_backup', JSON.stringify({
          profile: { ...this.data.profile, logo: '', hero: '' }, 
          contact: this.data.contact
        }));
        localStorage.setItem('sdn2_db_loaded', 'true');
        localStorage.setItem('sdn2_db_sync_time', String(Date.now()));
      } catch (e) {
        console.warn('LocalStorage backup quota exceeded or blocked.');
      }

      // Real-time component notification
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('schooldb-synced', { detail: this.data }));
      }

      // Automatically sync changes to Cloud Firestore if connected
      if (typeof window !== 'undefined' && window.CloudSyncManager && window.CloudSyncManager.isConfigured()) {
        window.CloudSyncManager.syncToCloud(this.data).catch(err => console.warn('[SchoolDB] Async cloud push failed:', err));
      }
    } catch (err) {
      console.error('Error saving data to database:', err);
    }
  },

  async _applyCloudData(cloudData) {
    if (!cloudData || !this.data) return false;
    let changed = false;

    if (cloudData.profile) {
      this.data.profile = { ...this.data.profile, ...cloudData.profile };
      changed = true;
    }
    if (Array.isArray(cloudData.teachers) && cloudData.teachers.length > 0) {
      this.data.teachers = cloudData.teachers;
      changed = true;
    }
    if (Array.isArray(cloudData.facilities)) {
      this.data.facilities = cloudData.facilities;
      changed = true;
    }
    if (Array.isArray(cloudData.activities)) {
      this.data.activities = cloudData.activities;
      changed = true;
    }
    if (Array.isArray(cloudData.categories) && cloudData.categories.length > 0) {
      this.data.categories = cloudData.categories;
      changed = true;
    }
    if (Array.isArray(cloudData.gallery)) {
      this.data.gallery = cloudData.gallery;
      changed = true;
    }
    if (Array.isArray(cloudData.testimonials)) {
      this.data.testimonials = cloudData.testimonials;
      changed = true;
    }
    if (Array.isArray(cloudData.academicCalendar)) {
      this.data.academicCalendar = cloudData.academicCalendar;
      changed = true;
    }
    if (Array.isArray(cloudData.schoolHabits)) {
      this.data.schoolHabits = cloudData.schoolHabits;
      changed = true;
    }
    if (Array.isArray(cloudData.comfortStandards)) {
      this.data.comfortStandards = cloudData.comfortStandards;
      changed = true;
    }
    if (Array.isArray(cloudData.inquiries)) {
      const localInquiries = Array.isArray(this.data.inquiries) ? this.data.inquiries.filter(Boolean) : [];
      const inqMap = new Map();
      localInquiries.forEach(inq => {
        if (inq && inq.id) inqMap.set(String(inq.id), inq);
      });
      cloudData.inquiries.filter(Boolean).forEach(inq => {
        if (inq && inq.id) {
          const existing = inqMap.get(String(inq.id));
          inqMap.set(String(inq.id), { ...(existing || {}), ...inq });
        }
      });
      this.data.inquiries = Array.from(inqMap.values());
      changed = true;
    }
    if (cloudData.contact) {
      this.data.contact = { ...this.data.contact, ...cloudData.contact };
      changed = true;
    }
    if (cloudData.adminPassword && typeof cloudData.adminPassword === 'string') {
      this.data.adminPassword = cloudData.adminPassword;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('sdn2_admin_custom_password', cloudData.adminPassword);
        }
      } catch (e) {}
      changed = true;
    }

    if (changed) {
      await idbStore.set('siteData', this.data);
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('schooldb-synced', { detail: this.data }));
      }
    }
    return changed;
  },

  async syncFromCloud() {
    if (typeof window === 'undefined' || !window.CloudSyncManager) return false;
    const cloudData = await window.CloudSyncManager.syncFromCloud();
    if (cloudData) {
      return await this._applyCloudData(cloudData);
    }
    return false;
  },

  exportBackupJSON() {
    if (!this.data) return null;
    const backupObj = {
      version: '4.6',
      exportDate: new Date().toISOString(),
      school: 'SDN 2 Ngeposari',
      data: {
        profile: this.data.profile,
        teachers: this.data.teachers,
        facilities: this.data.facilities,
        activities: this.data.activities,
        categories: this.data.categories,
        gallery: this.data.gallery,
        testimonials: this.data.testimonials,
        academicCalendar: this.data.academicCalendar,
        schoolHabits: this.data.schoolHabits,
        comfortStandards: this.data.comfortStandards,
        inquiries: this.data.inquiries,
        contact: this.data.contact
      }
    };
    return JSON.stringify(backupObj, null, 2);
  },

  async importBackupJSON(jsonString) {
    if (!jsonString) throw new Error('Berkas cadangan kosong.');
    let parsed;
    try {
      parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      throw new Error('Format berkas JSON tidak valid.');
    }

    const payload = parsed.data || parsed;
    if (!payload.profile && !payload.teachers && !payload.facilities) {
      throw new Error('Struktur data cadangan tidak sesuai.');
    }

    if (payload.profile) this.data.profile = { ...this.data.profile, ...payload.profile };
    if (Array.isArray(payload.teachers)) this.data.teachers = payload.teachers;
    if (Array.isArray(payload.facilities)) this.data.facilities = payload.facilities;
    if (Array.isArray(payload.activities)) this.data.activities = payload.activities;
    if (Array.isArray(payload.categories)) this.data.categories = payload.categories;
    if (Array.isArray(payload.gallery)) this.data.gallery = payload.gallery;
    if (Array.isArray(payload.testimonials)) this.data.testimonials = payload.testimonials;
    if (Array.isArray(payload.academicCalendar)) this.data.academicCalendar = payload.academicCalendar;
    if (Array.isArray(payload.schoolHabits)) this.data.schoolHabits = payload.schoolHabits;
    if (Array.isArray(payload.comfortStandards)) this.data.comfortStandards = payload.comfortStandards;
    if (Array.isArray(payload.inquiries)) this.data.inquiries = payload.inquiries;
    if (payload.contact) this.data.contact = { ...this.data.contact, ...payload.contact };

    await this.save();
    await this.logAudit('PULIHKAN', 'Sistem', 'Memulihkan data dari berkas cadangan JSON');
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('schooldb-synced', { detail: this.data }));
    }
    return true;
  },

  async saveResetBaseline() {
    if (!this.data) return { success: false, error: 'Database belum diinisialisasi' };
    try {
      const baselineData = JSON.parse(JSON.stringify(this.data));
      // Exclude temporary logs from baseline snapshot
      delete baselineData.auditLogs;

      const meta = {
        timestamp: new Date().toISOString(),
        totalActivities: Array.isArray(baselineData.activities) ? baselineData.activities.length : 0,
        totalGallery: Array.isArray(baselineData.gallery) ? baselineData.gallery.length : 0,
        totalFacilities: Array.isArray(baselineData.facilities) ? baselineData.facilities.length : 0,
        totalTeachers: Array.isArray(baselineData.teachers) ? baselineData.teachers.length : 0,
        totalCalendar: Array.isArray(baselineData.academicCalendar) ? baselineData.academicCalendar.length : 0,
        schoolName: baselineData.profile ? baselineData.profile.name : 'SDN Ngeposari 2'
      };

      const payload = {
        meta,
        data: baselineData
      };

      if (idbStore) {
        await idbStore.set('resetBaseline', payload);
      }
      try {
        localStorage.setItem('sdn2_reset_baseline_meta', JSON.stringify(meta));
        localStorage.setItem('sdn2_reset_baseline', JSON.stringify(baselineData));
      } catch (e) {
        console.warn('localStorage quota warning when caching baseline, IndexedDB remains active:', e);
      }

      await this.logAudit('BASELINE', 'Sistem', `Memperbarui titik reset baseline dengan ${meta.totalActivities} kegiatan dan ${meta.totalGallery} foto dokumentasi`);
      return { success: true, meta };
    } catch (err) {
      console.error('Error saving reset baseline:', err);
      return { success: false, error: err.message };
    }
  },

  async getResetBaselineInfo() {
    try {
      let payload = null;
      if (idbStore) {
        payload = await idbStore.get('resetBaseline');
      }
      if (!payload) {
        const raw = localStorage.getItem('sdn2_reset_baseline');
        const rawMeta = localStorage.getItem('sdn2_reset_baseline_meta');
        if (raw) {
          try {
            payload = {
              meta: rawMeta ? JSON.parse(rawMeta) : null,
              data: JSON.parse(raw)
            };
          } catch (e) {}
        }
      }
      return payload && payload.meta ? payload.meta : null;
    } catch (e) {
      return null;
    }
  },

  async reset(toFactoryDefault = false) {
    let targetData = null;
    let detailMsg = '';
    let isCustomBaseline = false;

    if (!toFactoryDefault) {
      // Check if custom baseline exists
      let customPayload = null;
      if (idbStore) {
        customPayload = await idbStore.get('resetBaseline');
      }
      if (!customPayload) {
        const raw = localStorage.getItem('sdn2_reset_baseline');
        if (raw) {
          try {
            customPayload = { data: JSON.parse(raw) };
          } catch (e) {}
        }
      }

      if (customPayload && customPayload.data) {
        targetData = JSON.parse(JSON.stringify(customPayload.data));
        detailMsg = 'Mereset database ke titik simpan baseline sekolah (seluruh kegiatan dan aset kustom terjaga)';
        isCustomBaseline = true;
      }
    }

    if (!targetData) {
      targetData = JSON.parse(JSON.stringify(INITIAL_DATA));
      detailMsg = 'Mereset database ke data awal bawaan sistem';
    }

    this.data = targetData;
    this.data.auditLogs = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'RESET',
        entity: 'Sistem',
        detail: detailMsg,
        user: 'Administrator'
      }
    ];

    await this.save();
    console.log('[SchoolDB] Database reset completed:', detailMsg);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('schooldb-synced', { detail: this.data }));
    }
    return { data: this.data, isCustomBaseline };
  },

  // GETTERS
  getProfile() {
    if (!this.data) {
      return (typeof INITIAL_DATA !== 'undefined' && INITIAL_DATA.profile) 
        ? INITIAL_DATA.profile 
        : { name: 'SDN Ngeposari 2', tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan', logo: 'images/logo.webp' };
    }
    return this.data.profile;
  },

  getFacilities() {
    if (!this.data) {
      return (typeof INITIAL_DATA !== 'undefined' && Array.isArray(INITIAL_DATA.facilities)) ? INITIAL_DATA.facilities : [];
    }
    return this.data.facilities;
  },

  getCategories() {
    if (!this.data) {
      return (typeof INITIAL_DATA !== 'undefined' && INITIAL_DATA.categories) ? [...INITIAL_DATA.categories] : ['Akademik', 'Kepramukaan', 'Ekstrakurikuler', 'Prestasi', 'Sosial & Lingkungan', 'Umum'];
    }
    if (!Array.isArray(this.data.categories) || this.data.categories.length === 0) {
      this.data.categories = (typeof INITIAL_DATA !== 'undefined' && INITIAL_DATA.categories) ? [...INITIAL_DATA.categories] : ['Akademik', 'Kepramukaan', 'Ekstrakurikuler', 'Prestasi', 'Sosial & Lingkungan', 'Umum'];
    }
    return this.data.categories;
  },

  async addCategory(name) {
    if (!name || typeof name !== 'string') throw new Error('Nama kategori tidak boleh kosong.');
    const sanitized = this.sanitizeText(name);
    if (!sanitized) throw new Error('Nama kategori tidak valid.');
    const categories = this.getCategories();
    const norm = this.normalizeName(sanitized);
    if (categories.some(c => this.normalizeName(c) === norm)) {
      throw new Error(`Kategori "${sanitized}" sudah terdaftar.`);
    }
    if (!Array.isArray(this.data.categories)) this.data.categories = [...categories];
    this.data.categories.push(sanitized);
    await this.save();
    await this.logAudit('TAMBAH', 'Kategori', `Menambahkan kategori "${sanitized}"`);
    return sanitized;
  },

  async deleteCategory(name) {
    if (!name || typeof name !== 'string') return false;
    const categories = this.getCategories();
    const norm = this.normalizeName(name);
    const initialLen = categories.length;
    this.data.categories = categories.filter(c => this.normalizeName(c) !== norm);
    if (this.data.categories.length !== initialLen) {
      await this.save();
      await this.logAudit('HAPUS', 'Kategori', `Menghapus kategori "${name}"`);
      return true;
    }
    return false;
  },

  getActivities() {
    if (!this.data || !Array.isArray(this.data.activities)) return [];
    return [...this.data.activities].map(act => {
      try {
        const stored = localStorage.getItem(`act_views_${act.id}`);
        if (stored !== null) {
          const count = parseInt(stored, 10);
          if (!isNaN(count)) act.views = count;
        }
      } catch (e) {}
      return act;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async incrementActivityViews(id) {
    if (!this.data || !Array.isArray(this.data.activities)) return 0;
    const act = this.data.activities.find(a => String(a.id) === String(id));
    if (!act) return 0;

    const now = Date.now();
    const lastViewKey = `last_view_ts_${id}`;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const lastView = parseInt(sessionStorage.getItem(lastViewKey) || '0', 10);
        // 800ms debounce to prevent instant double-trigger on reload while counting genuine user visits
        if (now - lastView < 800) {
          return typeof act.views === 'number' ? act.views : 0;
        }
        sessionStorage.setItem(lastViewKey, String(now));
      }
    } catch (e) {}

    // Read latest from localStorage if available to ensure synchronous accuracy across pages
    let currentViews = (typeof act.views === 'number' && !isNaN(act.views)) ? act.views : 0;
    try {
      const stored = localStorage.getItem(`act_views_${id}`);
      if (stored !== null) {
        const count = parseInt(stored, 10);
        if (!isNaN(count) && count > currentViews) currentViews = count;
      }
    } catch (e) {}

    act.views = currentViews + 1;

    // Immediately write to localStorage synchronously
    try {
      localStorage.setItem(`act_views_${id}`, String(act.views));
    } catch (e) {}

    await this.save();
    return act.views;
  },

  getTotalActivityViews() {
    if (!this.data || !Array.isArray(this.data.activities)) return 0;
    return this.data.activities.reduce((acc, act) => acc + (typeof act.views === 'number' && !isNaN(act.views) ? act.views : 0), 0);
  },

  getNews() {
    return this.getActivities();
  },

  getGallery() {
    if (!this.data) {
      return (typeof INITIAL_DATA !== 'undefined' && Array.isArray(INITIAL_DATA.gallery)) ? INITIAL_DATA.gallery : [];
    }
    return this.data.gallery;
  },

  getContact() {
    if (!this.data) {
      return (typeof INITIAL_DATA !== 'undefined' && INITIAL_DATA.contact) 
        ? INITIAL_DATA.contact 
        : { address: 'Mojo RT 01 / RW 13, Ngeposari, Semanu, Gunungkidul, DIY 55893', phone: '0812-3456-7890', email: 'sdngeposari2semanu@gmail.com' };
    }
    return this.data.contact;
  },

  getCalendar() {
    return this.data.calendar || INITIAL_DATA.calendar;
  },

  getTeachers() {
    return this.data.teachers || INITIAL_DATA.teachers;
  },

  // SETTERS / UPDATERS WITH VALIDATION & AUDIT LOGGING
  async updateProfile(profileData) {
    const sanitized = {
      name: this.sanitizeText(profileData.name || this.data.profile.name),
      tagline: this.sanitizeText(profileData.tagline || this.data.profile.tagline),
      description: this.sanitizeText(profileData.description || this.data.profile.description),
      history: this.sanitizeText(profileData.history || this.data.profile.history),
      vision: this.sanitizeText(profileData.vision || this.data.profile.vision).slice(0, 300),
      missions: Array.isArray(profileData.missions) ? profileData.missions.slice(0, 10).map(m => {
        let clean = this.sanitizeText(m).slice(0, 500);
        return clean.replace(/(\S{35})/g, '$1 ').trim();
      }) : this.data.profile.missions,
      logo: profileData.logo || this.data.profile.logo,
      hero: profileData.hero || this.data.profile.hero,
      principalName: this.sanitizeText(profileData.principalName || this.data.profile.principalName || 'Sumarni, S.Pd.SD., M.Pd.'),
      principalRole: this.sanitizeText(profileData.principalRole || this.data.profile.principalRole || 'Kepala Sekolah SD Negeri 2 Ngeposari'),
      principalImage: profileData.principalImage || this.data.profile.principalImage || '',
      principalGreeting: this.sanitizeText(profileData.principalGreeting !== undefined ? profileData.principalGreeting : (this.data.profile.principalGreeting || ''))
    };

    this.data.profile = { ...this.data.profile, ...sanitized };
    await this.save();
    await this.logAudit('UBAH', 'Profil', `Memperbarui profil sekolah "${sanitized.name}"`);
  },

  async updateContact(contactData) {
    const sanitized = {
      address: this.sanitizeText(contactData.address || this.data.contact.address),
      phone: this.sanitizeText(contactData.phone || this.data.contact.phone),
      email: this.sanitizeText(contactData.email || this.data.contact.email),
      maps: contactData.maps || this.data.contact.maps,
      facebook: this.sanitizeText(contactData.facebook || ''),
      instagram: this.sanitizeText(contactData.instagram || ''),
      youtube: this.sanitizeText(contactData.youtube || '')
    };

    this.data.contact = { ...this.data.contact, ...sanitized };
    await this.save();
    await this.logAudit('UBAH', 'Kontak', 'Memperbarui informasi kontak dan media sosial');
  },

  normalizeName(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  },

  // Facilities CRUD
  async addFacility(facility) {
    if (!Array.isArray(this.data.facilities)) this.data.facilities = [];
    const name = this.sanitizeText(facility.name || 'Fasilitas Baru');
    const desc = this.sanitizeText(facility.description || '');

    const normName = this.normalizeName(name);
    const isDuplicate = this.data.facilities.some(f => this.normalizeName(f.name) === normName);
    if (isDuplicate) {
      throw new Error('Fasilitas dengan nama tersebut sudah tersedia.');
    }

    const newFacility = {
      id: 'f_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      description: desc,
      image: facility.image || generateSVGPlaceholder('general', name)
    };
    this.data.facilities.push(newFacility);
    await this.save();
    await this.logAudit('TAMBAH', 'Fasilitas', `Menambahkan fasilitas "${newFacility.name}"`);
    return newFacility;
  },

  // --- Generic Collection Helpers (Compact & Reusable) ---
  async _deleteItem(collectionKey, id, auditModule, labelField = 'name') {
    if (!Array.isArray(this.data[collectionKey])) return false;
    const target = this.data[collectionKey].find(item => item && String(item.id) === String(id));
    if (!target) return false;

    const deletedImage = target.image;
    this.data[collectionKey] = this.data[collectionKey].filter(item => item && String(item.id) !== String(id));

    // Global Footage Deletion Cascade: If item has an authentic footage/image, purge across all other collections
    if (deletedImage && typeof deletedImage === 'string' && !deletedImage.includes('logo.') && !deletedImage.startsWith('data:image/svg+xml')) {
      this._purgeFootageEverywhere(deletedImage, collectionKey, target);
    }

    await this.save();
    const label = target[labelField] || target.title || target.caption || id;
    await this.logAudit('HAPUS', auditModule, `Menghapus ${auditModule.toLowerCase()} "${label}"`);
    return true;
  },

  _purgeFootageEverywhere(imageUrl, sourceCollection, target = {}) {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    const normUrl = imageUrl.trim().toLowerCase();
    const targetLabel = (target.name || target.title || target.caption || '').trim().toLowerCase();

    // 1. Purge from gallery if deleted from facilities, activities, or teachers
    if (sourceCollection !== 'gallery' && Array.isArray(this.data.gallery)) {
      this.data.gallery = this.data.gallery.filter(g => {
        if (!g || !g.image) return true;
        const gUrl = g.image.trim().toLowerCase();
        if (gUrl === normUrl) return false;
        if (targetLabel && g.caption && g.caption.toLowerCase().includes(targetLabel)) return false;
        return true;
      });
    }

    // 2. Purge from facilities if deleted from gallery
    if (sourceCollection === 'gallery' && Array.isArray(this.data.facilities)) {
      this.data.facilities = this.data.facilities.filter(f => {
        if (!f || !f.image) return true;
        const fUrl = f.image.trim().toLowerCase();
        if (fUrl === normUrl) return false;
        if (targetLabel && f.name && targetLabel.includes(f.name.toLowerCase())) return false;
        return true;
      });
    }

    // 3. Purge from activities if deleted from gallery
    if (sourceCollection === 'gallery' && Array.isArray(this.data.activities)) {
      this.data.activities = this.data.activities.filter(a => {
        if (!a || !a.image) return true;
        const aUrl = a.image.trim().toLowerCase();
        if (aUrl === normUrl) return false;
        if (targetLabel && a.title && targetLabel.includes(a.title.toLowerCase())) return false;
        return true;
      });
    }
  },

  async _updateItem(collectionKey, id, updatedFields, auditModule, labelField = 'name') {
    if (!Array.isArray(this.data[collectionKey])) {
      this.data[collectionKey] = (INITIAL_DATA && INITIAL_DATA[collectionKey]) ? [...INITIAL_DATA[collectionKey]] : [];
    }
    const index = this.data[collectionKey].findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;

    this.data[collectionKey][index] = { ...this.data[collectionKey][index], ...updatedFields };
    await this.save();
    const label = this.data[collectionKey][index][labelField] || this.data[collectionKey][index].title || this.data[collectionKey][index].caption || id;
    await this.logAudit('UBAH', auditModule, `Memperbarui ${auditModule.toLowerCase()} "${label}"`);
    return true;
  },

  async updateFacility(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.name !== undefined) {
      sanitized.name = this.sanitizeText(updatedFields.name);
      const normName = this.normalizeName(sanitized.name);
      const isDuplicate = (this.data.facilities || []).some(f => String(f.id) !== String(id) && this.normalizeName(f.name) === normName);
      if (isDuplicate) throw new Error('Fasilitas dengan nama tersebut sudah tersedia.');
    }
    if (updatedFields.description !== undefined) sanitized.description = this.sanitizeText(updatedFields.description);
    if (updatedFields.image) sanitized.image = updatedFields.image;
    return this._updateItem('facilities', id, sanitized, 'Fasilitas', 'name');
  },

  async deleteFacility(id) {
    return this._deleteItem('facilities', id, 'Fasilitas', 'name');
  },

  // Activities CRUD
  async addActivity(activity) {
    if (!Array.isArray(this.data.activities)) this.data.activities = [];
    const title = this.sanitizeText(activity.title || 'Kegiatan Baru');
    const date = activity.date || new Date().toISOString().split('T')[0];

    const normTitle = this.normalizeName(title);
    const isDuplicate = this.data.activities.some(a => this.normalizeName(a.title) === normTitle);
    if (isDuplicate) throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');

    const newActivity = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      date: date,
      category: this.sanitizeText(activity.category || 'Umum'),
      views: typeof activity.views === 'number' ? activity.views : 0,
      excerpt: this.sanitizeText(activity.excerpt || activity.summary || ''),
      content: this.sanitizeHTML(activity.content || ''),
      image: activity.image || 'images/default_activity.webp'
    };
    this.data.activities.push(newActivity);
    await this.save();
    await this.logAudit('TAMBAH', 'Kegiatan', `Menambahkan berita/kegiatan "${newActivity.title}"`);
    return newActivity;
  },

  async updateActivity(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.title !== undefined) {
      sanitized.title = this.sanitizeText(updatedFields.title);
      const normTitle = this.normalizeName(sanitized.title);
      const isDuplicate = (this.data.activities || []).some(a => String(a.id) !== String(id) && this.normalizeName(a.title) === normTitle);
      if (isDuplicate) throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');
    }
    if (updatedFields.date !== undefined) sanitized.date = updatedFields.date;
    if (updatedFields.category !== undefined) sanitized.category = this.sanitizeText(updatedFields.category);
    if (updatedFields.views !== undefined && typeof updatedFields.views === 'number') sanitized.views = updatedFields.views;
    if (updatedFields.excerpt !== undefined) sanitized.excerpt = this.sanitizeText(updatedFields.excerpt);
    if (updatedFields.content !== undefined) sanitized.content = this.sanitizeHTML(updatedFields.content);
    if (updatedFields.image) sanitized.image = updatedFields.image;
    return this._updateItem('activities', id, sanitized, 'Kegiatan', 'title');
  },

  async duplicateActivity(id) {
    const orig = (this.data.activities || []).find(a => String(a.id) === String(id));
    if (!orig) throw new Error('Kegiatan tidak ditemukan.');
    const copy = {
      ...orig,
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: orig.title + ' (Salinan)',
      date: new Date().toISOString().split('T')[0]
    };
    this.data.activities.unshift(copy);
    await this.save();
    await this.logAudit('TAMBAH', 'Kegiatan', `Menduplikasi kegiatan "${copy.title}"`);
    return copy;
  },

  async deleteActivity(id) {
    return this._deleteItem('activities', id, 'Kegiatan', 'title');
  },

  // Gallery CRUD
  async addGalleryItem(item) {
    if (!Array.isArray(this.data.gallery)) this.data.gallery = [];
    const caption = this.sanitizeText(item.caption || 'Foto Galeri');
    const newItem = {
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      caption: caption,
      image: item.image || generateSVGPlaceholder('general', caption)
    };
    this.data.gallery.push(newItem);
    await this.save();
    await this.logAudit('TAMBAH', 'Galeri', `Menambahkan foto galeri "${newItem.caption}"`);
    return newItem;
  },

  async updateGalleryItem(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.caption !== undefined) sanitized.caption = this.sanitizeText(updatedFields.caption);
    if (updatedFields.image) sanitized.image = updatedFields.image;
    return this._updateItem('gallery', id, sanitized, 'Galeri', 'caption');
  },

  async deleteGalleryItem(id) {
    return this._deleteItem('gallery', id, 'Galeri', 'caption');
  },

  // Teachers CRUD
  async addTeacher(teacher) {
    if (!Array.isArray(this.data.teachers)) this.data.teachers = [];
    const name = this.sanitizeText(teacher.name || 'Guru Baru');
    const role = this.sanitizeText(teacher.role || 'Tenaga Pendidik');

    const normName = this.normalizeName(name);
    const isDuplicate = this.data.teachers.some(t => this.normalizeName(t.name) === normName);
    if (isDuplicate) throw new Error('Guru dengan nama tersebut sudah terdaftar.');

    const newTeacher = {
      id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      role: role,
      image: teacher.image || generateSVGPlaceholder('class', name)
    };
    this.data.teachers.push(newTeacher);
    await this.save();
    await this.logAudit('TAMBAH', 'Guru', `Menambahkan guru/staf "${newTeacher.name}" (${newTeacher.role})`);
    return newTeacher;
  },

  async updateTeacher(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.name !== undefined) {
      sanitized.name = this.sanitizeText(updatedFields.name);
      const normName = this.normalizeName(sanitized.name);
      const isDuplicate = (this.data.teachers || []).some(t => String(t.id) !== String(id) && this.normalizeName(t.name) === normName);
      if (isDuplicate) throw new Error('Guru dengan nama tersebut sudah terdaftar.');
    }
    if (updatedFields.role !== undefined) sanitized.role = this.sanitizeText(updatedFields.role);
    if (updatedFields.image) sanitized.image = updatedFields.image;
    return this._updateItem('teachers', id, sanitized, 'Guru', 'name');
  },

  async deleteTeacher(id) {
    return this._deleteItem('teachers', id, 'Guru', 'name');
  },

  // Testimonials CRUD
  getTestimonials() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.testimonials) ? [...INITIAL_DATA.testimonials] : [];
    if (!Array.isArray(this.data.testimonials)) {
      this.data.testimonials = (INITIAL_DATA && INITIAL_DATA.testimonials) ? JSON.parse(JSON.stringify(INITIAL_DATA.testimonials)) : [];
    }
    return this.data.testimonials;
  },

  async addTestimonial(item) {
    if (!Array.isArray(this.data.testimonials)) this.data.testimonials = [];
    const name = this.sanitizeText(item.name || 'Wali Murid');
    const role = this.sanitizeText(item.role || 'Orang Tua Wali');
    const quote = this.sanitizeText(item.quote || '');

    // Rule: Name and role can be identical, but quote (pesan) must be unique
    const normQuote = quote.trim().toLowerCase();
    const isDuplicateQuote = (this.data.testimonials || []).some(t => (t.quote || '').trim().toLowerCase() === normQuote);
    if (isDuplicateQuote) {
      throw new Error('Pesan kesan & apresiasi ini sudah ada di daftar. Pesan tidak boleh sama persis.');
    }

    const isMale = (name + ' ' + role).toLowerCase().match(/\b(bapak|bpk|ayah|pak|pria|laki|sugiyanto)\b/);
    const defaultAvatar = isMale ? 'images/avatars/silhouette-male.svg' : 'images/avatars/silhouette-female.svg';

    const newTesti = {
      id: 'testi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      role: role,
      quote: quote,
      avatar: item.avatar || defaultAvatar
    };
    this.data.testimonials.push(newTesti);
    await this.save();
    await this.logAudit('TAMBAH', 'Kesan & Apresiasi', `Menambahkan kesan dari "${newTesti.name}"`);
    return newTesti;
  },

  async updateTestimonial(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.name !== undefined) sanitized.name = this.sanitizeText(updatedFields.name);
    if (updatedFields.role !== undefined) sanitized.role = this.sanitizeText(updatedFields.role);
    if (updatedFields.quote !== undefined) {
      sanitized.quote = this.sanitizeText(updatedFields.quote);
      const normQuote = sanitized.quote.trim().toLowerCase();
      const isDuplicateQuote = (this.data.testimonials || []).some(t => String(t.id) !== String(id) && (t.quote || '').trim().toLowerCase() === normQuote);
      if (isDuplicateQuote) {
        throw new Error('Pesan kesan & apresiasi ini sudah ada di daftar. Pesan tidak boleh sama persis.');
      }
    }
    if (updatedFields.avatar) sanitized.avatar = updatedFields.avatar;
    return this._updateItem('testimonials', id, sanitized, 'Kesan & Apresiasi', 'name');
  },

  async deleteTestimonial(id) {
    return this._deleteItem('testimonials', id, 'Kesan & Apresiasi', 'name');
  },

  // Academic Calendar CRUD
  getCalendar() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.academicCalendar) ? [...INITIAL_DATA.academicCalendar] : [];
    if (!Array.isArray(this.data.academicCalendar)) {
      this.data.academicCalendar = (INITIAL_DATA && INITIAL_DATA.academicCalendar) ? JSON.parse(JSON.stringify(INITIAL_DATA.academicCalendar)) : [];
    }
    return this.data.academicCalendar;
  },

  getCalendarEvents() {
    return this.getCalendar();
  },

  async addCalendarItem(item) {
    if (!Array.isArray(this.data.academicCalendar)) this.data.academicCalendar = [];
    const title = this.sanitizeText(item.title || 'Agenda Baru');
    const date = this.sanitizeText(item.date || '01');
    const month = this.sanitizeText(item.month || 'JAN').toUpperCase();
    const desc = this.sanitizeText(item.desc || item.description || '');

    const newItem = {
      id: 'cal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      date: date,
      month: month,
      desc: desc
    };
    this.data.academicCalendar.push(newItem);
    await this.save();
    await this.logAudit('TAMBAH', 'Kalender Akademik', `Menambahkan agenda "${newItem.title}"`);
    return newItem;
  },

  async updateCalendarItem(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.title !== undefined) sanitized.title = this.sanitizeText(updatedFields.title);
    if (updatedFields.date !== undefined) sanitized.date = this.sanitizeText(updatedFields.date);
    if (updatedFields.month !== undefined) sanitized.month = this.sanitizeText(updatedFields.month).toUpperCase();
    if (updatedFields.desc !== undefined) sanitized.desc = this.sanitizeText(updatedFields.desc);
    if (updatedFields.description !== undefined) sanitized.desc = this.sanitizeText(updatedFields.description);
    return this._updateItem('academicCalendar', id, sanitized, 'Kalender Akademik', 'title');
  },

  async deleteCalendarItem(id) {
    return this._deleteItem('academicCalendar', id, 'Kalender Akademik', 'title');
  },

  async deleteCalendarEvent(id) {
    return this.deleteCalendarItem(id);
  },

  // School Habits CRUD
  getHabits() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.schoolHabits) ? [...INITIAL_DATA.schoolHabits] : [];
    if (!Array.isArray(this.data.schoolHabits)) {
      this.data.schoolHabits = (INITIAL_DATA && INITIAL_DATA.schoolHabits) ? JSON.parse(JSON.stringify(INITIAL_DATA.schoolHabits)) : [];
    }
    return this.data.schoolHabits;
  },

  async addHabit(item) {
    if (!Array.isArray(this.data.schoolHabits)) this.data.schoolHabits = [];
    const title = this.sanitizeText(item.title || 'Pembiasaan Baru');
    const desc = this.sanitizeText(item.desc || item.description || '');
    const category = this.sanitizeText(item.category || 'Karakter');

    const newHabit = {
      id: 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      desc: desc,
      category: category
    };
    this.data.schoolHabits.push(newHabit);
    await this.save();
    await this.logAudit('TAMBAH', 'Pembiasaan Baik', `Menambahkan pembiasaan "${newHabit.title}"`);
    return newHabit;
  },

  async updateHabit(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.title !== undefined) sanitized.title = this.sanitizeText(updatedFields.title);
    if (updatedFields.desc !== undefined) sanitized.desc = this.sanitizeText(updatedFields.desc);
    if (updatedFields.description !== undefined) sanitized.desc = this.sanitizeText(updatedFields.description);
    if (updatedFields.category !== undefined) sanitized.category = this.sanitizeText(updatedFields.category);
    return this._updateItem('schoolHabits', id, sanitized, 'Pembiasaan Baik', 'title');
  },

  async deleteHabit(id) {
    return this._deleteItem('schoolHabits', id, 'Pembiasaan Baik', 'title');
  },

  // Comfort Standards CRUD
  getComfortStandards() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.comfortStandards) ? [...INITIAL_DATA.comfortStandards] : [];
    if (!Array.isArray(this.data.comfortStandards)) {
      this.data.comfortStandards = (INITIAL_DATA && INITIAL_DATA.comfortStandards) ? JSON.parse(JSON.stringify(INITIAL_DATA.comfortStandards)) : [];
    }
    return this.data.comfortStandards;
  },

  async addComfortStandard(item) {
    if (!Array.isArray(this.data.comfortStandards)) this.data.comfortStandards = [];
    const title = this.sanitizeText(item.title || 'Standar Kenyamanan Baru');
    const desc = this.sanitizeText(item.desc || item.description || '');

    // Rule: Title and description must both be unique
    const normTitle = this.normalizeName(title);
    const normDesc = desc.trim().toLowerCase();

    const isTitleDup = (this.data.comfortStandards || []).some(c => this.normalizeName(c.title) === normTitle);
    if (isTitleDup) {
      throw new Error(`Standar kenyamanan dengan judul "${title}" sudah ada.`);
    }

    const isDescDup = (this.data.comfortStandards || []).some(c => (c.desc || c.description || '').trim().toLowerCase() === normDesc);
    if (isDescDup) {
      throw new Error('Deskripsi standar kenyamanan tidak boleh sama dengan standar yang sudah ada.');
    }

    const newComfort = {
      id: 'comfort_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      desc: desc
    };
    this.data.comfortStandards.push(newComfort);
    await this.save();
    await this.logAudit('TAMBAH', 'Standar Kenyamanan', `Menambahkan standar kenyamanan "${newComfort.title}"`);
    return newComfort;
  },

  async updateComfortStandard(id, updatedFields) {
    const sanitized = {};
    if (updatedFields.title !== undefined) {
      sanitized.title = this.sanitizeText(updatedFields.title);
      const normTitle = this.normalizeName(sanitized.title);
      const isTitleDup = (this.data.comfortStandards || []).some(c => String(c.id) !== String(id) && this.normalizeName(c.title) === normTitle);
      if (isTitleDup) {
        throw new Error(`Standar kenyamanan dengan judul "${sanitized.title}" sudah ada.`);
      }
    }
    if (updatedFields.desc !== undefined || updatedFields.description !== undefined) {
      sanitized.desc = this.sanitizeText(updatedFields.desc !== undefined ? updatedFields.desc : updatedFields.description);
      const normDesc = sanitized.desc.trim().toLowerCase();
      const isDescDup = (this.data.comfortStandards || []).some(c => String(c.id) !== String(id) && (c.desc || c.description || '').trim().toLowerCase() === normDesc);
      if (isDescDup) {
        throw new Error('Deskripsi standar kenyamanan tidak boleh sama dengan standar yang sudah ada.');
      }
    }
    return this._updateItem('comfortStandards', id, sanitized, 'Standar Kenyamanan', 'title');
  },

  async deleteComfortStandard(id) {
    return this._deleteItem('comfortStandards', id, 'Standar Kenyamanan', 'title');
  },

  // Robust Date Parser for Cross-Browser ISO & Local Strings
  _parseDateSafe(d) {
    if (!d) return 0;
    if (typeof d === 'number') return d;
    const str = String(d).trim();
    // Normalize format like "2026-08-30 09:15" into ISO "2026-08-30T09:15" for Safari/WebKit compatibility
    const iso = str.includes('T') ? str : str.replace(' ', 'T');
    const t = new Date(iso).getTime();
    return isNaN(t) ? 0 : t;
  },

  // Inquiries CRUD
  getInquiries() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.inquiries) ? [...INITIAL_DATA.inquiries] : [];
    if (!Array.isArray(this.data.inquiries)) {
      this.data.inquiries = (INITIAL_DATA && INITIAL_DATA.inquiries) ? JSON.parse(JSON.stringify(INITIAL_DATA.inquiries)) : [];
    }
    return [...this.data.inquiries]
      .filter(item => item && typeof item === 'object')
      .sort((a, b) => this._parseDateSafe(b.date) - this._parseDateSafe(a.date));
  },

  getUnreadInquiriesCount() {
    return this.getInquiries().filter(i => i && !i.isRead).length;
  },

  async addInquiry(item) {
    if (!this.data) this.data = {};
    if (!Array.isArray(this.data.inquiries)) this.data.inquiries = [];
    const name = this.sanitizeText(item.name || 'Pengunjung');
    const email = this.sanitizeText(item.email || '');
    const phone = this.sanitizeText(item.phone || item.subject || '');
    const subject = this.sanitizeText(item.topic || item.subject || 'Konsultasi Umum');
    const message = this.sanitizeText(item.message || '');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newInquiry = {
      id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name, email, phone, subject, message,
      date: formattedDate,
      isRead: false
    };

    this.data.inquiries.unshift(newInquiry);
    await this.save();
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('inquiry-received', { detail: newInquiry }));
    }
    return newInquiry;
  },

  async markInquiryRead(id, isRead = true) {
    if (!this.data || !Array.isArray(this.data.inquiries)) return false;
    const index = this.data.inquiries.findIndex(i => i && String(i.id) === String(id));
    if (index !== -1) {
      this.data.inquiries[index].isRead = !!isRead;
      await this.save();
      return true;
    }
    return false;
  },

  async deleteInquiry(id) {
    return this._deleteItem('inquiries', id, 'Layanan Konsultasi', 'name');
  },

  // Admin Authentication & Password Management
  getAdminPassword() {
    try {
      const localPwd = (typeof localStorage !== 'undefined') ? localStorage.getItem('sdn2_admin_custom_password') : null;
      if (localPwd) return localPwd;
      if (this.data && this.data.adminPassword) return this.data.adminPassword;
    } catch (e) {}
    return 'asdd';
  },

  verifyAdminPassword(inputPwd) {
    if (!inputPwd || typeof inputPwd !== 'string') return false;
    return inputPwd.trim() === this.getAdminPassword().trim();
  },

  async updateAdminPassword(currentPassword, newPassword) {
    if (!this.verifyAdminPassword(currentPassword)) {
      throw new Error('Kata sandi saat ini tidak sesuai.');
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      throw new Error('Kata sandi baru minimal harus 6 karakter.');
    }
    const cleanNewPwd = newPassword.trim();
    if (cleanNewPwd === this.getAdminPassword()) {
      throw new Error('Kata sandi baru tidak boleh sama dengan kata sandi saat ini.');
    }

    if (!this.data) this.data = {};
    this.data.adminPassword = cleanNewPwd;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('sdn2_admin_custom_password', cleanNewPwd);
      }
    } catch (e) {}

    await this.save();
    await this.logAudit('UBAH', 'Keamanan', 'Memperbarui kata sandi administrator CMS');
    return true;
  }
};
