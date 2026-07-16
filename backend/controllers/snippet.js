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