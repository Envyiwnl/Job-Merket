import express from "express";
import { googleDriveOAuthClient } from "../config/googleDrive.js";

const router = express.Router();

const DRIVE_SCOPE = ["https://www.googleapis.com/auth/drive.file"];

router.get("/auth", (req, res) => {
  try {
    const authUrl = googleDriveOAuthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: DRIVE_SCOPE,
    });

    console.log("Google OAuth URL generated.");

    return res.redirect(authUrl);
  } catch (error) {
    console.error("Generate Google OAuth URL error:", error);

    return res.status(500).send("Failed to start Google Drive authorization.");
  }
});

router.get("/oauth2callback", async (req, res) => {
  try {
    console.log("OAuth callback query:", req.query);

    const { code, error, error_description: errorDescription } = req.query;

    if (error) {
      console.error("Google OAuth error:", {
        error,
        errorDescription,
      });

      return res
        .status(400)
        .send(
          `Google authorization failed: ${error}${
            errorDescription ? ` - ${errorDescription}` : ""
          }`,
        );
    }

    if (!code) {
      return res
        .status(400)
        .send(
          "Authorization code is missing. Start the authorization process from /api/google-drive/auth.",
        );
    }

    const { tokens } = await googleDriveOAuthClient.getToken(code);

    if (!tokens.refresh_token) {
      console.log("Tokens received, but no refresh token was returned.");

      return res
        .status(400)
        .send(
          "Authorization succeeded, but Google did not return a refresh token.",
        );
    }

    console.log("GOOGLE DRIVE REFRESH TOKEN:", tokens.refresh_token);

    return res.send(
      "Google Drive authorization successful. Check the server terminal for the refresh token.",
    );
  } catch (error) {
    console.error("Google Drive OAuth error:", error);

    return res.status(500).send("Google Drive authorization failed.");
  }
});

export default router;
