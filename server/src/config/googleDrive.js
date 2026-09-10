import "dotenv/config";
import { google } from "googleapis";

const {
  GOOGLE_DRIVE_CLIENT_ID,
  GOOGLE_DRIVE_CLIENT_SECRET,
  GOOGLE_DRIVE_REDIRECT_URI,
  GOOGLE_DRIVE_REFRESH_TOKEN,
} = process.env;

if (
  !GOOGLE_DRIVE_CLIENT_ID ||
  !GOOGLE_DRIVE_CLIENT_SECRET ||
  !GOOGLE_DRIVE_REDIRECT_URI ||
  !GOOGLE_DRIVE_REFRESH_TOKEN
) {
  throw new Error("Missing Google Drive OAuth environment variables.");
}

export const googleDriveOAuthClient = new google.auth.OAuth2(
  GOOGLE_DRIVE_CLIENT_ID,
  GOOGLE_DRIVE_CLIENT_SECRET,
  GOOGLE_DRIVE_REDIRECT_URI,
);

googleDriveOAuthClient.setCredentials({
  refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN,
});

export const drive = google.drive({
  version: "v3",
  auth: googleDriveOAuthClient,
});
