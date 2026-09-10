import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["applied", "under-review", "shortlisted", "rejected", "hired"],
      default: "applied",
    },

    resumeFileId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index(
  {
    candidateId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
