import Category from "../models/Category.js";
import Job from "../models/Job.js";

export async function getCategories(req, res) {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: Job.collection.name,
          let: {
            categoryId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$categoryId", "$$categoryId"],
                    },
                    {
                      $eq: ["$status", "open"],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,

                opportunityCount: {
                  $sum: 1,
                },

                internshipCount: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$type", "Internship"],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          as: "jobStats",
        },
      },

      {
        $addFields: {
          opportunityCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$jobStats.opportunityCount", 0],
              },
              0,
            ],
          },

          internshipCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$jobStats.internshipCount", 0],
              },
              0,
            ],
          },
        },
      },

      {
        $unset: "jobStats",
      },

      {
        $sort: {
          name: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
}
