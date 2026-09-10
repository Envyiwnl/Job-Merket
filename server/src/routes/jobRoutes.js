import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  updateJobStatus,
  getRecruiterJobById,
  updateJob,
} from "../controllers/jobController.js";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/recruiter/me", verifyFirebaseToken, getRecruiterJobs);
router.get("/recruiter/:id", verifyFirebaseToken, getRecruiterJobById);
router.get("/", getJobs);
router.post("/", verifyFirebaseToken, createJob);
router.patch("/:id/status", verifyFirebaseToken, updateJobStatus);
router.patch("/:id", verifyFirebaseToken, updateJob);
router.get("/:id", getJobById);

export default router;
