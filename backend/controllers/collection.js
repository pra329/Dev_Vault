const Collection = require('../models/collection');

// Add new collection
exports.postCollection = async(req,res,next) => {
    try {
        const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
        if(!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name of collection can not be empty"
            })
        }
        const newCollection = new Collection({
            ...req.body,
            userId: DUMMY_USER_ID
        });
        const savedCollection = await newCollection.save();
        return res.status(201).json({
            success: true,
            message: "Collection saved successfully",
            data: savedCollection
        })
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create new collection",
            error: err.message
        })
    }
}

// List all collections owned by the logged-in-user
exports.getCollections = async(req,res,next) => {
    try {
        const DUMMY_USER_ID = "68750b2cf55e1d0e1d7a1234";
        const collections = await Collection.find({userId: DUMMY_USER_ID});
        return res.status(200).json({
            success: true,
            message: "Collections fetched successfully",
            data: collections
        })
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch collections",
            error: err.message
        })
    }
}