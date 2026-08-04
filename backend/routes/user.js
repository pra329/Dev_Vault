const express = require('express');
const userRouter = express.Router();
const { registerUser } = require('../controllers/user');
const { loginUser } = require('../controllers/user'); 
const { auth } = require('../middleware/auth');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get("/test", auth, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

exports.userRouter = userRouter;