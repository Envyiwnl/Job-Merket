import express from "express";
import { rateLimit } from "express-rate-limit";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, sendContactMessage);

export default router;
