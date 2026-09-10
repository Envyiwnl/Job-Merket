import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import categories from "./data/categories.js";

dotenv.config();

async function seedCategories() {
  try {
    await connectDB();

    await Category.deleteMany({
      source: "seed",
    });

    const createdCategories = await Category.insertMany(categories);

    console.log(`${createdCategories.length} categories seeded successfully.`);
  } catch (error) {
    console.error("Category seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedCategories();
