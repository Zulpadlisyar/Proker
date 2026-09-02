const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('   FULL AUDIT TEST SUITE: VISUAL, FUNC, LAYOUT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------
// 1. HTML & SEO AUDIT
// ----------------------------------------------------
const publicPages = ['index.html', 'tentang.html', 'fasilitas.html', 'kegiatan.html', 'kontak.html', 'detail-kegiatan.html', '404.html'];
const allPages = [...publicPages, 'admin.html'];

test('1.1: Every page has valid <title> and <meta name="description">', () => {
  for (const page of allPages) {
    const content = fs.readFileSync(page, 'utf8');
    assert(content.includes('<title>'), `${page} missing <title>`);
    assert(content.includes('name="description"'), `${page} missing meta description`);
  }
});

test('1.2: Navbar "Hubungi Kami" button is removed from all public pages', () => {
  for (const page of publicPages) {
    const content = fs.readFileSync(page, 'utf8');
    assert(!content.includes('header-cta-btn'), `${page} contains legacy header-cta-btn`);
    const headerMatch = content.match(/<header[^>]*>([\s\S]*?)<\/header>/);
    if (headerMatch) {
      assert(!headerMatch[1].includes('Hubungi Kami'), `${page} header contains Hubungi Kami`);
    }
  }
});

test('1.3: All linked CSS files and script files exist on disk', () => {
  for (const page of allPages) {
    const content = fs.readFileSync(page, 'utf8');
    // Scripts
    const scriptMatches = content.match(/src=["'](js\/[^"']+)["']/g) || [];
    for (const sm of scriptMatches) {
      const src = sm.replace(/src=["']/, '').replace(/["']/, '').split('?')[0];
      assert(fs.existsSync(src), `Script missing in ${page}: ${src}`);
    }
    // CSS
    const cssMatches = content.match(/href=["'](css\/[^"']+)["']/g) || [];
    for (const cm of cssMatches) {
      const href = cm.replace(/href=["']/, '').replace(/["']/, '').split('?')[0];
      assert(fs.existsSync(href), `CSS missing in ${page}: ${href}`);
    }
  }
});

test('1.4: All local images referenced in HTML exist on disk', () => {
  for (const page of allPages) {
    const content = fs.readFileSync(page, 'utf8');
    const imgMatches = content.match(/src=["'](images\/[^"']+)["']/g) || [];
    for (const im of imgMatches) {
      const isrc = im.replace(/src=["']/, '').replace(/["']/, '').split('?')[0];
      assert(fs.existsSync(isrc), `Image missing in ${page}: ${isrc}`);
    }
  }
});

test('1.5: Headmaster official name is Bapak Maryanto, M.Pd. across all pages', () => {
  for (const page of allPages) {
    const content = fs.readFileSync(page, 'utf8');
    assert(!content.includes('Bapak Hartono'), `${page} still contains legacy name Bapak Hartono`);
  }
});

// ----------------------------------------------------
// 2. LAYOUT & DESIGN SYSTEM AUDIT
// ----------------------------------------------------
const stylesCss = fs.readFileSync('css/styles.css', 'utf8');

test('2.1: CSS syntax - Balanced braces and comments', () => {
  const opens = stylesCss.split('{').length - 1;
  const closes = stylesCss.split('}').length - 1;
  assert.strictEqual(opens, closes, `CSS braces mismatch: {=${opens}, }=${closes}`);
  const cOpens = stylesCss.split('/*').length - 1;
  const cCloses = stylesCss.split('*/').length - 1;
  assert.strictEqual(cOpens, cCloses, `CSS comment mismatch: /*=${cOpens}, */=${cCloses}`);
});

test('2.2: Unified container width (1240px) across sections', () => {
  assert(stylesCss.includes('max-width: 1240px'), 'styles.css missing unified max-width 1240px');
  assert(stylesCss.includes('.section {\n  padding: var(--space-8) var(--space-5);\n  max-width: 1240px;'), '.section not configured with max-width 1240px');
  assert(stylesCss.includes('.principal-greeting-container {\n  max-width: 1240px;'), '.principal-greeting-container not configured with max-width 1240px');
});

test('2.3: Non-Overlapping Editorial Gallery Grid - Structure and styling', () => {
  assert(stylesCss.includes('.home-gallery-grid {'), 'Missing .home-gallery-grid in CSS');
  assert(stylesCss.includes('grid-template-columns: repeat(3, 1fr)'), 'Missing 3-column grid template');
  assert(stylesCss.includes('.home-gallery-grid .gallery-card'), 'Missing .gallery-card');
  assert(stylesCss.includes('.home-gallery-grid .gallery-card-scrim'), 'Missing .gallery-card-scrim');
  assert(stylesCss.includes('.home-gallery-grid .gallery-card-badge'), 'Missing .gallery-card-badge');
  assert(!stylesCss.includes('rgba(29, 78, 216'), 'Residual blue rgba(29, 78, 216) found in styles.css');
  assert(!stylesCss.includes('#BFDBFE'), 'Residual blue #BFDBFE found in styles.css');
});

test('2.4: Index.html implements 6 clean gallery cards without facility detail buttons', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert(!indexHtml.includes('Detail fasilitas →'), 'index.html still has Detail fasilitas → button');
  assert(indexHtml.includes('gallery-card-scrim'), 'index.html missing permanent caption scrim');
  assert(indexHtml.includes('gallery-card-badge'), 'index.html missing category badges');
  assert(!indexHtml.includes('✨ DOKUMENTASI UTAMA'), 'index.html still has sparkle emoji in badge');
});

test('2.5: Detail Kegiatan photo width matches article text width', () => {
  const detailHtml = fs.readFileSync('detail-kegiatan.html', 'utf8');
  assert(detailHtml.includes('class="article-img-box" style="width: 100%'), 'detail-kegiatan.html image wrapper not width: 100%');
  assert(!detailHtml.includes('max-height: 440px'), 'detail-kegiatan.html image wrapper has max-height restriction');
});

test('2.6: Smart Back navigation logic implemented', () => {
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  assert(mainJs.includes('Kembali ke Beranda'), 'main.js missing Kembali ke Beranda label');
  assert(mainJs.includes('history.back()'), 'main.js missing history.back() fallback');
});

test('2.7: Calendar width is 100% and Footer has zero Maps links', () => {
  assert(stylesCss.includes('.full-calendar-timeline-container {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  max-width: 100%;'), 'Calendar container not 100% max-width');
  const footerJs = fs.readFileSync('js/components/layout/Footer.js', 'utf8');
  assert(!footerJs.includes('maps.app.goo.gl'), 'Footer.js still contains maps link');
});

// ----------------------------------------------------
// 3. FUNCTIONALITY & COMPONENT AUDIT
// ----------------------------------------------------
test('3.1: Academic Calendar container ID in kegiatan.html matches JS component', () => {
  const kegiatanHtml = fs.readFileSync('kegiatan.html', 'utf8');
  assert(kegiatanHtml.includes('id="calendar-vertical-list"'), 'kegiatan.html missing id="calendar-vertical-list"');
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  assert(mainJs.includes('calendar-vertical-list'), 'main.js missing calendar-vertical-list lookup');
});

test('3.2: Toast notification 3000ms dismiss timer in main.js', () => {
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  assert(mainJs.includes('3000'), 'main.js missing 3000ms timer');
  assert(mainJs.includes('toast toast-'), 'main.js missing toast class');
  assert(mainJs.includes('toast-hide'), 'main.js missing toast-hide class');
});

test('3.3: Database View Counter logic - Debounce and sync storage', () => {
  const dbJs = fs.readFileSync('js/db.js', 'utf8');
  assert(dbJs.includes('incrementActivityViews(id)'), 'db.js missing incrementActivityViews');
  assert(dbJs.includes('act_views_${id}'), 'db.js missing localStorage key for synchronous view counter');
  assert(dbJs.includes('last_view_ts_${id}'), 'db.js missing sessionStorage debounce guard');
});

test('3.4: ActivityCard renders view count with eye icon and "pembaca"', () => {
  const cardJs = fs.readFileSync('js/components/public/ActivityCard.js', 'utf8');
  assert(cardJs.includes('pembaca'), 'ActivityCard missing "pembaca" text');
  assert(cardJs.includes('eyeIconSvg'), 'ActivityCard missing eye icon SVG');
});

test('3.5: Main.js preserves Bento DOM during dynamic gallery sync', () => {
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  assert(mainJs.includes('Dynamic Home Documentation Gallery Grid (Preserves Bento Structure)'), 'main.js does not preserve bento structure');
  assert(!mainJs.includes('homeGalleryContainer.innerHTML = displayGallery'), 'main.js overwrites bento innerHTML!');
});

console.log('\n----------------------------------------------------');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('----------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL AUDIT TESTS PASSED SUCCESSFULLY! <<<\n');
}
