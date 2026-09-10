import { adminAuth } from "../src/config/firebaseAdmin.js";

export default async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication token required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid or expired authentication token",
      });
  }
}
