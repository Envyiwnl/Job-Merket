import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },

    logoUrl: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    industryValue: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    logoFileId: {
      type: String,
      default: "",
    },

    sizeValue: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    workModes: [
      {
        type: String,
        enum: ["Remote", "On-site", "Hybrid"],
      },
    ],

    activelyHiring: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["seed", "recruiter"],
      default: "recruiter",
    },
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
