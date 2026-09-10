import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export async function getRecruiterDashboard(req, res) {
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
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const [
      activeJobs,
      totalApplicants,
      shortlisted,
      recentJobs,
      recentApplicants,
    ] = await Promise.all([
      Job.countDocuments({
        recruiterId: recruiter._id,
        status: "open",
      }),

      Application.countDocuments({
        jobId: { $in: jobIds },
      }),

      Application.countDocuments({
        jobId: { $in: jobIds },
        status: "shortlisted",
      }),

      Job.find({
        recruiterId: recruiter._id,
      })
        .select("title status createdAt")
        .sort({ createdAt: -1 })
        .limit(3),

      Application.find({
        jobId: { $in: jobIds },
      })
        .populate("candidateId", "name")
        .populate("jobId", "title")
        .sort({ createdAt: -1 })
        .limit(3),
    ]);

    const recentJobIds = recentJobs.map((job) => job._id);

    const applicantCounts = await Application.aggregate([
      {
        $match: {
          jobId: { $in: recentJobIds },
        },
      },
      {
        $group: {
          _id: "$jobId",
          count: { $sum: 1 },
        },
      },
    ]);

    const applicantCountMap = new Map(
      applicantCounts.map((item) => [String(item._id), item.count]),
    );

    const formattedRecentJobs = recentJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      status: job.status,
      createdAt: job.createdAt,
      applicants: applicantCountMap.get(String(job._id)) || 0,
    }));

    const formattedRecentApplicants = recentApplicants.map((application) => ({
      _id: application._id,
      name: application.candidateId?.name || "Unknown Candidate",
      jobTitle: application.jobId?.title || "Job unavailable",
      status: application.status,
      appliedAt: application.createdAt,
    }));

    return res.status(200).json({
      success: true,

      stats: {
        activeJobs,
        totalApplicants,
        shortlisted,
      },

      recentJobs: formattedRecentJobs,

      recentApplicants: formattedRecentApplicants,
    });
  } catch (error) {
    console.error("Recruiter dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
    });
  }
}
