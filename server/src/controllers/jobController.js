import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import {
  allowedJobTypes,
  allowedExperience,
  allowedModes,
  toArray,
  cleanArray,
  parseSalary,
  validateSalary,
} from "../utils/jobHelpers.js";

export async function getJobs(req, res) {
  try {
    const {
      search = "",
      location = "",
      category = "",
      type,
      experience,
      mode,
      sort = "newest",
      page = 1,
      limit = 25,
    } = req.query;

    const query = { status: "open" };

    if (search.trim()) {
      const matchingCompanies = await Company.find({
        name: { $regex: search.trim(), $options: "i" },
      }).select("_id");

      const companyIds = matchingCompanies.map((company) => company._id);

      query.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          companyId: {
            $in: companyIds,
          },
        },
      ];
    }

    if (location.trim()) {
      query.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    if (category) {
      const categoryDocument = await Category.findOne({
        value: category,
      }).select("_id");

      if (!categoryDocument) {
        return res.status(200).json({
          success: true,
          jobs: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalJobs: 0,
            totalPages: 0,
          },
        });
      }

      query.categoryId = categoryDocument._id;
    }

    const types = toArray(type);
    const experiences = toArray(experience);
    const modes = toArray(mode);

    if (types.length) {
      query.type = {
        $in: types,
      };
    }

    if (experiences.length) {
      query.experience = {
        $in: experiences,
      };
    }

    if (modes.length) {
      query.mode = {
        $in: modes,
      };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 25, 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };

    if (sort === "salary-high") {
      sortOption = {
        "salary.min": -1,
      };
    }

    if (sort === "salary-low") {
      sortOption = {
        "salary.min": 1,
      };
    }

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate("companyId", "name logoUrl logoFileId industry location")
        .populate("categoryId", "name value")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch jobs." });
  }
}

export async function getJobById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      status: "open",
    })
      .populate("companyId", "name logoUrl logoFileId industry location")
      .populate("categoryId", "name value");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job.",
    });
  }
}

export async function createJob(req, res) {
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

    if (!recruiter.companyId) {
      return res.status(400).json({
        success: false,
        message: "Complete your company profile before posting a job.",
      });
    }

    const {
      title,
      categoryId,
      type,
      experience,
      location,
      mode,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
    } = req.body;

    if (
      !title?.trim() ||
      !categoryId ||
      !type ||
      !experience ||
      !location?.trim() ||
      !mode ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, category, job type, experience, location, mode and description are required.",
      });
    }

    if (!allowedJobTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type.",
      });
    }

    if (!allowedExperience.includes(experience)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience level.",
      });
    }

    if (!allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid work mode.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category.",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found.",
      });
    }

    const parsedSalary = parseSalary(salary);

    const salaryError = validateSalary(parsedSalary);

    if (salaryError) {
      return res.status(400).json({
        success: false,
        message: salaryError,
      });
    }

    const job = await Job.create({
      title: title.trim(),

      companyId: recruiter.companyId,
      recruiterId: recruiter._id,

      categoryId,

      type,
      experience,
      location: location.trim(),
      mode,
      salary: parsedSalary,
      description: description.trim(),

      responsibilities: cleanArray(responsibilities),
      requirements: cleanArray(requirements),
      skills: cleanArray(skills),
      benefits: cleanArray(benefits),

      status: "open",
      source: "recruiter",
    });

    const populatedJob = await Job.findById(job._id)
      .populate("companyId")
      .populate("categoryId");

    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job: populatedJob,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job.",
    });
  }
}

export async function getRecruiterJobs(req, res) {
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

    const jobs = await Job.find({
      recruiterId: recruiter._id,
    })
      .populate("companyId", "name logoUrl logoFileId industry location")
      .populate("categoryId", "name value")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs.",
    });
  }
}

export async function updateJobStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job status.",
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

    const job = await Job.findOne({
      _id: id,
      recruiterId: recruiter._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message:
        status === "closed"
          ? "Job closed successfully."
          : "Job reopened successfully.",
      job,
    });
  } catch (error) {
    console.error("Update job status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job status.",
    });
  }
}

export async function getRecruiterJobById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
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

    const job = await Job.findOne({
      _id: id,
      recruiterId: recruiter._id,
    })
      .populate("companyId", "name logoUrl logoFileId industry location")
      .populate("categoryId", "name value");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get recruiter job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job.",
    });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
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

    const job = await Job.findOne({
      _id: id,
      recruiterId: recruiter._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const {
      title,
      categoryId,
      type,
      experience,
      location,
      mode,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
    } = req.body;

    if (
      !title?.trim() ||
      !categoryId ||
      !type ||
      !experience ||
      !location?.trim() ||
      !mode ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (!allowedJobTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type.",
      });
    }

    if (!allowedExperience.includes(experience)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience level.",
      });
    }

    if (!allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid work mode.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const parsedSalary = parseSalary(salary);

    const salaryError = validateSalary(parsedSalary);

    if (salaryError) {
      return res.status(400).json({
        success: false,
        message: salaryError,
      });
    }

    job.title = title.trim();
    job.categoryId = categoryId;
    job.type = type;
    job.experience = experience;
    job.location = location.trim();
    job.mode = mode;

    job.salary = parsedSalary;
    job.description = description.trim();
    job.responsibilities = cleanArray(responsibilities);
    job.requirements = cleanArray(requirements);
    job.skills = cleanArray(skills);
    job.benefits = cleanArray(benefits);

    await job.save();

    await job.populate([
      {
        path: "companyId",
        select: "name logoUrl logoFileId industry location",
      },
      {
        path: "categoryId",
        select: "name value",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job.",
    });
  }
}
