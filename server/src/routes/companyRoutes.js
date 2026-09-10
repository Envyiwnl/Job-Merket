import express from "express";

import {
  getCompanies,
  getCompanyById,
  getCompanyLogo,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.get("/:id/logo", getCompanyLogo);

export default router;
