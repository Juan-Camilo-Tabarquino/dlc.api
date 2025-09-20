import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = join(
  __dirname,
  '../../../src/config/firebase-service-account.json',
);

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

export const firebaseConfig = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
