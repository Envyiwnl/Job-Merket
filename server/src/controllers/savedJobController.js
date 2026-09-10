import mongoose from "mongoose";
import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export async function getMySavedJobs(req, res) {
  try {
    const candidate = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    const savedJobs = await SavedJob.find({
      candidateId: candidate._id,
    })
      .populate({
        path: "jobId",
        populate: [
          {
            path: "companyId",
          },
          {
            path: "categoryId",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get saved jobs.",
    });
  }
}

export async function saveJob(req, res) {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const candidate = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "open",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer available.",
      });
    }

    const existingSavedJob = await SavedJob.findOne({
      candidateId: candidate._id,
      jobId: job._id,
    });

    if (existingSavedJob) {
      return res.status(409).json({
        success: false,
        message: "Job is already saved.",
      });
    }

    const savedJob = await SavedJob.create({
      candidateId: candidate._id,
      jobId: job._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully.",
      savedJob,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job is already saved.",
      });
    }

    console.error("Save job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save job.",
    });
  }
}

export async function removeSavedJob(req, res) {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const candidate = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    const deletedSavedJob = await SavedJob.findOneAndDelete({
      candidateId: candidate._id,
      jobId,
    });

    if (!deletedSavedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job removed from saved jobs.",
    });
  } catch (error) {
    console.error("Remove saved job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove saved job.",
    });
  }
}
