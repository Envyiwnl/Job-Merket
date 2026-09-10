import Company from "../models/Company.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import { getCompanyLogoFromDrive } from "../services/googleDriveService.js";

export async function getCompanies(req, res) {
  try {
    const {
      search = "",
      location = "",
      industry = "",
      size,
      mode,
      hiring,
      sort = "jobs-high",
      page = 1,
      limit = 6,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          industry: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
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

    if (industry) {
      query.industryValue = industry;
    }

    const sizes = Array.isArray(size) ? size : size ? [size] : [];

    const modes = Array.isArray(mode) ? mode : mode ? [mode] : [];

    if (sizes.length) {
      query.sizeValue = {
        $in: sizes,
      };
    }

    if (modes.length) {
      query.workModes = {
        $in: modes,
      };
    }

    if (hiring === "true") {
      query.activelyHiring = true;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 6, 1), 100);

    let sortOption = {
      openJobs: -1,
      name: 1,
    };

    if (sort === "jobs-low") {
      sortOption = {
        openJobs: 1,
        name: 1,
      };
    }

    if (sort === "name-asc") {
      sortOption = {
        name: 1,
      };
    }

    if (sort === "name-desc") {
      sortOption = {
        name: -1,
      };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [companies, totalCompanies] = await Promise.all([
      Company.aggregate([
        {
          $match: query,
        },

        {
          $lookup: {
            from: Job.collection.name,
            let: {
              companyId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$companyId", "$$companyId"],
                      },
                      {
                        $eq: ["$status", "open"],
                      },
                    ],
                  },
                },
              },

              {
                $count: "count",
              },
            ],
            as: "jobStats",
          },
        },

        {
          $addFields: {
            openJobs: {
              $ifNull: [
                {
                  $arrayElemAt: ["$jobStats.count", 0],
                },
                0,
              ],
            },
          },
        },

        {
          $unset: "jobStats",
        },

        {
          $sort: sortOption,
        },

        {
          $skip: skip,
        },

        {
          $limit: limitNumber,
        },
      ]),

      Company.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      companies,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalCompanies,
        totalPages: Math.ceil(totalCompanies / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies.",
    });
  }
}

export async function getCompanyById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const jobs = await Job.find({
      companyId: company._id,
      status: "open",
    })
      .populate("companyId", "name logoUrl industry location")
      .populate("categoryId", "name value")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      company: {
        ...company.toObject(),
        openJobs: jobs.length,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get company error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company.",
    });
  }
}

export async function getCompanyLogo(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!company.logoFileId) {
      return res.status(404).json({
        success: false,
        message: "Company logo not found.",
      });
    }

    const { metadata, stream } = await getCompanyLogoFromDrive(
      company.logoFileId,
    );

    res.setHeader(
      "Content-Type",
      metadata.mimeType || "application/octet-stream",
    );

    res.setHeader("Content-Disposition", `inline; filename="${metadata.name}"`);

    res.setHeader("Cache-Control", "no-cache");

    stream.on("error", (error) => {
      console.error("Company logo stream error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to read company logo.",
        });
      } else {
        res.end();
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Get company logo error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch company logo.",
      });
    }
  }
}
