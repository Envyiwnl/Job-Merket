import express from "express";
import {
  getResources,
  getResourceById,
} from "../controllers/resourceController.js";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/", getResources);
router.get("/:id", verifyFirebaseToken, getResourceById);

export default router;
