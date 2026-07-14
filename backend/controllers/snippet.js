const Snippet = require("../models/snippet");

exports.getSnippet = (req, res, next) => {
  const DummyUserId = "68750b2cf55e1d0e1d7a1234";
  const { language, type} = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const query = {userId: DummyUserId};
  if(language) query.language = language;
  if(type) query.type = type;
  
  Snippet.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .then((snippets) => {
      return res.status(200).json({
        success: true,
        data: snippets,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });
};

exports.postSnippet = (req, res, next) => {
  const {
    userId,
    title,
    code,
    language,
    description,
    tags,
    type,
    errorMessage,
    cause,
    fixCode,
    isPublic,
  } = req.body;
  const snippet = new Snippet({
    userId,
    title,
    code,
    language,
    description,
    tags,
    type,
    errorMessage,
    cause,
    fixCode,
    isPublic,
  });
  snippet
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Snippet saved successfully",
        data: snippet,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Failed to save snippet",
        error: err.message,
      });
    });
};
