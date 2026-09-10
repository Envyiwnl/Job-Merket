import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Resource from "../models/Resource.js";
import resources from "./data/resources.js";

dotenv.config();

async function seedResources() {
  try {
    await connectDB();

    await Resource.deleteMany({
      source: "seed",
    });

    const createdResources =
      await Resource.insertMany(resources);

    console.log(
      `${createdResources.length} resources seeded successfully.`,
    );
  } catch (error) {
    console.error(
      "Resource seeding failed:",
      error.message,
    );
  } finally {
    await mongoose.connection.close();
  }
}

seedResources();