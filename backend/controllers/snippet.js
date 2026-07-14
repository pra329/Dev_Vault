const Snippet = require("../models/snippet");

exports.getSnippet = (req, res, next) => {
  return res.json({
    success: true,
    message: "Snippet fetched successfully",
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
    isPublic
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
