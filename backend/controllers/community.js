const { default: mongoose } = require("mongoose");
const Snippet = require("../models/snippet");
const User = require('../models/user');
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

exports.toggleLike = async(req, res, next) => {
  try {
    const userId = req.user.userId;
    const snippetId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      return next(new AppError("Snippet Id is invalid", 400));
    }
    const snippet = await Snippet.findById(snippetId);
    if(!snippet) {
      return next(new AppError("Snippet not found", 404));
    }
    if(!snippet.isPublic) {
      return next(new AppError("You can not like the private snippet", 403));
    }
    const alredyLiked = snippet.likes.some((id) => {
      return id.toString() === userId.toString();
    })
    let updatedSnippet;
    if(alredyLiked) {
      updatedSnippet = await Snippet.findByIdAndUpdate(
        snippetId,
        {
          $pull: {likes: userId}
        },
        {returnDocument: 'after'}
      );
    }
    else {
      updatedSnippet = await Snippet.findByIdAndUpdate(
        snippetId,
        {
          $addToSet: {likes: userId}
        },
        {returnDocument: 'after'}
      );
    }
    return res.status(200).json({
      success: true,
      liked: !alredyLiked,
      likeCount: updatedSnippet.likes.length
    });
  }
  catch(err) {
    return next(err);
  }
}

exports.toggleStar = async(req ,res, next) => {
  try {
    const userId = req.user.userId;
    const snippetId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(snippetId)) {
      return next(new AppError("Snippet Id is not valid", 400));
    }
    const snippet = await Snippet.findById(snippetId);
    if(!snippet) {
      return next(new AppError("Snippet does not exist", 404));
    }
    if(!snippet.isPublic) {
      return next(new AppError("Snippet can not be starred it is private", 403));
    }
    const user = await User.findById(userId).select("starred");
    if(!user) {
      return next(new AppError("User does not exist", 404));
    }
    const isStarred = user.starred.some(id => id.toString() === snippetId);
    let updatedUser;
    if(isStarred) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {starred: snippetId}
        },
        {returnDocument: 'after'}
      );
    }
    else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {starred: snippetId}
        },
        {returnDocument: 'after'}
      );
    }
    return res.status(200).json({
      success: true,
      starred: !isStarred,
      starredCount: updatedUser.starred.length
    })
  }
  catch(err) {
    return next(err);
  }
}