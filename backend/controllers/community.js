const Snippet = require("../models/snippet");
const AppError = require("../utils/appError");

exports.getPublicSnippets = async (req, res, next) => {
  try {
    const { sort, language, page, limit } = req.query;
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Number(limit) || 5, 50);
    const skip = (pageNumber - 1) * limitNumber;
    const sortBy = sort || "new";
    if (sortBy !== "new" && sortBy !== "trending") {
      return next(new AppError("Invalid sort option", 400));
    }
    const filter = { isPublic: true };
    if (language) filter.language = language;
    const total = await Snippet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);
    if (sortBy === "new") {
      const snippets = await Snippet.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
      return res.status(200).json({
        success: true,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: total,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
        data: snippets,
      });
    }
    const snippets = await Snippet.aggregate([
      {
        $match: filter,
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
        },
      },
      {
        $addFields: {
          ageInDays: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: [2, "$likeCount"] },
              "$copyCount",
              {
                $divide: [10, { $add: ["$ageInDays", 1] }],
              },
            ],
          },
        },
      },
      {
        $sort: {
          trendingScore: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNumber,
      },
    ]);
    return res.status(200).json({
      success: true,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
      data: snippets,
    });
  } catch (err) {
    return next(err);
  }
};