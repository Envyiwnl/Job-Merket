import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      required: true,
    },

    experience: {
      type: String,
      enum: ["Fresher", "Entry Level", "Mid Level", "Senior Level"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      required: true,
    },

    salary: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },

      max: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        default: "INR",
      },

      period: {
        type: String,
        enum: ["year", "month"],
        default: "year",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "open",
      index: true,
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

const Job = mongoose.model("Job", jobSchema);

export default Job;
