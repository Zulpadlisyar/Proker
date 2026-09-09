#!/usr/bin/env node

/**
 * Auto-Push Script for SD Negeri 2 Ngeposari
 * - Runs test verification suite (audit & database tests)
 * - Automatically stages modified & new files
 * - Commits with custom message or auto-timestamp
 * - Pushes to remote repository (origin main)
 */

const { execSync } = require('child_process');

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...options }).trim();
  } catch (error) {
    if (options.allowFail) return null;
    throw error;
  }
}

console.log('\n🚀 [Auto-Push Git] Memulai proses verifikasi dan sinkronisasi Git...\n');

// 1. Get current branch
let currentBranch = 'main';
try {
  currentBranch = run('git rev-parse --abbrev-ref HEAD');
} catch (e) {
  currentBranch = 'main';
}
console.log(`📌 Branch aktif: ${currentBranch}`);

// 2. Run automated test suite
console.log('🧪 Menjalankan pengujian otomatis (npm test)...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Seluruh pengujian lulus 100%!\n');
} catch (err) {
  console.error('\n❌ Pengujian GAGAL! Pembatalan auto-push demi keamanan produksi.');
  process.exit(1);
}

// 3. Check for uncommitted changes
const status = run('git status --porcelain');
const customMsg = process.argv.slice(2).join(' ').trim();

if (status) {
  console.log('📦 Mendeteksi berkas yang diubah/baru. Melakukan git add & commit...');
  run('git add -A');

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const commitMsg = customMsg || `chore: update SDN 2 Ngeposari website [${timeStr}]`;

  run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
  console.log(`✅ Berhasil commit: "${commitMsg}"`);
} else {
  console.log('ℹ️  Tidak ada perubahan lokal yang belum di-commit.');
}

// 4. Push to remote
console.log(`\n📤 Mengirim pembaruan ke remote (origin ${currentBranch})...`);
try {
  const pushOutput = execSync(`git push origin ${currentBranch}`, { stdio: 'pipe', encoding: 'utf8' });
  console.log(pushOutput || 'Everything up-to-date');
  
  const latestCommit = run('git log -1 --oneline');
  console.log(`\n🎉 [SUKSES] Seluruh perubahan berhasil terdorong ke GitHub!`);
  console.log(`🔖 Commit Terakhir: ${latestCommit}\n`);
} catch (pushErr) {
  console.error('\n❌ Gagal melakukan push ke remote repository:');
  console.error(pushErr.stderr || pushErr.message);
  process.exit(1);
}
