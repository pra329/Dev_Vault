const User = require('../models/user');

exports.postUser = async(req,res,next) => {
    try {
        const {name} = req.body;
        const user = new User({name});
        const savedUser = await user.save();
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: savedUser
        })
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
            message: err.message
        })
    }
}