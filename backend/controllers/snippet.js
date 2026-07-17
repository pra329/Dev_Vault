const { default: mongoose } = require("mongoose");
const Snippet = require("../models/snippet");

exports.getSnippet = async(req, res, next) => {
  try {
    const DummyUserId = "68750b2cf55e1d0e1d7a1234";
    const { language, type } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = {userId: DummyUserId};
    if(language) query.language = language;
    if(type) query.type = type;
    const snippets = await Snippet.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
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

exports.postSnippet = async(req, res, next) => {
  try {
    const snippet = new Snippet({...req.body});
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

exports.searchSnippet = async(req,res,next) => {
  try {
    const { q } = req.query;
    if(!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }
    const snippets = await Snippet.find({
      $text:{
        $search: q
      }
    });
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

exports.searchById = async(req,res,next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid snippet ID",
      });
    }
    const snippet = await Snippet.findById(id);
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
      if(DUMMY_USER_ID === snippet.userId.toString()) {
        return res.status(200).json({
          success: true,
          data: snippet
        });
      }
      else {
        return res.status(403).json({
          success: false,
          message: "Can not return snippet because owner is someone else",
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

exports.updateSnippet = async(req,res,next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const snippetId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid snippet ID",
      });
    }
    const snippetToUpdate = await Snippet.findById(snippetId);
    if(snippetToUpdate) {
      if(snippetToUpdate.userId.equals(DUMMY_USER_ID)) {
        const {title, code, language, description, tags, type, errorMessage, cause, fixCode, isPublic} = req.body;
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