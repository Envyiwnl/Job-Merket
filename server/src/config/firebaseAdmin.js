import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  new URL("../../secrets/firebase-service-account.json", import.meta.url);

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount) });

export const adminAuth = getAuth(adminApp);

export default adminApp;
