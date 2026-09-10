import express from "express";
import { getRecruiterDashboard } from "../controllers/dashboardController.js";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, getRecruiterDashboard);

export default router;