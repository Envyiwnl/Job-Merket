import express from "express";
import {
  createApplication,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getRecruiterApplicationResume
} from "../controllers/applicationController.js";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/recruiter/me", verifyFirebaseToken, getRecruiterApplications);

router.post("/", verifyFirebaseToken, createApplication);

router.get("/me", verifyFirebaseToken, getMyApplications);

router.patch("/:id/status", verifyFirebaseToken, updateApplicationStatus);

router.get("/:id/resume", verifyFirebaseToken, getRecruiterApplicationResume);

export default router;
