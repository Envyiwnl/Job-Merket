import express from "express";
import multer from "multer";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";
import {
  registerUser,
  getCurrentUser,
  updateProfile,
  uploadResume,
  getResume,
  updateRecruiterProfile,
  uploadCompanyLogo,
} from "../controllers/authController.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }

    callback(null, true);
  },
});

const logoUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only PNG, JPG, JPEG, and WEBP images are allowed."),
      );
    }

    callback(null, true);
  },
});

const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "Resume must be smaller than 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

const handleCompanyLogoUpload = (req, res, next) => {
  logoUpload.single("logo")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "Company logo must be smaller than 2 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

router.post("/register", verifyFirebaseToken, registerUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.patch("/profile", verifyFirebaseToken, updateProfile);
router.post("/resume", verifyFirebaseToken, handleResumeUpload, uploadResume);
router.get("/resume", verifyFirebaseToken, getResume);
router.patch("/recruiter-profile", verifyFirebaseToken, updateRecruiterProfile);
router.post(
  "/company-logo",
  verifyFirebaseToken,
  handleCompanyLogoUpload,
  uploadCompanyLogo,
);

export default router;
