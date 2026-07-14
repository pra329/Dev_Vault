const User = require('../models/user');

exports.postUser = (req,res,next) => {
    const {name} = req.body;
    const user = new User({name});
    user.save().then(()=>{
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        })
    })
    .catch((err)=>{
        return res.status(500).json({
            success: false,
            message: 'Error occured while creatin user',
            error: err
        })
    })
}