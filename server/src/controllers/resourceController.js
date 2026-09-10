import Resource from "../models/Resource.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export async function getResources(req, res) {
  try {
    const resources = await Resource.find({
      published: true,
    })
      .select(
        "_id title slug category description readTime level tags featured",
      )
      .sort({
        featured: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources.",
    });
  }
}

export async function getResourceById(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user || user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access only.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    const resource = await Resource.findOne({
      _id: id,
      published: true,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get resource by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource.",
    });
  }
}
