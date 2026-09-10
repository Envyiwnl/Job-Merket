import express from "express";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";
import {
  getMySavedJobs,
  saveJob,
  removeSavedJob,
} from "../controllers/savedJobController.js";

const router = express.Router();

router.get("/me", verifyFirebaseToken, getMySavedJobs);

router.post("/:jobId", verifyFirebaseToken, saveJob);

router.delete("/:jobId", verifyFirebaseToken, removeSavedJob);

export default router;
