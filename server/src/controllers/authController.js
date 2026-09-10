import User from "../models/User.js";
import Company from "../models/Company.js";
import {
  uploadResumeToDrive,
  getResumeFromDrive,
  uploadCompanyLogoToDrive,
} from "../services/googleDriveService.js";

const allowedWorkModes = ["Remote", "On-site", "Hybrid"];

function isValidWorkModes(workModes) {
  return (
    Array.isArray(workModes) &&
    workModes.every((mode) => allowedWorkModes.includes(mode))
  );
}

function toValue(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function normalizeWebsite(website) {
  const trimmedWebsite = website.trim();

  return /^https?:\/\//i.test(trimmedWebsite)
    ? trimmedWebsite
    : `https://${trimmedWebsite}`;
}

function getDomainFromWebsite(website) {
  try {
    const url = new URL(
      website.startsWith("http") ? website : `https://${website}`,
    );

    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export async function registerUser(req, res) {
  try {
    const firebaseUser = req.firebaseUser;
    const { name, role } = req.body;
    if (!name?.trim() || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
      });
    }
    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const existingUser = await User.findOne({ firebaseUid: firebaseUser.uid });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User profile already exists" });
    }
    const user = await User.create({
      firebaseUid: firebaseUser.uid,
      name: name.trim(),
      email: firebaseUser.email,
      role,
    });
    return res
      .status(201)
      .json({ success: true, message: "User created Successfully", user });
  } catch (error) {
    console.error("Register user error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create user profile." });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    }).populate("companyId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user profile.",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { name, phone, headline, location, experience, skills } = req.body;

    const user = await User.findOne({
      firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (headline !== undefined) {
      user.headline = headline.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (experience !== undefined) {
      user.experience = experience;
    }

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((skill) => skill.trim()).filter(Boolean)
        : user.skills;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
}

export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required.",
      });
    }

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    const driveFile = await uploadResumeToDrive(
      req.file,
      user.firebaseUid,
      user.resumeFileId,
    );

    user.resumeFileId = driveFile.id;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resumeFileId: driveFile.id,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });
  }
}

export async function getResume(req, res) {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    if (!user.resumeFileId) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const { metadata, stream } = await getResumeFromDrive(user.resumeFileId);

    res.setHeader(
      "Content-Type",
      metadata.mimeType || "application/octet-stream",
    );

    res.setHeader("Content-Disposition", `inline; filename="${metadata.name}"`);

    stream.on("error", (error) => {
      console.error("Resume stream error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to read resume.",
        });
      } else {
        res.end();
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Get resume error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch resume.",
      });
    }
  }
}

export async function updateRecruiterProfile(req, res) {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const {
      name,
      phone,
      position,

      companyName,
      website,
      industry,
      size,
      location,
      description,
      workModes,
    } = req.body;

    const user = await User.findOne({
      firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required.",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (position !== undefined) {
      user.position = position.trim();
    }

    const companyFieldsProvided =
      companyName !== undefined ||
      website !== undefined ||
      industry !== undefined ||
      size !== undefined ||
      location !== undefined ||
      description !== undefined ||
      workModes !== undefined;

    if (companyFieldsProvided) {
      let company = null;

      if (user.companyId) {
        company = await Company.findById(user.companyId);
      }

      if (workModes !== undefined && !isValidWorkModes(workModes)) {
        return res.status(400).json({
          success: false,
          message: "Invalid work mode.",
        });
      }

      if (!company) {
        if (
          !companyName?.trim() ||
          !website?.trim() ||
          !industry?.trim() ||
          !size?.trim() ||
          !location?.trim() ||
          !description?.trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Company name, website, industry, size, location and description are required.",
          });
        }

        const normalizedWebsite = normalizeWebsite(website);
        const domain = getDomainFromWebsite(normalizedWebsite);

        if (!domain) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid company website.",
          });
        }

        company = await Company.create({
          name: companyName.trim(),
          domain,
          website: normalizedWebsite,
          industry: industry.trim(),
          industryValue: toValue(industry),
          size: size.trim(),
          sizeValue: toValue(size),
          location: location.trim(),
          description: description.trim(),
          workModes: Array.isArray(workModes) ? workModes : [],
          source: "recruiter",
        });

        user.companyId = company._id;
      } else {
        if (companyName !== undefined) {
          if (!companyName.trim()) {
            return res
              .status(400)
              .json({ success: false, message: "Company Name is required." });
          }
          company.name = companyName.trim();
        }

        if (website !== undefined) {
          if (!website.trim()) {
            return res.status(400).json({
              success: false,
              message: "Company website is required.",
            });
          }

          const normalizedWebsite = normalizeWebsite(website);
          const domain = getDomainFromWebsite(normalizedWebsite);

          if (!domain) {
            return res.status(400).json({
              success: false,
              message: "Please provide a valid company website.",
            });
          }

          company.website = normalizedWebsite;
          company.domain = domain;
        }

        if (industry !== undefined) {
          if (!industry.trim()) {
            return res.status(400).json({
              success: false,
              message: "Industry is required.",
            });
          }
          company.industry = industry.trim();
          company.industryValue = toValue(industry);
        }

        if (size !== undefined) {
          if (!size.trim()) {
            return res
              .status(400)
              .json({ success: false, message: "Size is required." });
          }
          company.size = size.trim();
          company.sizeValue = toValue(size);
        }

        if (location !== undefined) {
          if (!location.trim()) {
            return res
              .status(400)
              .json({ success: false, message: "Location is required." });
          }
          company.location = location.trim();
        }

        if (description !== undefined) {
          if (!description.trim()) {
            return res
              .status(400)
              .json({ success: false, message: "Description is required." });
          }
          company.description = description.trim();
        }

        if (workModes !== undefined) {
          company.workModes = workModes;
        }

        await company.save();
      }
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate("companyId");

    return res.status(200).json({
      success: true,
      message: "Recruiter profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A company with this name or domain already exists.",
      });
    }

    console.error("Update recruiter profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update recruiter profile.",
    });
  }
}

export async function uploadCompanyLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Company logo is required.",
      });
    }

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only.",
      });
    }

    if (!user.companyId) {
      return res.status(400).json({
        success: false,
        message: "Complete your company profile before uploading a logo.",
      });
    }

    const company = await Company.findById(user.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const driveFile = await uploadCompanyLogoToDrive(
      req.file,
      company._id.toString(),
      company.logoFileId,
    );

    company.logoFileId = driveFile.id;

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company logo uploaded successfully.",
      logoFileId: driveFile.id,
    });
  } catch (error) {
    console.error("Company logo upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload company logo.",
    });
  }
}
