const Collection = require('../models/collection');

// Add new collection
exports.postCollection = async(req,res,next) => {
    try {
        const DummyUserId = "68750b2cf55e1d0e1d7a1234";
        if(!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name of collection can not be empty"
            })
        }
        const newCollection = new Collection({
            ...req.body,
            userId: DummyUserId
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