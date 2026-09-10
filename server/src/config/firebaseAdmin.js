import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  readFileSync(
    new URL("../../secrets/firebase-service-account.json", import.meta.url),
    "utf-8",
  ),
);

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount) });

export const adminAuth = getAuth(adminApp);

export default adminApp;
