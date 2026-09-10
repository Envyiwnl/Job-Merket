import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    readTime: {
      type: Number,
      required: true,
      min: 1,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      enum: ["seed", "admin"],
      default: "seed",
    },
  },
  {
    timestamps: true,
  },
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
