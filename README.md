# Portal Resmi & CMS SD Negeri 2 Ngeposari

Portal web informasi resmi dan sistem manajemen konten (CMS) **SD Negeri 2 Ngeposari**, Kapanewon Semanu, Kabupaten Gunungkidul, D.I. Yogyakarta. Dibangun dengan standar industri berkinerja tinggi, arsitektur *Zero-Dependency Jamstack*, sistem desain berakar nilai lokal, serta integrasi deployment instan Cloudflare Pages.

---

## 📌 Identitas Resmi Sekolah

| Parameter | Data Resmi |
| :--- | :--- |
| **Nama Sekolah** | SD Negeri 2 Ngeposari (SDN Ngeposari 2) |
| **NPSN** | 20401876 |
| **NSS** | 101040310002 |
| **Status Akreditasi** | Terakreditasi **A** (Unggul) |
| **Kepala Sekolah** | Bapak Maryanto, M.Pd. |
| **Alamat Lengkap** | Mojo RT 01 / RW 13, Kalurahan Ngeposari, Kapanewon Semanu, Kabupaten Gunungkidul, D.I. Yogyakarta 55893 |
| **Email Resmi** | sdn2ngeposari@gmail.com |

---

## 🚀 Arsitektur & Teknologi

Situs web ini dirancang dengan prinsip **keringanan maksimal, kecepatan kilat, dan kemudahan pemeliharaan**:

- **Core Framework**: Semantic HTML5 & Vanilla JavaScript Modern (ES6+).
- **Design System**: Vanilla CSS3 dengan CSS Custom Properties (Design Tokens), Glassmorphism, dan Typography scale berbasis *Plus Jakarta Sans*.
- **Database & Storage**: `SchoolDB` (arsitektur hybrid *IndexedDB* dengan sinkronisasi *localStorage* fail-safe dan pencatatan audit logging).
- **Deployment & Edge CDN**: Cloudflare Pages (`wrangler`) dengan caching statis 1 tahun (*immutable*) untuk aset media dan header keamanan ketat (*CSP, HSTS, X-Frame-Options, no-sniff*).
- **Standar Estetika**: Kebijakan *Zero-Emoji* dengan icon SVG inline presisi tinggi, palet warna hijau alam (*Primary Green #2F6B45, Dark Green #214B31*) dan aksen emas (*Gold #E3B63F*).

---

## 📂 Struktur Direktori Standar Industri

```text
Proker/
├── 📄 index.html                # Halaman Utama (Beranda & Bento Mosaic Galeri)
├── 📄 tentang.html              # Profil Sekolah, Sejarah, & Visi-Misi Proporsional
├── 📄 fasilitas.html            # Sarana & Prasarana Pendidikan
├── 📄 kegiatan.html             # Berita Kegiatan, Kalender Akademik, & Galeri
├── 📄 detail-kegiatan.html      # Pembaca Berita Detail & Penghitung View Counter
├── 📄 kontak.html               # Formulir Kontak Masuk & Informasi Kunjungan
├── 📄 admin.html                # Portal CMS Pengelolaan Konten & Titik Reset
├── 📄 404.html                  # Halaman Penanganan Rute Tidak Ditemukan
├── 📄 google4df69ed47dc611e8.html # Token Verifikasi Google Search Console
│
├── ⚙️ package.json              # Skrip pengujian, dev server, dan dependensi
├── ⚙️ wrangler.jsonc            # Konfigurasi Cloudflare Pages Static Assets
├── ⚙️ _headers                  # Aturan Cache-Control dan Security Headers
├── ⚙️ robots.txt                # Pengaturan perayapan mesin pencari
├── ⚙️ sitemap.xml               # Peta rute SEO
├── ⚙️ site.webmanifest          # Konfigurasi PWA (Progressive Web App)
├── ⚙️ .editorconfig             # Standar indentasi & format berkas lintas IDE
├── ⚙️ .gitignore                # Pola pengecualian berkas repositori Git
├── ⚙️ .assetsignore             # Pengecualian berkas dari bundling Cloudflare CDN
├── 📜 README.md                 # Dokumentasi proyek standar industri
├── 📜 LICENSE                   # Lisensi open-source MIT
│
├── 📁 css/
│   └── styles.css               # Design system, token warna, Bento grid, & Lightbox
│
├── 📁 js/
│   ├── main.js                  # Controller halaman publik & inisialisasi UI
│   ├── admin.js                 # Controller logika portal CMS Admin
│   ├── db.js                    # State manager SchoolDB & pencatatan audit trail
│   ├── config/
│   │   └── constants.js         # Data inisial resmi dan konstanta sekolah
│   ├── components/
│   │   ├── common/              # EmptyState.js, Skeleton.js
│   │   ├── layout/              # Navbar.js, Footer.js
│   │   ├── public/              # ActivityCard.js, CalendarTimeline.js, GalleryCard.js
│   │   └── ui/                  # Carousel.js
│   └── utils/
│       ├── formatters.js        # Helper format tanggal & teks
│       └── guards.js            # Proteksi anti-spam form & debouncing
│
├── 📁 tests/
│   ├── audit.test.js            # Uji otomatis visual, tata letak, SEO, & kepatuhan
│   └── database.test.js         # Uji otomatis runtime SchoolDB, CRUD, & validasi
│
└── 📁 images/
    ├── school/                  # Foto kegiatan & fasilitas sekolah
    ├── teachers/                # Foto profil guru dan tenaga kependidikan
    ├── logo.webp                # Logo resmi sekolah teroptimasi
    ├── school_hero_bg.webp      # Foto lanskap gedung utama sekolah
    └── ...                      # Aset WebP / AVIF terkompresi
```

---

## 🛠️ Panduan Penggunaan & Perintah CLI

Pastikan [Node.js](https://nodejs.org/) (versi 18 ke atas) telah terpasang di sistem Anda.

### 1. Menjalankan Pengujian Otomatis
Jalankan seluruh rangkaian uji kepatuhan visual (17 audit) dan uji fungsional runtime database:
```bash
npm test
```

### 2. Menjalankan Server Pengembangan Lokal
Jalankan live preview menggunakan Cloudflare Wrangler:
```bash
npm run dev
```
Buka peramban pada alamat `http://localhost:8788`.

### 3. Deploy ke Cloudflare Pages
Kirimkan pembaruan langsung ke edge CDN Cloudflare:
```bash
npm run deploy
```

---

## ✨ Fitur Unggulan Sistem

1. **Editorial Bento Mosaic Gallery**:
   Tata letak galeri dokumentasi 3x3 berhierarki tinggi di halaman Beranda dengan kartu utama 2x2 lanskap, badge emas `DOKUMENTASI UTAMA`, dan trio berimbang di baris bawah.
2. **High-End Gallery Lightbox Viewer**:
   Pratinjau foto interaktif bergaya sinematik dengan tombol `X` melayang yang berputar dan menyala emas saat disentuh kursor, menjaga proporsi foto asli (*object-fit: contain*) tanpa distorsi.
3. **Smart Reset Baseline Protection**:
   CMS Admin dilengkapi kemampuan untuk menyimpan titik acuan (*Custom Baseline*) sehingga penambahan puluhan konten baru oleh pihak sekolah dapat dipertahankan dengan aman dan tidak akan hilang saat tombol reset ditekan.
4. **Validasi Anti-Duplikasi Ketat**:
   - Kesan & Apresiasi: Nama dan peran boleh sama, namun kutipan pesan wajib unik.
   - Standar Kenyamanan: Judul dan deskripsi tidak boleh sama persis.
   - Visi & Misi: Dilindungi pemotongan kata otomatis (*overflow-wrap: anywhere*) dan validasi panjang kata untuk mencegah *layout blowout*.
5. **Real-Time View Counter**:
   Penghitung jumlah pembaca berita kegiatan yang bekerja secara *debounced* per sesi peramban dan terintegrasi langsung dengan kartu berita.

---

## 📄 Lisensi
Hak Cipta &copy; 2026 SD Negeri 2 Ngeposari. Didistribusikan di bawah [Lisensi MIT](LICENSE).
