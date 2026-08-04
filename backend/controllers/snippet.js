const { default: mongoose } = require("mongoose");
const Snippet = require("../models/snippet");
const Collection = require("../models/collection");

// Search snippet on the basis of language, type and page number.
exports.getSnippet = async(req, res, next) => {
  try {
    const userId = req.user.userId;
    const { language, type } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = {userId: userId};
    if(language) query.language = language;
    if(type) query.type = type;
    const snippets = await Snippet.find(query).populate("collectionId", "name description color icon").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalSnippets = await Snippet.countDocuments(query);
    return res.status(200).json({
      success: true,
      page: page,
      totalPages: Math.ceil(totalSnippets / limit),
      totalSnippets: totalSnippets,
      data: snippets
    })
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

// Add new snippet.
exports.postSnippet = async(req, res, next) => {
  try {
    const userId = req.user.userId;
    const { collectionId } = req.body;
    if(collectionId) {
      const collection = await Collection.findById(collectionId);
      if(!collection) {
        return res.status(404).json({
          success: false,
          message: "Collection does not exist"
        })
      }
      if(collection.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Collection belongs to someone else"
        })
      }
    }
    const snippet = new Snippet({...req.body, userId});
    const savedSnippet = await snippet.save();
    return res.status(201).json({
        success: true,
        message: "Snippet saved successfully",
        data: savedSnippet,
    });
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create snippet",
      error: err.message
    })
  }
};

// Search the snippet on tha basis of title, description and tags.
exports.searchSnippet = async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const { q } = req.query;
    if(!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }
    const snippets = await Snippet.find({
      userId: userId,
      $text:{
        $search: q
      }
    }).populate("collectionId", "name description color icon");
    return res.status(200).json({
      success: true,
      data: snippets
    });
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to search snippets",
      error: err.message
    })
  }
};

// Search snippet on the basis of snippet id.
exports.searchById = async(req,res,next) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid snippet ID",
      });
    }
    const snippet = await Snippet.findById(id).populate("collectionId", "name description icon color");
    if(!snippet) {
      return res.status(404).json({
        success: false,
        message: "Snippet does not found"
      });
    }
    if(snippet.isPublic) {
      return res.status(200).json({
        success: true,
        data: snippet
      })
    }
    else {
      if(userId === snippet.userId.toString()) {
        return res.status(200).json({
          success: true,
          data: snippet
        });
      }
      else {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this snippet"
        })
      }
    }
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch snippet by id",
      error: err.message
    })
  }
}

// Update an existing snippet using patch.
exports.updateSnippet = async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const snippetId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid snippet ID",
      });
    }
    const snippetToUpdate = await Snippet.findById(snippetId);
    if(snippetToUpdate) {
      if(snippetToUpdate.userId.equals(userId)) {
        const {collectionId, title, code, language, description, tags, type, errorMessage, cause, fixCode, isPublic} = req.body;
        if (collectionId !== undefined) {
          if(collectionId !== null) {
            if(!mongoose.Types.ObjectId.isValid(collectionId)) {
              return res.status(400).json({
                success: false,
                message: "Invalid collection id"
              })
            }
            const isExist = await Collection.findOne({
              _id: collectionId,
              userId: userId
            });
            if(!isExist) {
              return res.status(404).json({
                success: false,
                message: "Collection does not exist"
            })
            }
          }
          snippetToUpdate.collectionId = collectionId;
        }
        if (title !== undefined) snippetToUpdate.title = title;
        if (code !== undefined) snippetToUpdate.code = code;
        if (language !== undefined) snippetToUpdate.language = language;
        if (description !== undefined) snippetToUpdate.description = description;
        if (tags !== undefined) snippetToUpdate.tags = tags;
        if (type !== undefined) snippetToUpdate.type = type;
        if (errorMessage !== undefined) snippetToUpdate.errorMessage = errorMessage;
        if (cause !== undefined) snippetToUpdate.cause = cause;
        if (fixCode !== undefined) snippetToUpdate.fixCode = fixCode;
        if (isPublic !== undefined) snippetToUpdate.isPublic = isPublic;

        await snippetToUpdate.save();
        return res.status(200).json({
          success: true,
          message: "Snippet updated successfully",
          data: snippetToUpdate
        })
      }
      else {
        return res.status(403).json({
          success: false,
          message: "Not allowed to update because owner is someone else"
        })
      }
    }
    else {
      return res.status(404).json({
        success: false,
        message: "Snippet you want to update does not exist"
      })
    }
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update snippet",
      error: err.message
    })
  }
}

// Delete snippet by id.
exports.deleteSnippet = async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const snippetId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(snippetId)) {
      return res.status(400).json({
        success: false,
        message: "Snippet id is not valid"
      })
    }
    const snippetToDelete = await Snippet.findOne({_id: snippetId, userId});
    if(!snippetToDelete) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found"
      })
    }
    await snippetToDelete.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Snippet deleted successfully"
    })
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete snippet",
      error: err.message
    })
  }
}

// Get list of unique tags for logged-in user.
exports.getUniqueTags = async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const tags = await Snippet.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id:{
            $toLower: "$tags"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    const uniqueTags = tags.map((tag) => tag._id);
    return res.status(200).json({
      success: true,
      data: uniqueTags
    })
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get unique tags"
    })
  }
}