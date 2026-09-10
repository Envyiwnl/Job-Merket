import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import googleDriveRoutes from "./routes/googleDriveRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

await connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/google-drive", googleDriveRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/recruiter/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job-Merket API is running",
  });
});

app.get("/api/auth/test", verifyFirebaseToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Firebase token verified.",
    user: {
      uid: req.firebaseUser.uid,
      email: req.firebaseUser.email,
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
