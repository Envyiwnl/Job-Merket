import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Company from "../models/Company.js";
import companies from "./data/companies.js";

dotenv.config();

async function seedCompanies() {
  try {
    await connectDB();

    const logoToken = process.env.LOGO_DEV_TOKEN;

    if (!logoToken) {
      throw new Error("LOGO_DEV_TOKEN is missing from .env");
    }

    const companyData = companies.map((company) => ({
      ...company,

      logoUrl: `https://img.logo.dev/${company.domain}` + `?token=${logoToken}`,

      source: "seed",
    }));

    await Company.deleteMany({
      source: "seed",
    });

    const createdCompanies = await Company.insertMany(companyData);

    console.log(`${createdCompanies.length} companies seeded successfully.`);
  } catch (error) {
    console.error("Company seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedCompanies();
