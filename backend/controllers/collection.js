const { default: mongoose } = require("mongoose");
const Collection = require("../models/collection");
const Snippet = require("../models/snippet");

// Add new collection
exports.postCollection = async (req, res, next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name of collection can not be empty",
      });
    }
    const newCollection = new Collection({
      ...req.body,
      userId: DUMMY_USER_ID,
    });
    const savedCollection = await newCollection.save();
    return res.status(201).json({
      success: true,
      message: "Collection saved successfully",
      data: savedCollection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create new collection",
      error: err.message,
    });
  }
};

// List all collections owned by the logged-in-user
exports.getCollections = async (req, res, next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const collections = await Collection.find({ userId: DUMMY_USER_ID });
    return res.status(200).json({
      success: true,
      message: "Collections fetched successfully",
      data: collections,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
      error: err.message,
    });
  }
};

// Get one collection plus all snippets inside it.
exports.getCollectionByIdWithSnippets = async (req, res, next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const collectionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({
        success: false,
        message: "Collection Id is invalid",
      });
    }
    const collection = await Collection.findOne({
      _id: collectionId,
      userId: DUMMY_USER_ID,
    });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection is not present in the database",
      });
    }
    const snippets = await Snippet.find({ collectionId: collectionId, userId: DUMMY_USER_ID }).select(
      "title code language description tags type errorMessage cause fixCode isPublic likes copyCount createdAt updatedAt",
    );
    const collectionWithSnippets = {
      collection,
      snippets,
    };
    return res.status(200).json({
      success: true,
      data: collectionWithSnippets,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch collection by id with snippets",
      error: err.message,
    });
  }
};