const { default: mongoose } = require("mongoose");
const Collection = require("../models/collection");
const Snippet = require("../models/snippet");
const AppError = require("../utils/appError");

// Add new collection
exports.postCollection = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!req.body.name || req.body.name.trim() === "") {
      return next(new AppError("Name of collection can not be empty", 400));
    }
    const newCollection = new Collection({
      ...req.body,
      userId: userId,
    });
    const savedCollection = await newCollection.save();
    return res.status(201).json({
      success: true,
      message: "Collection saved successfully",
      data: savedCollection,
    });
  } catch (err) {
    return next(err);
  }
};

// List all collections owned by the logged-in-user
exports.getCollections = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const collections = await Collection.find({ userId: userId });
    return res.status(200).json({
      success: true,
      message: "Collections fetched successfully",
      data: collections,
    });
  } catch (err) {
    return next(err);
  }
};

// Get one collection plus all snippets inside it.
exports.getCollectionByIdWithSnippets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const collectionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return next(new AppError("Collection Id is invalid", 400));
    }
    const collection = await Collection.findOne({
      _id: collectionId,
      userId: userId,
    });
    if (!collection) {
      return next(new AppError("Collection is not present in the database", 404));
    }
    const snippets = await Snippet.find({
      collectionId: collectionId,
      userId: userId,
    }).select(
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
    return next(err);
  }
};

// Update collection
exports.updateCollection = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const collectionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return next(new AppError("Collection Id is invalid", 400));
    }
    const collectionToUpdate = await Collection.findOne({
      _id: collectionId,
      userId: userId,
    });
    if (collectionToUpdate) {
      const { name, description, color, icon } = req.body;
      if (name !== undefined) {
        if (name.trim() === "") {
          return next(new AppError("Collection name can not be empty", 400));
        }
        collectionToUpdate.name = name;
      }
      if (description !== undefined)
        collectionToUpdate.description = description;
      if (color !== undefined) collectionToUpdate.color = color;
      if (icon !== undefined) collectionToUpdate.icon = icon;
      const savedCollection = await collectionToUpdate.save();
      return res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        data: savedCollection,
      });
    } else {
      return next(new AppError("Colletion is not present in the database", 404));
    }
  } catch (err) {
    return next(err);
  }
};

// Delete collection
exports.deleteCollection = async(req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.user.userId;
    const collectionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(collectionId)) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Collection id is not valid", 400));
    }
    const collectionToDelete = await Collection.findOne({
      _id: collectionId,
      userId: userId
    }).session(session);

    if(!collectionToDelete) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Collection is not present in the database", 404));
    }
    await Snippet.updateMany({collectionId: collectionId},{collectionId: null}, {session});
    await collectionToDelete.deleteOne({session});
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully"
    })
  }
  catch(err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
}