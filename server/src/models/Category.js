import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    activelyHiring: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      enum: ["seed", "admin"],
      default: "seed",
    },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
