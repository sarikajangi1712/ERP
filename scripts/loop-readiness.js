const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing Loop Readiness Ecosystem...');

const requiredFiles = [
  'README.md',
  'docs/PRD.md',
  'docs/TRD.md',
  'docs/APP_FLOW.md',
  'docs/BACKEND_SCHEMA.md',
  'docs/DEPLOYMENT.md',
  'backend/prisma/schema.prisma',
  'frontend/package.json',
  'backend/package.json',
];

let missing = false;
requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required Loop file: ${file}`);
    missing = true;
  } else {
    console.log(`  ✓ ${file}`);
  }
});

if (missing) {
  process.exit(1);
} else {
  console.log('🎉 Loop Engineering ecosystem verified 100% complete.');
}
