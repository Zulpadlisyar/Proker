/**
 * SDN 2 Ngeposari - Database and State Manager Automated Test Suite
 * Tests SchoolDB CRUD, validation rules, baseline protection, and data sanitization.
 */

const assert = require('assert');
const path = require('path');

// Mock browser environment for Node.js test execution
global.window = global;
global.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};
global.sessionStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};
global.CustomEvent = function (name, opts) { this.name = name; this.detail = opts && opts.detail; };
global.dispatchEvent = function () {};

// Load dependencies in exact order
require('../js/config/constants.js');
require('../js/db.js');

async function runDatabaseTests() {
  console.log('====================================================');
  console.log('   DATABASE & STATE MANAGER RUNTIME TEST SUITE');
  console.log('====================================================\n');

  await window.SchoolDB.init();

  // 1. Baseline System
  console.log('1. Testing Smart Reset & Baseline Protection...');
  const initialInfo = await window.SchoolDB.getResetBaselineInfo();
  assert(initialInfo === null || typeof initialInfo === 'object', 'getResetBaselineInfo should return null or object');
  const saveResult = await window.SchoolDB.saveResetBaseline('Test Baseline');
  assert.strictEqual(saveResult.success, true, 'saveResetBaseline should succeed');
  const savedInfo = await window.SchoolDB.getResetBaselineInfo();
  assert(savedInfo && savedInfo.timestamp, 'Saved baseline must contain timestamp');
  assert(savedInfo && savedInfo.schoolName, 'Saved baseline must contain schoolName');
  console.log('[PASS] Baseline saved and retrieved successfully.');

  // 2. Activities CRUD & View Counter
  console.log('2. Testing Activity Addition with Excerpt & Summary...');
  const newActivity = await window.SchoolDB.addActivity({
    title: 'Pelaksanaan ANBK Gelombang I',
    category: 'Akademik',
    date: '2026-09-15',
    excerpt: 'Siswa kelas V mengikuti ANBK dengan lancar dan tertib.',
    content: 'Uraian lengkap kegiatan Asesmen Nasional Berbasis Komputer.',
    image: 'images/school/kegiatan1.webp'
  });
  assert(newActivity.id, 'Activity must have an ID');
  assert.strictEqual(newActivity.excerpt, 'Siswa kelas V mengikuti ANBK dengan lancar dan tertib.');
  console.log('[PASS] Activity added with excerpt and summary.');

  const viewCount = await window.SchoolDB.incrementActivityViews(newActivity.id);
  assert(viewCount >= 1, 'View count must be incremented');
  console.log('[PASS] Activity view count incremented:', viewCount);

  // 3. Testimonials Rule: Same Name & Role Allowed, Duplicate Quote Rejected
  console.log('3. Testing Kesan & Apresiasi Duplicate Quote Rule...');
  const t1 = await window.SchoolDB.addTestimonial({
    name: 'Budi Santoso',
    role: 'Wali Murid Kelas 4',
    quote: 'Pendidikan karakter di sekolah ini sangat luar biasa.'
  });
  assert(t1.id, 'Testimonial 1 should be added');

  // Same name & same role with DIFFERENT quote -> MUST PASS
  const t2 = await window.SchoolDB.addTestimonial({
    name: 'Budi Santoso',
    role: 'Wali Murid Kelas 4',
    quote: 'Guru-guru selalu sabar dan memberikan bimbingan terbaik.'
  });
  assert(t2.id, 'Testimonial 2 with different quote should succeed');
  console.log('[PASS] Identical name & role permitted for distinct messages.');

  // Different name & role with DUPLICATE quote -> MUST FAIL
  let quoteRejected = false;
  try {
    await window.SchoolDB.addTestimonial({
      name: 'Dewi Lestari',
      role: 'Alumni 2024',
      quote: 'Pendidikan karakter di sekolah ini sangat luar biasa.'
    });
  } catch (err) {
    quoteRejected = true;
    console.log('[PASS] Duplicate quote correctly rejected:', err.message);
  }
  assert(quoteRejected, 'Duplicate quote must be rejected');

  // 4. Comfort Standards Rule: Unique Title & Unique Description
  console.log('4. Testing Standar Kenyamanan Validation Rules...');
  const s1 = await window.SchoolDB.addComfortStandard({
    title: 'Pencahayaan Alami Optimal',
    desc: 'Ventilasi dan jendela besar memastikan sirkulasi udara segar dan terang.'
  });
  assert(s1.id, 'Comfort standard 1 added');

  let titleRejected = false;
  try {
    await window.SchoolDB.addComfortStandard({
      title: 'Pencahayaan Alami Optimal',
      desc: 'Deskripsi yang berbeda sama sekali.'
    });
  } catch (err) {
    titleRejected = true;
    console.log('[PASS] Duplicate comfort title correctly rejected:', err.message);
  }
  assert(titleRejected, 'Duplicate title must be rejected');

  let descRejected = false;
  try {
    await window.SchoolDB.addComfortStandard({
      title: 'Judul Lain yang Berbeda',
      desc: 'Ventilasi dan jendela besar memastikan sirkulasi udara segar dan terang.'
    });
  } catch (err) {
    descRejected = true;
    console.log('[PASS] Duplicate comfort description correctly rejected:', err.message);
  }
  assert(descRejected, 'Duplicate description must be rejected');

  // 5. Visi & Misi Sanitization
  console.log('5. Testing Visi & Misi Sanitization and Containment...');
  const brokenMission = 'Melaksanakan kurikulum merdeka wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww';
  await window.SchoolDB.updateProfile({
    missions: [brokenMission]
  });
  const updatedMissions = window.SchoolDB.getProfile().missions;
  assert(!updatedMissions[0].includes('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'), 'Long unbroken words must be spaced');
  console.log('[PASS] Long unbroken words safely split to prevent layout blowout.');

  console.log('\n>>> ALL DATABASE RUNTIME TESTS PASSED 100%! <<<\n');
}

runDatabaseTests().catch(err => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
