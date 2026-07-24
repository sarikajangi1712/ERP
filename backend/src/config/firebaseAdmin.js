// Firebase Admin SDK Config for Backend
// Used for verifying Firebase ID Tokens on incoming API requests

let admin = null;
let firebaseAdminAuth = null;

try {
  admin = require('firebase-admin');

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (!admin.apps.length) {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🔥 Firebase Admin SDK initialized with custom service account credentials.');
    } else {
      // Default / mock initialization mode
      admin.initializeApp({
        projectId: projectId || 'mini-erp-crm-demo',
      });
      console.log('🔥 Firebase Admin SDK initialized in standard mode.');
    }
  }

  firebaseAdminAuth = admin.auth();
} catch (err) {
  console.info('Firebase Admin SDK notice: Run `cd server; npm install firebase-admin` for live Firebase server token verification.');
}

module.exports = {
  admin,
  firebaseAdminAuth,
};
