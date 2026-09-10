import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import {
  copyResumeForApplication,
  getResumeFromDrive,
} from "../services/googleDriveService.js";

export async function createApplication(req, res) {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

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

    if (!candidate.resumeFileId) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume before applying.",
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "open",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer accepting applications.",
      });
    }

    const existingApplication = await Application.findOne({
      candidateId: candidate._id,
      jobId: job._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const resumeCopy = await copyResumeForApplication(
      candidate.resumeFileId,
      candidate._id.toString(),
      job._id.toString(),
    );

    const application = await Application.create({
      candidateId: candidate._id,
      jobId: job._id,
      status: "applied",
      resumeFileId: resumeCopy.id,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    console.error("Create application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
}

export async function getMyApplications(req, res) {
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

    const applications = await Application.find({
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
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get applications.",
    });
  }
}

export async function getRecruiterApplications(req, res) {
  try {
    const recruiter = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only.",
      });
    }

    const recruiterJobs = await Job.find({
      recruiterId: recruiter._id,
    }).select("_id title");

    const jobIds = recruiterJobs.map((job) => job._id);

    const applications = await Application.find({
      jobId: {
        $in: jobIds,
      },
    })
      .populate("candidateId", "name email skills")
      .populate("jobId", "title")
      .sort({
        createdAt: -1,
      });

    const applicants = applications.map((application) => ({
      _id: application._id,

      candidateId: application.candidateId?._id,

      name: application.candidateId?.name || "",
      email: application.candidateId?.email || "",
      skills: application.candidateId?.skills || [],

      jobId: application.jobId?._id,
      jobTitle: application.jobId?.title || "",

      status: application.status,

      appliedAt: application.createdAt,

      hasResume: Boolean(application.resumeFileId),
    }));

    return res.status(200).json({
      success: true,
      applicants,
    });
  } catch (error) {
    console.error("Get recruiter applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants.",
    });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const allowedStatuses = [
      "applied",
      "under-review",
      "shortlisted",
      "rejected",
      "hired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const recruiter = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only.",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const job = await Job.findOne({
      _id: application.jobId,
      recruiterId: recruiter._id,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "You cannot manage this application.",
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status.",
    });
  }
}

export async function getRecruiterApplicationResume(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const recruiter = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only.",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const job = await Job.findOne({
      _id: application.jobId,
      recruiterId: recruiter._id,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this resume.",
      });
    }

    if (!application.resumeFileId) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const { metadata, stream } = await getResumeFromDrive(
      application.resumeFileId,
    );

    res.setHeader(
      "Content-Type",
      metadata.mimeType || "application/octet-stream",
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${metadata.name || "resume"}"`,
    );

    res.setHeader("Cache-Control", "private, no-store");

    stream.on("error", (streamError) => {
      console.error("Resume stream error:", streamError);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to stream resume.",
        });
      } else {
        res.destroy(streamError);
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Get recruiter application resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
    });
  }
}
