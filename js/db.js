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
}

// Initial Data Seed - Delegates to SchoolConstants if loaded, with local fallback
const INITIAL_DATA = (typeof window !== 'undefined' && window.SchoolConstants && window.SchoolConstants.INITIAL_DATA)
  ? window.SchoolConstants.INITIAL_DATA
  : {
      profile: {
        name: 'SDN 2 Ngeposari',
        tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
        description: 'SDN 2 Ngeposari berkomitmen untuk memberikan pendidikan berkualitas tinggi bagi anak-anak, memadukan keunggulan akademik dengan pembentukan karakter yang luhur dan kepedulian terhadap lingkungan sekitar.',
        history: 'SDN 2 Ngeposari didirikan untuk melayani kebutuhan pendidikan masyarakat Ngeposari dan sekitarnya.',
        vision: 'Terwujudnya peserta didik yang bertaqwa, berprestasi, berkarakter pancasila, dan peduli lingkungan.',
        missions: [
          'Melaksanakan pembelajaran yang aktif, kreatif, efektif, dan menyenangkan.',
          'Menumbuhkan penghayatan dan pengamalan terhadap ajaran agama yang dianut.',
          'Membentuk kepribadian yang berbudi pekerti luhur sesuai dengan nilai-nilai Pancasila.',
          'Mewujudkan lingkungan sekolah yang bersih, sehat, rindang, dan asri.',
          'Mengembangkan minat, bakat, dan kreativitas siswa melalui kegiatan ekstrakurikuler.'
        ],
        values: [
          { title: 'Bertaqwa', desc: 'Mengedepankan nilai-nilai religius dan ketuhanan.' },
          { title: 'Berkarakter', desc: 'Jujur, disiplin, bertanggung jawab, dan toleran.' },
          { title: 'Berprestasi', desc: 'Semangat belajar tinggi untuk meraih hasil terbaik.' },
          { title: 'Peduli Lingkungan', desc: 'Menjaga kebersihan dan kelestarian lingkungan sekolah.' }
        ],
        logo: 'images/logo.webp',
        hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=1000&fit=crop'
      },
      facilities: [
        { id: 'f1', name: 'Perpustakaan Pintar', description: 'Koleksi buku lengkap mulai dari buku pelajaran, cerita anak, hingga ensiklopedia menarik.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop' },
        { id: 'f2', name: 'Laboratorium Komputer', description: 'Ruang komputer modern dengan koneksi internet untuk menunjang literasi digital siswa.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop' },
        { id: 'f3', name: 'Lapangan Serbaguna', description: 'Area luas untuk kegiatan olahraga seperti senam, sepak bola, bulu tangkis, dan upacara bendera.', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=500&fit=crop' },
        { id: 'f4', name: 'Unit Kesehatan Sekolah (UKS)', description: 'Ruang kesehatan darurat yang dilengkapi dengan obat-obatan dasar dan perlengkapan P3K.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop' }
      ],
      activities: [
        { id: 'a1', title: 'Upacara bendera senin dan latihan pramuka', date: '2026-08-17', excerpt: 'Kegiatan rutin mingguan untuk meningkatkan kedisiplinan dan jiwa nasionalisme siswa.', content: 'Setiap hari Senin pagi, seluruh siswa dan guru melaksanakan Upacara Bendera dengan khidmat.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=960&h=540&fit=crop' },
        { id: 'a2', title: 'Lomba menulis kreatif dan mewarnai', date: '2026-08-10', excerpt: 'Wadah bagi siswa untuk menyalurkan bakat seni rupa, menulis indah, dan menuangkan imajinasi mereka.', content: 'Dalam rangka memperingati bulan bahasa, SDN 2 Ngeposari menyelenggarakan lomba menulis kreatif dan mewarnai tingkat kelas.', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=960&h=540&fit=crop' },
        { id: 'a3', title: 'Kerja bakti gerakan sekolah hijau', date: '2026-08-05', excerpt: 'Aksi peduli lingkungan bersama guru dan siswa menjaga kebersihan serta menanam pohon di sekolah.', content: 'Sebagai sekolah yang berbudaya lingkungan, SDN 2 Ngeposari mengadakan kerja bakti bulanan.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=960&h=540&fit=crop' }
      ],
      gallery: [
        { id: 'g1', caption: 'Belajar bersama di ruang kelas', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop' },
        { id: 'g2', caption: 'Upacara memperingati HUT RI ke-81', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop' },
        { id: 'g3', caption: 'Kegiatan membaca bersama di perpustakaan', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop' },
        { id: 'g4', caption: 'Praktik komputer dan literasi digital siswa', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop' },
        { id: 'g5', caption: 'Aktivitas olahraga di lapangan sekolah', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop' },
        { id: 'g6', caption: 'Kerja bakti taman dan tanaman apotek hidup', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop' }
      ],
      contact: {
        address: 'Jl. Karangmojo - Semanu, Ngeposari, Semanu, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55891',
        phone: '081234567890',
        email: 'info@sdn2ngeposari.sch.id',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.563823439498!2d110.6473063!3d-7.9734185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a372132eb2c0b%3A0xc48cd4d0ee0ca2df!2sSD%20Negeri%202%20Ngeposari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
        facebook: 'SDN 2 Ngeposari',
        instagram: 'sdn2ngeposari',
        youtube: 'SDN 2 Ngeposari Official'
      },
      teachers: [
        { id: 't1', name: 'Bapak Maryanto, M.Pd.', role: 'Kepala Sekolah', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop' },
        { id: 't2', name: 'Ibu Siti Nurhaliza, S.Pd.', role: 'Guru Kelas 1', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop' },
        { id: 't3', name: 'Bapak Bambang Wijaya, S.Pd.', role: 'Guru PJOK', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop' },
        { id: 't4', name: 'Ibu Tri Wahyuni, S.Pd.', role: 'Guru Pendidikan Agama', image: 'https://images.unsplash.com/photo-1580894732470-349f50e82e5b?w=600&h=600&fit=crop' }
      ]
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
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
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
        gallery: data.gallery || [],
        testimonials: data.testimonials || [],
        academicCalendar: data.academicCalendar || [],
        schoolHabits: data.schoolHabits || [],
        comfortStandards: data.comfortStandards || [],
        inquiries: data.inquiries || [],
        contact: data.contact || {},
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
        const localRaw = localStorage.getItem('sdn2_db_data');
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
        if (!this.data.profile.logo || this.data.profile.logo.startsWith('data:image/svg+xml')) {
          this.data.profile.logo = 'images/logo.webp';
        }
        this.data.contact = { ...INITIAL_DATA.contact, ...this.data.contact };
        if (!Array.isArray(this.data.facilities)) this.data.facilities = JSON.parse(JSON.stringify(INITIAL_DATA.facilities || []));
        if (!Array.isArray(this.data.activities)) this.data.activities = JSON.parse(JSON.stringify(INITIAL_DATA.activities || []));
        if (!Array.isArray(this.data.gallery)) this.data.gallery = JSON.parse(JSON.stringify(INITIAL_DATA.gallery || []));
        if (!Array.isArray(this.data.teachers)) this.data.teachers = JSON.parse(JSON.stringify(INITIAL_DATA.teachers || []));
        if (!Array.isArray(this.data.testimonials)) this.data.testimonials = JSON.parse(JSON.stringify(INITIAL_DATA.testimonials || []));
        if (!Array.isArray(this.data.academicCalendar)) this.data.academicCalendar = JSON.parse(JSON.stringify(INITIAL_DATA.academicCalendar || []));
        if (!Array.isArray(this.data.schoolHabits)) this.data.schoolHabits = JSON.parse(JSON.stringify(INITIAL_DATA.schoolHabits || []));
        if (!Array.isArray(this.data.comfortStandards)) this.data.comfortStandards = JSON.parse(JSON.stringify(INITIAL_DATA.comfortStandards || []));
        if (!Array.isArray(this.data.inquiries)) this.data.inquiries = JSON.parse(JSON.stringify(INITIAL_DATA.inquiries || []));
        if (!Array.isArray(this.data.categories)) this.data.categories = (INITIAL_DATA.categories ? [...INITIAL_DATA.categories] : ['Akademik', 'Kepramukaan', 'Ekstrakurikuler', 'Prestasi', 'Sosial & Lingkungan', 'Umum']);
        if (!Array.isArray(this.data.auditLogs)) this.data.auditLogs = [];
        await this.save();
      }

      this.isInitialized = true;
      console.log('Database initialized successfully with security rules.');

      // Initialize Cloud Sync in background
      CloudSyncManager.initFirebase();
      if (CloudSyncManager.isConfigured()) {
        this.syncFromCloud().catch(e => console.warn('[SchoolDB] Background cloud sync deferred:', e));
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
      } catch (e) {
        console.warn('LocalStorage backup quota exceeded or blocked.');
      }

      // Automatically sync changes to Cloud Firestore if connected
      if (CloudSyncManager.isConfigured()) {
        CloudSyncManager.syncToCloud(this.data).catch(err => console.warn('[SchoolDB] Async cloud push failed:', err));
      }
    } catch (err) {
      console.error('Error saving data to database:', err);
    }
  },

  async syncFromCloud() {
    const cloudData = await CloudSyncManager.syncFromCloud();
    if (cloudData) {
      if (cloudData.profile) this.data.profile = { ...this.data.profile, ...cloudData.profile };
      if (Array.isArray(cloudData.teachers)) this.data.teachers = cloudData.teachers;
      if (Array.isArray(cloudData.facilities)) this.data.facilities = cloudData.facilities;
      if (Array.isArray(cloudData.activities)) this.data.activities = cloudData.activities;
      if (Array.isArray(cloudData.categories)) this.data.categories = cloudData.categories;
      if (Array.isArray(cloudData.gallery)) this.data.gallery = cloudData.gallery;
      if (Array.isArray(cloudData.testimonials)) this.data.testimonials = cloudData.testimonials;
      if (Array.isArray(cloudData.academicCalendar)) this.data.academicCalendar = cloudData.academicCalendar;
      if (Array.isArray(cloudData.schoolHabits)) this.data.schoolHabits = cloudData.schoolHabits;
      if (Array.isArray(cloudData.comfortStandards)) this.data.comfortStandards = cloudData.comfortStandards;
      if (Array.isArray(cloudData.inquiries)) this.data.inquiries = cloudData.inquiries;
      if (cloudData.contact) this.data.contact = { ...this.data.contact, ...cloudData.contact };
      
      await idbStore.set('siteData', this.data);
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('schooldb-synced', { detail: this.data }));
      }
      return true;
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

  async reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.data.auditLogs = [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'RESET',
        entity: 'Sistem',
        detail: 'Mereset seluruh database ke pengaturan awal',
        user: 'Administrator'
      }
    ];
    await this.save();
    console.log('Database has been reset to defaults.');
    return this.data;
  },

  // GETTERS
  getProfile() {
    return this.data.profile;
  },

  getFacilities() {
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
    return [...this.data.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async incrementActivityViews(id) {
    if (!this.data || !Array.isArray(this.data.activities)) return 0;
    const act = this.data.activities.find(a => String(a.id) === String(id));
    if (!act) return 0;

    const viewedKey = `viewed_act_${id}`;
    try {
      if (typeof sessionStorage !== 'undefined') {
        if (sessionStorage.getItem(viewedKey)) {
          return typeof act.views === 'number' ? act.views : 0;
        }
        sessionStorage.setItem(viewedKey, 'true');
      }
    } catch (e) {}

    act.views = (typeof act.views === 'number' && !isNaN(act.views)) ? act.views + 1 : 1;
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
    return this.data.gallery;
  },

  getContact() {
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
      vision: this.sanitizeText(profileData.vision || this.data.profile.vision),
      missions: Array.isArray(profileData.missions) ? profileData.missions.map(m => this.sanitizeText(m)) : this.data.profile.missions,
      logo: profileData.logo || this.data.profile.logo,
      hero: profileData.hero || this.data.profile.hero
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

  async updateFacility(id, updatedFields) {
    if (!Array.isArray(this.data.facilities)) this.data.facilities = INITIAL_DATA.facilities;
    const index = this.data.facilities.findIndex(f => String(f.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.name !== undefined) {
        sanitized.name = this.sanitizeText(updatedFields.name);
        const normName = this.normalizeName(sanitized.name);
        const isDuplicate = this.data.facilities.some(f => String(f.id) !== String(id) && this.normalizeName(f.name) === normName);
        if (isDuplicate) {
          throw new Error('Fasilitas dengan nama tersebut sudah tersedia.');
        }
      }
      if (updatedFields.description !== undefined) sanitized.description = this.sanitizeText(updatedFields.description);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.facilities[index] = { ...this.data.facilities[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Fasilitas', `Memperbarui fasilitas "${this.data.facilities[index].name}"`);
      return true;
    }
    return false;
  },

  async deleteFacility(id) {
    if (!Array.isArray(this.data.facilities)) return false;
    const target = this.data.facilities.find(f => String(f.id) === String(id));
    if (!target) return false;

    this.data.facilities = this.data.facilities.filter(f => String(f.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Fasilitas', `Menghapus fasilitas "${target.name}"`);
    return true;
  },

  // Activities CRUD
  async addActivity(activity) {
    if (!Array.isArray(this.data.activities)) this.data.activities = [];
    const title = this.sanitizeText(activity.title || 'Kegiatan Baru');
    const date = activity.date || new Date().toISOString().split('T')[0];

    const normTitle = this.normalizeName(title);
    const isDuplicate = this.data.activities.some(a => this.normalizeName(a.title) === normTitle);
    if (isDuplicate) {
      throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');
    }

    const newActivity = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      date: date,
      category: this.sanitizeText(activity.category || 'Umum'),
      views: typeof activity.views === 'number' ? activity.views : 0,
      excerpt: this.sanitizeText(activity.excerpt || ''),
      content: this.sanitizeHTML(activity.content || ''),
      image: activity.image || generateSVGPlaceholder('general', title)
    };
    this.data.activities.push(newActivity);
    await this.save();
    await this.logAudit('TAMBAH', 'Kegiatan', `Menambahkan berita/kegiatan "${newActivity.title}"`);
    return newActivity;
  },

  async updateActivity(id, updatedFields) {
    if (!Array.isArray(this.data.activities)) this.data.activities = INITIAL_DATA.activities;
    const index = this.data.activities.findIndex(a => String(a.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.title !== undefined) {
        sanitized.title = this.sanitizeText(updatedFields.title);
        const normTitle = this.normalizeName(sanitized.title);
        const isDuplicate = this.data.activities.some(a => String(a.id) !== String(id) && this.normalizeName(a.title) === normTitle);
        if (isDuplicate) {
          throw new Error('Kegiatan dengan nama tersebut sudah tersedia.');
        }
      }
      if (updatedFields.date !== undefined) sanitized.date = updatedFields.date;
      if (updatedFields.category !== undefined) sanitized.category = this.sanitizeText(updatedFields.category);
      if (updatedFields.views !== undefined && typeof updatedFields.views === 'number') sanitized.views = updatedFields.views;
      if (updatedFields.excerpt !== undefined) sanitized.excerpt = this.sanitizeText(updatedFields.excerpt);
      if (updatedFields.content !== undefined) sanitized.content = this.sanitizeHTML(updatedFields.content);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.activities[index] = { ...this.data.activities[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Kegiatan', `Memperbarui berita/kegiatan "${this.data.activities[index].title}"`);
      return true;
    }
    return false;
  },

  async deleteActivity(id) {
    if (!Array.isArray(this.data.activities)) return false;
    const target = this.data.activities.find(a => String(a.id) === String(id));
    if (!target) return false;

    this.data.activities = this.data.activities.filter(a => String(a.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Kegiatan', `Menghapus berita/kegiatan "${target.title}"`);
    return true;
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
    if (!Array.isArray(this.data.gallery)) this.data.gallery = INITIAL_DATA.gallery;
    const index = this.data.gallery.findIndex(g => String(g.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.caption !== undefined) sanitized.caption = this.sanitizeText(updatedFields.caption);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.gallery[index] = { ...this.data.gallery[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Galeri', `Memperbarui foto galeri "${this.data.gallery[index].caption}"`);
      return true;
    }
    return false;
  },

  async deleteGalleryItem(id) {
    if (!Array.isArray(this.data.gallery)) return false;
    const target = this.data.gallery.find(g => String(g.id) === String(id));
    if (!target) return false;

    this.data.gallery = this.data.gallery.filter(g => String(g.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Galeri', `Menghapus foto galeri "${target.caption}"`);
    return true;
  },

  // Teachers CRUD
  async addTeacher(teacher) {
    if (!Array.isArray(this.data.teachers)) this.data.teachers = [];
    const name = this.sanitizeText(teacher.name || 'Guru Baru');
    const role = this.sanitizeText(teacher.role || 'Tenaga Pendidik');

    const normName = this.normalizeName(name);
    const isDuplicate = this.data.teachers.some(t => this.normalizeName(t.name) === normName);
    if (isDuplicate) {
      throw new Error('Guru dengan nama tersebut sudah terdaftar.');
    }

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
    if (!Array.isArray(this.data.teachers)) this.data.teachers = INITIAL_DATA.teachers;
    const index = this.data.teachers.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.name !== undefined) {
        sanitized.name = this.sanitizeText(updatedFields.name);
        const normName = this.normalizeName(sanitized.name);
        const isDuplicate = this.data.teachers.some(t => String(t.id) !== String(id) && this.normalizeName(t.name) === normName);
        if (isDuplicate) {
          throw new Error('Guru dengan nama tersebut sudah terdaftar.');
        }
      }
      if (updatedFields.role !== undefined) sanitized.role = this.sanitizeText(updatedFields.role);
      if (updatedFields.image !== undefined && updatedFields.image !== null && updatedFields.image !== '') {
        sanitized.image = updatedFields.image;
      }

      this.data.teachers[index] = { ...this.data.teachers[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Guru', `Memperbarui guru/staf "${this.data.teachers[index].name}"`);
      return true;
    }
    return false;
  },

  async deleteTeacher(id) {
    if (!Array.isArray(this.data.teachers)) return false;
    const target = this.data.teachers.find(t => String(t.id) === String(id));
    if (!target) return false;

    this.data.teachers = this.data.teachers.filter(t => String(t.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Guru', `Menghapus guru/staf "${target.name}"`);
    return true;
  },

  // ==========================================
  // Testimonials / Kesan & Apresiasi CRUD
  // ==========================================
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

    const newTesti = {
      id: 'testi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      role: role,
      quote: quote,
      avatar: item.avatar || generateSVGPlaceholder('class', name)
    };
    this.data.testimonials.push(newTesti);
    await this.save();
    await this.logAudit('TAMBAH', 'Kesan & Apresiasi', `Menambahkan kesan dari "${newTesti.name}"`);
    return newTesti;
  },

  async updateTestimonial(id, updatedFields) {
    if (!Array.isArray(this.data.testimonials)) this.data.testimonials = this.getTestimonials();
    const index = this.data.testimonials.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.name !== undefined) sanitized.name = this.sanitizeText(updatedFields.name);
      if (updatedFields.role !== undefined) sanitized.role = this.sanitizeText(updatedFields.role);
      if (updatedFields.quote !== undefined) sanitized.quote = this.sanitizeText(updatedFields.quote);
      if (updatedFields.avatar !== undefined && updatedFields.avatar !== null && updatedFields.avatar !== '') {
        sanitized.avatar = updatedFields.avatar;
      }

      this.data.testimonials[index] = { ...this.data.testimonials[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Kesan & Apresiasi', `Memperbarui kesan dari "${this.data.testimonials[index].name}"`);
      return true;
    }
    return false;
  },

  async deleteTestimonial(id) {
    if (!Array.isArray(this.data.testimonials)) return false;
    const target = this.data.testimonials.find(t => String(t.id) === String(id));
    if (!target) return false;

    this.data.testimonials = this.data.testimonials.filter(t => String(t.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Kesan & Apresiasi', `Menghapus kesan dari "${target.name}"`);
    return true;
  },

  // ==========================================
  // Academic Calendar / Agenda CRUD
  // ==========================================
  getCalendar() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.academicCalendar) ? [...INITIAL_DATA.academicCalendar] : [];
    if (!Array.isArray(this.data.academicCalendar)) {
      this.data.academicCalendar = (INITIAL_DATA && INITIAL_DATA.academicCalendar) ? JSON.parse(JSON.stringify(INITIAL_DATA.academicCalendar)) : [];
    }
    return this.data.academicCalendar;
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
    if (!Array.isArray(this.data.academicCalendar)) this.data.academicCalendar = this.getCalendar();
    const index = this.data.academicCalendar.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.title !== undefined) sanitized.title = this.sanitizeText(updatedFields.title);
      if (updatedFields.date !== undefined) sanitized.date = this.sanitizeText(updatedFields.date);
      if (updatedFields.month !== undefined) sanitized.month = this.sanitizeText(updatedFields.month).toUpperCase();
      if (updatedFields.desc !== undefined) sanitized.desc = this.sanitizeText(updatedFields.desc);
      if (updatedFields.description !== undefined) sanitized.desc = this.sanitizeText(updatedFields.description);

      this.data.academicCalendar[index] = { ...this.data.academicCalendar[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Kalender Akademik', `Memperbarui agenda "${this.data.academicCalendar[index].title}"`);
      return true;
    }
    return false;
  },

  async deleteCalendarItem(id) {
    if (!Array.isArray(this.data.academicCalendar)) return false;
    const target = this.data.academicCalendar.find(c => String(c.id) === String(id));
    if (!target) return false;

    this.data.academicCalendar = this.data.academicCalendar.filter(c => String(c.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Kalender Akademik', `Menghapus agenda "${target.title}"`);
    return true;
  },

  // ==========================================
  // School Habits & Culture CRUD
  // ==========================================
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
    if (!Array.isArray(this.data.schoolHabits)) this.data.schoolHabits = this.getHabits();
    const index = this.data.schoolHabits.findIndex(h => String(h.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.title !== undefined) sanitized.title = this.sanitizeText(updatedFields.title);
      if (updatedFields.desc !== undefined) sanitized.desc = this.sanitizeText(updatedFields.desc);
      if (updatedFields.description !== undefined) sanitized.desc = this.sanitizeText(updatedFields.description);
      if (updatedFields.category !== undefined) sanitized.category = this.sanitizeText(updatedFields.category);

      this.data.schoolHabits[index] = { ...this.data.schoolHabits[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Pembiasaan Baik', `Memperbarui pembiasaan "${this.data.schoolHabits[index].title}"`);
      return true;
    }
    return false;
  },

  async deleteHabit(id) {
    if (!Array.isArray(this.data.schoolHabits)) return false;
    const target = this.data.schoolHabits.find(h => String(h.id) === String(id));
    if (!target) return false;

    this.data.schoolHabits = this.data.schoolHabits.filter(h => String(h.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Pembiasaan Baik', `Menghapus pembiasaan "${target.title}"`);
    return true;
  },

  // ==========================================
  // Comfort & Safety Standards CRUD
  // ==========================================
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
    if (!Array.isArray(this.data.comfortStandards)) this.data.comfortStandards = this.getComfortStandards();
    const index = this.data.comfortStandards.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      const sanitized = {};
      if (updatedFields.title !== undefined) sanitized.title = this.sanitizeText(updatedFields.title);
      if (updatedFields.desc !== undefined) sanitized.desc = this.sanitizeText(updatedFields.desc);
      if (updatedFields.description !== undefined) sanitized.desc = this.sanitizeText(updatedFields.description);

      this.data.comfortStandards[index] = { ...this.data.comfortStandards[index], ...sanitized };
      await this.save();
      await this.logAudit('UBAH', 'Standar Kenyamanan', `Memperbarui standar kenyamanan "${this.data.comfortStandards[index].title}"`);
      return true;
    }
    return false;
  },

  async deleteComfortStandard(id) {
    if (!Array.isArray(this.data.comfortStandards)) return false;
    const target = this.data.comfortStandards.find(c => String(c.id) === String(id));
    if (!target) return false;

    this.data.comfortStandards = this.data.comfortStandards.filter(c => String(c.id) !== String(id));
    await this.save();
    await this.logAudit('HAPUS', 'Standar Kenyamanan', `Menghapus standar kenyamanan "${target.title}"`);
    return true;
  },

  // ==========================================
  // Consultation Inquiries / Kotak Pesan Masuk CRUD
  // ==========================================
  getInquiries() {
    if (!this.data) return (INITIAL_DATA && INITIAL_DATA.inquiries) ? [...INITIAL_DATA.inquiries] : [];
    if (!Array.isArray(this.data.inquiries)) {
      this.data.inquiries = (INITIAL_DATA && INITIAL_DATA.inquiries) ? JSON.parse(JSON.stringify(INITIAL_DATA.inquiries)) : [];
    }
    return [...this.data.inquiries].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  },

  getUnreadInquiriesCount() {
    const list = this.getInquiries();
    return list.filter(i => !i.isRead).length;
  },

  async addInquiry(item) {
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
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
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
    if (!Array.isArray(this.data.inquiries)) return false;
    const index = this.data.inquiries.findIndex(i => String(i.id) === String(id));
    if (index !== -1) {
      this.data.inquiries[index].isRead = isRead;
      await this.save();
      return true;
    }
    return false;
  },

  async deleteInquiry(id) {
    if (!Array.isArray(this.data.inquiries)) return false;
    const initialLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => String(i.id) !== String(id));
    if (this.data.inquiries.length !== initialLen) {
      await this.save();
      await this.logAudit('HAPUS', 'Layanan Konsultasi', 'Menghapus pesan konsultasi masuk');
      return true;
    }
    return false;
  }
};
