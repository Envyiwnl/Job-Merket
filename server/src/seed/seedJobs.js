import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Category from "../models/Category.js";
import jobs from "./data/jobs.js";

dotenv.config();

async function seedJobs() {
  try {
    await connectDB();

    const companies = await Company.find({
      source: "seed",
    });

    const categories = await Category.find({
      source: "seed",
    });

    const companyMap = new Map(
      companies.map((company) => [company.name, company._id]),
    );

    const categoryMap = new Map(
      categories.map((category) => [category.value, category._id]),
    );

    const preparedJobs = jobs.map((job) => {
      const companyId = companyMap.get(job.companyName);

      const categoryId = categoryMap.get(job.categoryValue);

      if (!companyId) {
        throw new Error(`Company not found for seeded job: ${job.companyName}`);
      }

      if (!categoryId) {
        throw new Error(
          `Category not found for seeded job: ${job.categoryValue}`,
        );
      }

      const { companyName, categoryValue, ...jobData } = job;

      return {
        ...jobData,
        companyId,
        categoryId,
        recruiterId: null,
        source: "seed",
      };
    });

    await Job.deleteMany({
      source: "seed",
    });

    const createdJobs = await Job.insertMany(preparedJobs);

    console.log(`${createdJobs.length} jobs seeded successfully.`);
  } catch (error) {
    console.error("Job seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedJobs();
