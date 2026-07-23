const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing Loop Readiness Ecosystem...');

const requiredFiles = [
  'LOOP.md',
  'STATE.md',
  'loop-budget.md',
  'loop-run-log.md',
  'loop-constraints.md',
  'server/prisma/schema.prisma',
  'client/package.json',
  'server/package.json',
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
