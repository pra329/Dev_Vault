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
    const snippets = await Snippet.find({
      collectionId: collectionId,
      userId: DUMMY_USER_ID,
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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch collection by id with snippets",
      error: err.message,
    });
  }
};

// Update collection
exports.updateCollection = async (req, res, next) => {
  try {
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const collectionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({
        success: false,
        message: "Collection Id is invalid",
      });
    }
    const collectionToUpdate = await Collection.findOne({
      _id: collectionId,
      userId: DUMMY_USER_ID,
    });
    if (collectionToUpdate) {
      const { name, description, color, icon } = req.body;
      if (name !== undefined) {
        if (name.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "collection name can not be empty",
          });
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
      return res.status(404).json({
        success: false,
        message: "Colletion is not present in the database",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update a collection",
      error: err.message,
    });
  }
};

// Delete collection
exports.deleteCollection = async(req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
    const collectionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(collectionId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Collection id is not valid"
      })
    }
    const collectionToDelete = await Collection.findOne({
      _id: collectionId,
      userId: DUMMY_USER_ID
    }).session(session);

    if(!collectionToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Collection is not present in the database"
      })
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
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting the collection",
      error: err.message
    })
  }
}