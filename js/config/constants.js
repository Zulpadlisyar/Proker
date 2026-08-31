/**
 * SDN 2 Ngeposari - Global Constants & Initial Seed Data
 * Centralized single source of truth for configuration, navigation, and seed state.
 */

(function (root) {
  'use strict';

  const NAV_ITEMS = [
    { label: 'Beranda', href: 'index.html', id: 'nav-home' },
    { label: 'Tentang', href: 'tentang.html', id: 'nav-about' },
    { label: 'Fasilitas', href: 'fasilitas.html', id: 'nav-facilities' },
    { label: 'Kegiatan', href: 'kegiatan.html', id: 'nav-activities' },
    { label: 'Kontak', href: 'kontak.html', id: 'nav-contact' }
  ];

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB input limit
  const ITEMS_PER_PAGE = 10;

  const STORAGE_KEYS = {
    DB_NAME: 'SDN2NgeposariDB',
    DB_VERSION: 1,
    STORE_NAME: 'siteData',
    BACKUP_LOCAL: 'sdn2_db_data_backup',
    SESSION: 'sdn2_admin_session',
    LOCKOUT_UNTIL: 'sdn2_admin_lockout_until',
    FIREBASE_CONFIG: 'sdn2_firebase_config',
    LAST_CLOUD_SYNC: 'sdn2_last_cloud_sync'
  };

  const INITIAL_DATA = {
    profile: {
      name: 'SDN Ngeposari 2',
      tagline: 'Unggul, Berkarakter, dan Berbudaya Lingkungan',
      npsn: '20401876',
      nss: '101040310002',
      akreditasi: 'A',
      totalStudents: 143,
      totalTeachers: 8,
      totalPrincipal: 1,
      totalStaff: 2,
      totalClasses: 6,
      description: 'SDN Ngeposari 2 adalah sekolah dasar negeri terakreditasi A di Mojo RT 01 / RW 13, Ngeposari, Semanu, Gunungkidul yang berkomitmen mencetak generasi cerdas, berkarakter, dan berbudaya lingkungan.',
      history: 'SDN Ngeposari 2 (NPSN: 20401876, NSS: 101040310002) didirikan untuk melayani kebutuhan pendidikan dasar masyarakat di Dusun Mojo, Kalurahan Ngeposari, Kapanewon Semanu, Kabupaten Gunungkidul. Berada di lingkungan yang asri dan kondusif, sekolah ini berstatus negeri dengan akreditasi A, membina 143 siswa dengan didukung oleh 1 Kepala Sekolah, 8 Guru, dan 2 Tenaga Kependidikan dalam 6 ruang kelas pembelajaran aktif.',
      vision: '-',
      missions: [
        'Melaksanakan pembelajaran yang aktif, kreatif, efektif, dan menyenangkan berpusat pada potensi siswa.',
        'Menumbuhkan penghayatan dan pengamalan nilai-nilai keagamaan dan budi pekerti luhur.',
        'Membentuk kepribadian siswa yang berkarakter Pancasila, tangguh, jujur, dan bergotong royong.',
        'Mewujudkan lingkungan sekolah yang bersih, sehat, rindang, asri, dan ramah anak.',
        'Mengembangkan minat, bakat, literasi digital, dan kreativitas siswa melalui program intrakurikuler dan ekstrakurikuler.'
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
      {
        id: 'f1',
        name: 'Perpustakaan Pintar',
        description: 'Koleksi buku lengkap mulai dari buku pelajaran, cerita anak, hingga ensiklopedia menarik.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop'
      },
      {
        id: 'f2',
        name: 'Laboratorium Komputer',
        description: 'Ruang komputer modern dengan koneksi internet untuk menunjang literasi digital siswa.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'
      },
      {
        id: 'f3',
        name: 'Lapangan Serbaguna',
        description: 'Area luas untuk kegiatan olahraga seperti senam, sepak bola, bulu tangkis, dan upacara bendera.',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=500&fit=crop'
      },
      {
        id: 'f4',
        name: 'Unit Kesehatan Sekolah (UKS)',
        description: 'Ruang kesehatan darurat yang dilengkapi dengan obat-obatan dasar dan perlengkapan P3K.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop'
      }
    ],
    categories: [
      'Akademik',
      'Kepramukaan',
      'Ekstrakurikuler',
      'Prestasi',
      'Sosial & Lingkungan',
      'Umum'
    ],
    activities: [
      {
        id: 'a1',
        title: 'Upacara bendera senin dan latihan pramuka',
        date: '2026-08-17',
        category: 'Kepramukaan',
        views: 248,
        excerpt: 'Kegiatan rutin mingguan untuk meningkatkan kedisiplinan dan jiwa nasionalisme siswa.',
        content: 'Setiap hari Senin pagi, seluruh siswa dan guru melaksanakan Upacara Bendera dengan khidmat. Setelah itu, kegiatan dilanjutkan dengan latihan Pramuka pada sore harinya untuk melatih kemandirian, gotong royong, dan keterampilan dasar kepramukaan.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=960&h=540&fit=crop'
      },
      {
        id: 'a2',
        title: 'Lomba menulis kreatif dan mewarnai',
        date: '2026-08-10',
        category: 'Prestasi',
        views: 185,
        excerpt: 'Wadah bagi siswa untuk menyalurkan bakat seni rupa, menulis indah, dan menuangkan imajinasi mereka.',
        content: 'Dalam rangka memperingati bulan bahasa, SDN Ngeposari 2 menyelenggarakan lomba menulis kreatif dan mewarnai tingkat kelas. Kegiatan ini bertujuan merangsang motorik halus serta imajinasi kreatif anak sejak usia dini.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=960&h=540&fit=crop'
      },
      {
        id: 'a3',
        title: 'Kerja bakti gerakan sekolah hijau',
        date: '2026-08-05',
        category: 'Sosial & Lingkungan',
        views: 312,
        excerpt: 'Aksi peduli lingkungan bersama guru dan siswa menjaga kebersihan serta menanam pohon di sekolah.',
        content: 'Sebagai sekolah yang berbudaya lingkungan, SDN Ngeposari 2 mengadakan kerja bakti bulanan. Siswa diajarkan memilah sampah organik dan non-organik, serta melakukan penanaman bibit tanaman hias dan apotek hidup di area taman sekolah.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=960&h=540&fit=crop'
      }
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
      address: 'Mojo RT 01 / RW 13, Ngeposari, Semanu, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55893',
      phone: '081234567890',
      email: 'info@sdnngeposari2.sch.id',
      maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.563823439498!2d110.6473063!3d-7.9734185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a372132eb2c0b%3A0xc48cd4d0ee0ca2df!2sSD%20Negeri%202%20Ngeposari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
      facebook: 'SDN Ngeposari 2',
      instagram: 'sdnngeposari2',
      youtube: 'SDN Ngeposari 2 Official'
    },
    teachers: [
      { id: 't1', name: 'Bapak Maryanto, M.Pd.', role: 'Kepala Sekolah', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop' },
      { id: 't2', name: 'Ibu Siti Nurhaliza, S.Pd.', role: 'Guru Kelas 1', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop' },
      { id: 't3', name: 'Ibu Rahmawati, S.Pd.', role: 'Guru Kelas 2', image: 'https://images.unsplash.com/photo-1580894732413-87b1c31274cf?w=600&h=600&fit=crop' },
      { id: 't4', name: 'Bapak Supriyadi, S.Pd.', role: 'Guru Kelas 3', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop' },
      { id: 't5', name: 'Ibu Endang Lestari, S.Pd.', role: 'Guru Kelas 4', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop' },
      { id: 't6', name: 'Bapak Wahyudi, S.Pd.', role: 'Guru Kelas 5', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop' },
      { id: 't7', name: 'Ibu Sri Mulyani, S.Pd.', role: 'Guru Kelas 6', image: 'https://images.unsplash.com/photo-1580894732470-349f50e82e5b?w=600&h=600&fit=crop' },
      { id: 't8', name: 'Bapak Bambang Wijaya, S.Pd.', role: 'Guru PJOK', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop' },
      { id: 't9', name: 'Ibu Tri Wahyuni, S.Pd.I.', role: 'Guru Pendidikan Agama Islam', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop' },
      { id: 't10', name: 'Bapak Danang Prasetyo', role: 'Tenaga Administrasi Sekolah (TU)', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop' },
      { id: 't11', name: 'Bapak Sutrisno', role: 'Tenaga Kependidikan / Penjaga Sekolah', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop' }
    ],
    testimonials: [
      {
        id: 'testi-1',
        name: 'Ibu Purwanti',
        role: 'Orang Tua Wali Kelas IV',
        quote: 'Guru-guru di SDN Ngeposari 2 sangat sabar dan penuh perhatian. Anak saya jadi lebih percaya diri, sopan, dan bersemangat berangkat sekolah setiap pagi.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
      },
      {
        id: 'testi-2',
        name: 'Bapak Sugiyanto',
        role: 'Orang Tua Wali Kelas VI',
        quote: 'Fasilitas perpustakaan dan lab komputer sangat membantu anak-anak belajar teknologi secara sehat. Pembiasaan Pramuka-nya juga melatih kemandirian.',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'
      },
      {
        id: 'testi-3',
        name: 'Ibu Maryati',
        role: 'Orang Tua Wali Kelas II',
        quote: 'Lingkungan sekolah yang bersih dan hijau membuat anak-anak merasa nyaman. Komunikasi sekolah dengan orang tua wali siswa juga terjalin sangat dekat.',
        avatar: 'https://images.unsplash.com/photo-1580894732413-87b1c31274cf?w=100&h=100&fit=crop'
      }
    ],
    academicCalendar: [
      {
        id: 'cal-1',
        date: '15',
        month: 'SEP',
        title: 'Asesmen Nasional Berbasis Komputer (ANBK)',
        desc: 'Gladi bersih dan pelaksanaan ANBK kelas 5.'
      },
      {
        id: 'cal-2',
        date: '03',
        month: 'OKT',
        title: 'Perkemahan Sabtu Minggu (Persami) Pramuka',
        desc: 'Kegiatan kepramukaan kemandirian dan keterampilan di bumi perkemahan.'
      },
      {
        id: 'cal-3',
        date: '24',
        month: 'OKT',
        title: 'Penilaian Tengah Semester (PTS) Ganjil',
        desc: 'Evaluasi belajar semester ganjil seluruh jenjang kelas 1-6.'
      }
    ],
    schoolHabits: [
      {
        id: 'habit-1',
        title: 'Literasi 15 Menit',
        desc: 'Pembiasaan membaca buku sebelum pelajaran dimulai untuk mengasah minat baca dan daya tangkap pengetahuan siswa.',
        category: 'Akademik'
      },
      {
        id: 'habit-2',
        title: 'Karakter Pancasila',
        desc: 'Integrasi nilai-nilai gotong royong, kebhinekaan, dan kejujuran dalam setiap aktivitas pembelajaran Kurikulum Merdeka.',
        category: 'Karakter'
      },
      {
        id: 'habit-3',
        title: 'Sekolah Ramah Anak',
        desc: 'Lingkungan bebas perundungan (anti-bullying) dengan guru pendamping yang hangat, sabar, dan komunikatif.',
        category: 'Lingkungan'
      },
      {
        id: 'habit-4',
        title: 'Pramuka Wajib',
        desc: 'Pembinaan kedisiplinan, kemandirian, kecintaan alam, dan kepemimpinan melalui regu Kepramukaan Penggalang.',
        category: 'Kepemimpinan'
      }
    ],
    comfortStandards: [
      {
        id: 'comfort-1',
        title: 'Sanitasi & Toilet Bersih',
        desc: 'Toilet siswa laki-laki dan perempuan terpisah yang rutin dibersihkan secara berkala setiap hari.'
      },
      {
        id: 'comfort-2',
        title: 'Wastafel Cuci Tangan',
        desc: 'Wastafel cuci tangan lengkap dengan sabun cair tersedia di setiap selasar kelas untuk pembiasaan hidup sehat.'
      },
      {
        id: 'comfort-3',
        title: 'Kantin Sehat Sekolah',
        desc: 'Menyediakan sarana konsumsi makanan dan minuman sehat yang higienis serta aman bagi perkembangan anak.'
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        name: 'Bapak Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
        phone: '081298765432',
        subject: 'Informasi Pendaftaran Siswa Baru (PPDB)',
        message: 'Selamat pagi, saya ingin menanyakan jadwal resmi pembukaan PPDB untuk tahun ajaran baru dan persyaratan dokumen yang harus disiapkan. Terima kasih.',
        date: '2026-08-30 09:15',
        isRead: false
      }
    ]
  };

  const SchoolConstants = {
    NAV_ITEMS,
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_BYTES,
    ITEMS_PER_PAGE,
    STORAGE_KEYS,
    INITIAL_DATA
  };

  root.SchoolConstants = SchoolConstants;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolConstants;
  }
})(typeof window !== 'undefined' ? window : global);
